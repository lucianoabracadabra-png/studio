'use server';
/**
 * @fileOverview Processes a game session transcript to generate a structured summary, including a title, subtitle, cover image, and detailed lists of highlights, NPCs, items, and locations.
 * This file implements a sequential chunking orchestration pattern to handle large transcripts without exceeding API limits.
 *
 * - processSession - The main orchestrator function.
 * - ProcessSessionInput - The input type for the processSession function.
 * - ProcessSessionOutput - The return type for the processSession function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

// #################################################################
// # 1. Schemas                                                    #
// #################################################################

const HighlightSchema = z.object({
  title: z.string().describe("Um título curto e impactante para o evento."),
  scene_description: z.string().describe("Uma breve descrição da cena ou do momento."),
  transcript_excerpt: z.string().describe("Um trecho relevante da transcrição que captura o momento.")
});
type Highlight = z.infer<typeof HighlightSchema>;

const NpcSchema = z.object({
  name: z.string().describe("O nome do NPC."),
  description: z.string().describe("Uma breve descrição visual e da interação com o NPC.")
});
type Npc = z.infer<typeof NpcSchema>;


const ItemSchema = z.object({
  name: z.string().describe("O nome do item importante."),
  transcript_excerpt: z.string().describe("A transcrição da cena onde o item apareceu ou foi significativo.")
});
type Item = z.infer<typeof ItemSchema>;

const LocationSchema = z.object({
  name: z.string().describe("O nome do lugar importante."),
  description: z.string().describe("Uma breve descrição do lugar.")
});
type Location = z.infer<typeof LocationSchema>;

const PlayerCharacterSchema = z.object({
  name: z.string().describe("O nome do personagem do jogador."),
  appearance_description: z.string().describe("Uma breve descrição da aparição ou de uma ação marcante do personagem na sessão.")
});
type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;

// Input for the main orchestrator
const ProcessSessionInputSchema = z.object({
  transcript: z.string().describe("A transcrição completa da sessão de jogo em formato de texto."),
});
export type ProcessSessionInput = z.infer<typeof ProcessSessionInputSchema>;


// Schema for the output from the synthesis prompt (without image URL)
const SynthesisOutputSchema = z.object({
    title: z.string().describe("Um título criativo e curto para a sessão, como o de um episódio."),
    subtitle: z.string().describe("Um subtítulo que complementa o título, dando mais contexto."),
    image_prompt: z.string().describe("Um prompt detalhado em inglês para um modelo de geração de imagem, descrevendo uma cena épica e representativa da sessão para ser usada como arte de capa. O prompt deve ser cinematográfico e visualmente rico."),
    highlights: z.array(HighlightSchema).max(10).describe("Uma lista de até 10 dos momentos mais importantes da sessão."),
    npcs: z.array(NpcSchema).describe("Uma lista de NPCs que apareceram na sessão."),
    player_characters: z.array(PlayerCharacterSchema).describe("Uma lista dos personagens dos jogadores que apareceram e suas ações marcantes."),
    items: z.array(ItemSchema).describe("Uma lista de itens importantes que surgiram na sessão."),
    locations: z.array(LocationSchema).describe("Uma lista de lugares importantes visitados ou mencionados."),
});


// Final output of the orchestrator
const ProcessSessionOutputSchema = SynthesisOutputSchema.extend({
  coverImageUrl: z.string().url().describe("A URL da imagem de capa gerada."),
});
export type ProcessSessionOutput = z.infer<typeof ProcessSessionOutputSchema>;


// Schema for the raw, unprocessed data from each chunk
const RawChunkDataSchema = z.object({
  highlights: z.array(HighlightSchema).optional(),
  npcs: z.array(NpcSchema).optional(),
  player_characters: z.array(PlayerCharacterSchema).optional(),
  items: z.array(ItemSchema).optional(),
  locations: z.array(LocationSchema).optional(),
});
type RawChunkData = z.infer<typeof RawChunkDataSchema>;

// Schema for the refined data sent to the synthesis prompt
const SynthesisInputSchema = z.object({
  all_highlights: z.array(HighlightSchema),
  all_npcs: z.array(NpcSchema),
  all_player_characters: z.array(PlayerCharacterSchema),
  all_items: z.array(ItemSchema),
  all_locations: z.array(LocationSchema),
});


// #################################################################
// # 2. Helper Functions                                           #
// #################################################################

/**
 * Splits text into chunks, respecting word boundaries.
 */
function splitTranscriptIntoChunks(transcript: string, chunkSize: number = 20000): string[] {
    const chunks: string[] = [];
    if (!transcript) return chunks;

    let currentStart = 0;
    while (currentStart < transcript.length) {
        let currentEnd = currentStart + chunkSize;
        if (currentEnd >= transcript.length) {
            chunks.push(transcript.substring(currentStart));
            break;
        }

        // Find the next sentence-ending punctuation to avoid splitting mid-sentence
        const punctuationIndex = transcript.substring(currentEnd).search(/[.!?]\s/);
        if (punctuationIndex !== -1) {
            currentEnd += punctuationIndex + 1;
        }
        
        chunks.push(transcript.substring(currentStart, currentEnd));
        currentStart = currentEnd;
    }
    return chunks;
}


/**
 * Pre-processes and deduplicates data from all chunks.
 */
function preProcessData(allChunksData: RawChunkData[]): z.infer<typeof SynthesisInputSchema> {
    const consolidated = {
        highlights: [] as Highlight[],
        npcs: new Map<string, Npc>(),
        player_characters: new Map<string, PlayerCharacter>(),
        items: new Map<string, Item>(),
        locations: new Map<string, Location>(),
    };

    for (const chunk of allChunksData) {
        if (chunk.highlights) consolidated.highlights.push(...chunk.highlights);
        chunk.npcs?.forEach(npc => !consolidated.npcs.has(npc.name.toLowerCase()) && consolidated.npcs.set(npc.name.toLowerCase(), npc));
        chunk.player_characters?.forEach(pc => !consolidated.player_characters.has(pc.name.toLowerCase()) && consolidated.player_characters.set(pc.name.toLowerCase(), pc));
        chunk.items?.forEach(item => !consolidated.items.has(item.name.toLowerCase()) && consolidated.items.set(item.name.toLowerCase(), item));
        chunk.locations?.forEach(loc => !consolidated.locations.has(loc.name.toLowerCase()) && consolidated.locations.set(loc.name.toLowerCase(), loc));
    }
    
    return {
        all_highlights: consolidated.highlights,
        all_npcs: Array.from(consolidated.npcs.values()),
        all_player_characters: Array.from(consolidated.player_characters.values()),
        all_items: Array.from(consolidated.items.values()),
        all_locations: Array.from(consolidated.locations.values()),
    };
}


// #################################################################
// # 3. AI Prompts                                                 #
// #################################################################

const extractInsightsPrompt = ai.definePrompt({
    name: 'extractInsightsPrompt',
    inputSchema: z.object({ content: z.string(), previous_context: z.string().optional() }),
    outputSchema: RawChunkDataSchema,
    model: googleAI.model('gemini-1.5-flash'),
    config: { temperature: 0.2 },
    prompt: `
        You are an expert RPG session analyst. Your task is to extract key information from a segment of a game transcript.
        Do not make up information. If a category is not present, return an empty array for it.
        
        {{#if previous_context}}
        PREVIOUS CONTEXT: The summary of the previous part of the session was: "{{{previous_context}}}". Use this to understand the ongoing narrative, but focus on extracting ONLY the NEW information present in the current segment.
        {{/if}}

        Focus ONLY on the content within this segment:
        ---
        {{{content}}}
        ---

        Extract the following, if present:
        - Highlights: Key moments, decisions, or surprising events.
        - NPCs: Any non-player characters mentioned or interacted with for the first time in this segment.
        - Player Characters: Any player characters mentioned and their significant actions in this segment.
        - Items: Any relevant items that were found, used, ou mentioned.
        - Locations: Any new places visited or described.
    `,
});

const synthesizeInsightsPrompt = ai.definePrompt({
    name: 'synthesizeInsightsPrompt',
    inputSchema: SynthesisInputSchema,
    outputSchema: SynthesisOutputSchema,
    model: googleAI.model('gemini-1.5-flash'),
    config: { temperature: 0.7 },
    prompt: `
        You are a master editor and storyteller for a tabletop RPG group. You have received pre-processed and consolidated lists of highlights, NPCs, items, and locations from an entire game session.
        Your job is to synthesize this information into a single, coherent, and polished summary.

        - Title & Subtitle: Based on all the information, create a creative and engaging title and subtitle for the entire session.
        - Refine Highlights: From the provided list of all highlights, select the BEST and MOST IMPACTFUL 10 highlights. Rephrase them for clarity and impact.
        - Refine Lists: The provided lists of NPCs, characters, items, and locations have been pre-processed to remove duplicates. Simply return them as they are, but you can correct minor typos or formatting if needed.
        - Image Prompt: Based on the MOST epic moment from the highlights, create a detailed, cinematic, and visually rich prompt IN ENGLISH for an AI image generator to create cover art.

        Here is the pre-processed data:
        ---
        All Highlights:
        {{{json all_highlights}}}

        All NPCs:
        {{{json all_npcs}}}

        All Player Characters:
        {{{json all_player_characters}}}

        All Items:
        {{{json all_items}}}
        
        All Locations:
        {{{json all_locations}}}
        ---

        Produce a final, clean, and well-structured JSON output with the refined information.
    `,
});


// #################################################################
// # 4. Flows                                                      #
// #################################################################

/**
 * Flow to extract insights from a single chunk of text, with optional context from the previous chunk.
 */
const extractInsightsFlow = ai.defineFlow(
    {
        name: 'extractInsightsFlow',
        inputSchema: z.object({ content: z.string(), previous_context: z.string().optional() }),
        outputSchema: RawChunkDataSchema,
    },
    async (input) => {
        const { output } = await extractInsightsPrompt(input);
        return output!;
    }
);

/**
 * Flow to synthesize and refine data from all chunks.
 */
const synthesizeInsightsFlow = ai.defineFlow(
    {
        name: 'synthesizeInsightsFlow',
        inputSchema: SynthesisInputSchema,
        outputSchema: SynthesisOutputSchema,
    },
    async (input) => {
        const { output } = await synthesizeInsightsPrompt(input);
        return output!;
    }
);

/**
 * Flow to generate the cover image.
 */
const generateCoverImageFlow = ai.defineFlow(
    {
        name: 'generateCoverImageFlow',
        inputSchema: z.object({ prompt: z.string() }),
        outputSchema: z.string().url(),
    },
    async ({ prompt }) => {
        const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `fantasy art, epic, cinematic, high detail, ${prompt}`,
            config: {
                aspectRatio: '16:9',
            }
        });
        return media.url!;
    }
);


// #################################################################
// # 5. ORCHESTRATOR FLOW                                          #
// #################################################################

export async function processSession(input: ProcessSessionInput): Promise<ProcessSessionOutput> {
    // Step 1: Divide the transcript into a manageable number of chunks.
    const chunks = splitTranscriptIntoChunks(input.transcript, 20000);
    
    // Step 2: Process chunks SEQUENTIALLY to build context.
    const extractedData: RawChunkData[] = [];
    let previousContext: string | undefined = undefined;

    for (const chunk of chunks) {
        try {
            const result = await extractInsightsFlow({ content: chunk, previous_context: previousContext });
            if (result) {
                extractedData.push(result);
                // The context for the next chunk is a summary of the highlights of the current one.
                previousContext = result.highlights?.map(h => h.title).join(', ') || undefined;
            }
        } catch (error) {
            console.error("Error processing a chunk, continuing...", error);
            // Push an empty result to maintain array length if a chunk fails
            extractedData.push({ highlights: [], npcs: [], player_characters: [], items: [], locations: [] });
        }
    }
    
    // Step 3: Pre-process the raw data to deduplicate and consolidate.
    const preProcessedData = preProcessData(extractedData);

    // Step 4: Synthesize the consolidated data into a final summary and generate the image prompt.
    const synthesizedData = await synthesizeInsightsFlow(preProcessedData);

    // Step 5: Generate the cover image in parallel using the prompt from the previous step.
    const imageUrl = await generateCoverImageFlow({ prompt: synthesizedData.image_prompt });

    // Final Step: Combine and return the results
    return {
        ...synthesizedData,
        coverImageUrl: imageUrl,
    };
}