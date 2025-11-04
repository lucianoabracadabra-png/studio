
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

// Schemas for individual insights extracted from chunks
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
export type ProcessSessionInput = z.infer<typeof ProcessSessionInputSchema>;
const ProcessSessionInputSchema = z.object({
  transcript: z.string().describe("A transcrição completa da sessão de jogo em formato de texto."),
});

// Final output of the orchestrator
export type ProcessSessionOutput = z.infer<typeof ProcessSessionOutputSchema>;
const ProcessSessionOutputSchema = z.object({
  title: z.string().describe("Um título criativo e curto para a sessão, como o de um episódio."),
  subtitle: z.string().describe("Um subtítulo que complementa o título, dando mais contexto."),
  highlights: z.array(HighlightSchema).max(10).describe("Uma lista de até 10 dos momentos mais importantes da sessão."),
  npcs: z.array(NpcSchema).describe("Uma lista de NPCs que apareceram na sessão."),
  player_characters: z.array(PlayerCharacterSchema).describe("Uma lista dos personagens dos jogadores que apareceram e suas ações marcantes."),
  items: z.array(ItemSchema).describe("Uma lista de itens importantes que surgiram na sessão."),
  locations: z.array(LocationSchema).describe("Uma lista de lugares importantes visitados ou mencionados."),
  image_prompt: z.string().describe("Um prompt detalhado em inglês para um modelo de geração de imagem, descrevendo uma cena épica e representativa da sessão para ser usada como arte de capa. O prompt deve ser cinematográfico e visualmente rico."),
});


// Schema for the raw, unprocessed data from each chunk
const RawChunkDataSchema = z.object({
  highlights: z.array(HighlightSchema).optional(),
  npcs: z.array(NpcSchema).optional(),
  player_characters: z.array(PlayerCharacterSchema).optional(),
  items: z.array(ItemSchema).optional(),
  locations: z.array(LocationSchema).optional(),
});
type RawChunkData = z.infer<typeof RawChunkDataSchema>;

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


// #################################################################
// # 1. ORCHESTRATOR FLOW                                          #
// #################################################################

export async function processSession(input: ProcessSessionInput): Promise<ProcessSessionOutput & { coverImageUrl: string }> {
    // Step 1: Divide the transcript into 10 chunks
    const chunks = splitTranscriptIntoChunks(input.transcript, 10);

    // Step 2-11: Process all 10 chunks in parallel to extract raw insights
    const extractionPromises = chunks.map(chunk => extractInsightsFlow({ content: chunk }));
    const extractedData = await Promise.all(extractionPromises);
    
    // Step 12: Synthesize the raw data from all chunks into a coherent summary
    const synthesizedData = await synthesizeInsightsFlow({ allChunksData: extractedData });

    // Step 13: Generate the cover image based on the synthesized prompt
    const imageUrl = await generateCoverImageFlow({ prompt: synthesizedData.image_prompt });

    // Final Step: Combine and return the results
    return {
        ...synthesizedData,
        coverImageUrl: imageUrl,
    };
}


// #################################################################
// # 2. SPECIALIZED FLOWS (Called by the Orchestrator)             #
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
    async ({ content }) => {
        const prompt = `
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
            
            Format the output strictly as the requested JSON.
        `;

        const { output } = await ai.generate({
            prompt,
            model: googleAI.model('gemini-1.5-flash-latest'),
            output: { schema: RawChunkDataSchema },
            config: { temperature: 0.2 }
        });
        return output!;
    }
);

/**
 * Flow to synthesize and refine data from all chunks.
 */
const synthesizeInsightsFlow = ai.defineFlow(
    {
        name: 'synthesizeInsightsFlow',
        inputSchema: z.object({ allChunksData: z.array(RawChunkDataSchema) }),
        outputSchema: ProcessSessionOutputSchema,
    },
    async ({ allChunksData }) => {
        const prompt = `
            You are a master editor and storyteller for a tabletop RPG group. You have received raw, sometimes duplicated, data extracted from 10 sequential chunks of a game session.
            Your job is to synthesize this information into a single, coherent, and polished summary.

            - Title & Subtitle: Create a creative and engaging title and subtitle for the entire session.
            - Deduplicate & Refine: Consolidate the lists of highlights, NPCs, items, and locations. Remove duplicates and merge similar entries. Select the best 10 highlights.
            - Summarize Characters: Provide a brief, impactful summary for each player character based on all their mentioned actions.
            - Image Prompt: Based on the MOST epic moment from the highlights, create a detailed, cinematic, and visually rich prompt IN ENGLISH for an AI image generator to create cover art.

            Here is the raw data from all chunks:
            ---
            {{{json allChunksData}}}
            ---

            Produce a final, clean, and well-structured JSON output.
        `;
        
        const { output } = await ai.generate({
            prompt,
            model: googleAI.model('gemini-1.5-flash-latest'),
            output: { schema: ProcessSessionOutputSchema },
            config: { temperature: 0.7 }
        });
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
        outputSchema: z.string(),
    },
    async ({ prompt }) => {
        const { media } = await ai.generate({
            model: googleAI.model('imagen-4.0-fast-generate-001'),
            prompt: `fantasy art, epic, cinematic, high detail, ${prompt}`,
            config: {
                aspectRatio: '16:9',
            }
        });
        return media.url!;
    }
);



