'use server';
/**
 * @fileOverview Processes a game session transcript to generate a structured summary, including a title, subtitle, cover image, and detailed lists of highlights, NPCs, items, and locations.
 *
 * - processSession - A function that handles the session processing.
 * - ProcessSessionInput - The input type for the processSession function.
 * - ProcessSessionOutput - The return type for the processSession function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

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

const ProcessSessionInputSchema = z.object({
  transcript: z.string().describe("A transcrição completa da sessão de jogo em formato de texto."),
});
export type ProcessSessionInput = z.infer<typeof ProcessSessionInputSchema>;

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
export type ProcessSessionOutput = z.infer<typeof ProcessSessionOutputSchema>;

// This is the main function that will be called from the server action.
export async function processSession(input: ProcessSessionInput): Promise<ProcessSessionOutput & { coverImageUrl: string }> {
  // First, generate the structured text data from the transcript.
  const structuredData = await processSessionTextFlow(input);

  // Then, generate the cover image based on the image prompt from the text data.
  const imageUrl = await generateCoverImageFlow({ prompt: structuredData.image_prompt });

  // Return the combined result.
  return {
    ...structuredData,
    coverImageUrl: imageUrl,
  };
}

const processSessionTextFlow = ai.defineFlow(
  {
    name: 'processSessionTextFlow',
    inputSchema: ProcessSessionInputSchema,
    outputSchema: ProcessSessionOutputSchema,
  },
  async (input) => {
    const prompt = `
      Você é um mestre de jogo experiente e um editor de conteúdo para um site de RPG de mesa. Sua tarefa é analisar a transcrição de uma sessão de jogo e extrair informações estruturadas de forma concisa e atraente para um resumo pós-sessão.

      Analise a seguinte transcrição:
      ---
      {{{transcript}}}
      ---

      Com base no texto, gere o seguinte conteúdo:
      1.  **Título e Subtítulo:** Crie um título e um subtítulo no estilo de um episódio de série, que capture a essência da sessão.
      2.  **Destaques (Highlights):** Identifique até 10 momentos-chave. Para cada um, forneça um título, uma breve descrição da cena e um pequeno trecho da transcrição que ilustre esse momento.
      3.  **NPCs:** Liste todos os NPCs que apareceram, com uma breve descrição de sua aparência e da interação que tiveram.
      4.  **Personagens dos Jogadores:** Liste os personagens dos jogadores que participaram e descreva uma ação ou momento marcante de cada um.
      5.  **Itens:** Liste os itens que foram importantes ou introduzidos na sessão, com um trecho da transcrição onde eles foram relevantes.
      6.  **Lugares:** Liste os lugares importantes por onde os personagens passaram ou que foram mencionados, com uma breve descrição.
      7.  **Prompt de Imagem:** Crie um prompt em INGLÊS, detalhado e cinematográfico, para um modelo de IA de geração de imagem. Este prompt deve descrever uma cena épica e visualmente rica que sirva como a imagem de capa para esta sessão.
      
      Formate a saída estritamente como o JSON solicitado.
    `;
    
    const { output } = await ai.generate({
      prompt: prompt,
      model: googleAI.model('gemini-1.5-pro'),
      output: {
        schema: ProcessSessionOutputSchema,
      },
      config: {
        temperature: 0.5,
      }
    });

    return output!;
  }
);

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
