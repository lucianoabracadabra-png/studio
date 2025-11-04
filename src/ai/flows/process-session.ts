
'use server';
/**
 * @fileOverview Processes a game session transcript to generate a structured summary, including a title, subtitle, cover image, and detailed lists of highlights, NPCs, items, and locations.
 * This file implements a 10-step orchestration pattern.
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

const NpcSchema = z.object({
  name: z.string().describe("O nome do NPC."),
  description: z.string().describe("Uma breve descrição visual e da interação com o NPC.")
});

const ItemSchema = z.object({
  name: z.string().describe("O nome do item importante."),
  transcript_excerpt: z.string().describe("A transcrição da cena onde o item apareceu ou foi significativo.")
});

const LocationSchema = z.object({
  name: z.string().describe("O nome do lugar importante."),
  description: z.string().describe("Uma breve descrição do lugar.")
});

const PlayerCharacterSchema = z.object({
  name: z.string().describe("O nome do personagem do jogador."),
  appearance_description: z.string().describe("Uma breve descrição da aparição ou de uma ação marcante do personagem na sessão.")
});

// Input for the main orchestrator
const ProcessSessionInputSchema = z.object({
  transcript: z.string().describe("A transcrição completa da sessão de jogo em formato de texto."),
});
export type ProcessSessionInput = z.infer<typeof ProcessSessionInputSchema>;


// Final output of the orchestrator, including the cover image URL
const ProcessSessionOutputSchema = z.object({
  title: z.string().describe("Um título criativo e curto para a sessão, como o de um episódio."),
  subtitle: z.string().describe("Um subtítulo que complementa o título, dando mais contexto."),
  coverImageUrl: z.string().url().describe("A URL da imagem de capa gerada."),
  highlights: z.array(HighlightSchema).max(10).describe("Uma lista de até 10 dos momentos mais importantes da sessão."),
  npcs: z.array(NpcSchema).describe("Uma lista de NPCs que apareceram na sessão."),
  player_characters: z.array(PlayerCharacterSchema).describe("Uma lista dos personagens dos jogadores que apareceram e suas ações marcantes."),
  items: z.array(ItemSchema).describe("Uma lista de itens importantes que surgiram na sessão."),
  locations: z.array(LocationSchema).describe("Uma lista de lugares importantes visitados ou mencionados."),
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
  highlights: z.array(HighlightSchema),
  npcs: z.array(NpcSchema),
  player_characters: z.array(PlayerCharacterSchema),
  items: z.array(ItemSchema),
  locations: z.array(LocationSchema),
});

// Schema for the output from the synthesis prompt (without image URL)
const SynthesisOutputSchema = ProcessSessionOutputSchema.omit({ coverImageUrl: true }).extend({
    image_prompt: z.string().describe("Um prompt detalhado em inglês para um modelo de geração de imagem, descrevendo uma cena épica e representativa da sessão para ser usada como arte de capa. O prompt deve ser cinematográfico e visualmente rico."),
});


// #################################################################
// # 2. Helper Functions                                           #
// #################################################################

/**
 * Splits text into a specified number of chunks.
 */
function splitTranscriptIntoChunks(transcript: string, numChunks: number): string[] {
    const chunks: string[] = [];
    const totalLength = transcript.length;
    const chunkSize = Math.ceil(totalLength / numChunks);

    for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        chunks.push(transcript.substring(start, end));
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
        highlights: consolidated.highlights,
        npcs: Array.from(consolidated.npcs.values()),
        player_characters: Array.from(consolidated.player_characters.values()),
        items: Array.from(consolidated.items.values()),
        locations: Array.from(consolidated.locations.values()),
    };
}


// #################################################################
// # 3. AI Prompts                                                 #
// #################################################################

const extractInsightsPrompt = ai.definePrompt({
    name: 'extractInsightsPrompt',
    input: { schema: z.object({ content: z.string() }) },
    output: { schema: RawChunkDataSchema },
    prompt: `
        You are an expert RPG session analyst. Your task is to extract key information from a small segment of a game transcript.
        Do not make up information. If a category is not present, return an empty array for it.

        Focus ONLY on the content within this segment:
        ---
        {{{content}}}
        ---

        Extract the following, if present:
        - Highlights: Key moments, decisions, or surprising events.
        - NPCs: Any non-player characters mentioned or interacted with.
        - Player Characters: Any player characters mentioned and their significant actions.
        - Items: Any relevant items that were found, used, or mentioned.
        - Locations: Any new places visited or described.
    `,
    model: googleAI.model('gemini-pro'),
    config: { temperature: 0.2 },
});

const synthesizeInsightsPrompt = ai.definePrompt({
    name: 'synthesizeInsightsPrompt',
    input: { schema: SynthesisInputSchema },
    output: { schema: SynthesisOutputSchema },
    prompt: `
        You are a master editor and storyteller for a tabletop RPG group. You have received pre-processed and deduplicated lists of highlights, NPCs, items, and locations from a game session.
        Your job is to synthesize this information into a single, coherent, and polished summary.

        - Title & Subtitle: Based on all the information, create a creative and engaging title and subtitle for the entire session.
        - Refine Highlights: From the provided list of all highlights, select the best and most impactful 10 highlights. Ensure they are well-written and capture the essence of the session.
        - Refine Lists: Review the provided lists of NPCs, characters, items, and locations. You can slightly rephrase descriptions for clarity and consistency, but do not add or remove items from the lists.
        - Image Prompt: Based on the MOST epic moment from the highlights, create a detailed, cinematic, and visually rich prompt IN ENGLISH for an AI image generator to create cover art.

        Here is the pre-processed data:
        ---
        Highlights:
        {{{json highlights}}}

        NPCs:
        {{{json npcs}}}

        Player Characters:
        {{{json player_characters}}}

        Items:
        {{{json items}}}
        
        Locations:
        {{{json locations}}}
        ---

        Produce a final, clean, and well-structured JSON output with the refined information.
    `,
    model: googleAI.model('gemini-pro'),
    config: { temperature: 0.7 },
});


// #################################################################
// # 4. Flows                                                      #
// #################################################################

/**
 * Flow to extract insights from a single chunk of text.
 */
const extractInsightsFlow = ai.defineFlow(
    {
        name: 'extractInsightsFlow',
        inputSchema: z.object({ content: z.string() }),
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
    // Step 1: Divide the transcript into 10 chunks
    const chunks = splitTranscriptIntoChunks(input.transcript, 10);

    // Step 2-11: Process all 10 chunks in parallel to extract raw insights
    const extractionPromises = chunks.map(chunk => extractInsightsFlow({ content: chunk }));
    const extractedData = await Promise.all(extractionPromises);
    
    // Step 12: Pre-process the raw data to deduplicate and consolidate.
    const preProcessedData = preProcessData(extractedData);

    // Step 13: Synthesize the pre-processed data into a coherent summary.
    const synthesizedData = await synthesizeInsightsFlow(preProcessedData);

    // Step 14: Generate the cover image based on the synthesized prompt.
    const imageUrl = await generateCoverImageFlow({ prompt: synthesizedData.image_prompt });

    // Final Step: Combine and return the results
    return {
        ...synthesizedData,
        coverImageUrl: imageUrl,
    };
}
