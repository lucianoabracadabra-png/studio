'use server';
/**
 * @fileOverview A Non-Player Character (NPC) generation AI flow.
 *
 * - generateNpc - A function that handles the NPC generation process.
 * - GenerateNpcInput - The input type for the generateNpc function.
 * - GenerateNpcOutput - The return type for the generateNpc function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const GenerateNpcInputSchema = z.object({
  race: z.string(),
  occupation: z.string(),
  setting: z.string(),
  additionalDetails: z.string().optional(),
});
export type GenerateNpcInput = z.infer<typeof GenerateNpcInputSchema>;

const GenerateNpcOutputSchema = z.object({
  name: z.string().describe("The generated NPC's full name."),
  description: z.string().describe("A detailed physical and personality description for the NPC."),
  backstory: z.string().describe("A compelling backstory for the NPC, including motivations and potential plot hooks."),
});
export type GenerateNpcOutput = z.infer<typeof GenerateNpcOutputSchema>;


export async function generateNpc(input: GenerateNpcInput): Promise<GenerateNpcOutput> {
  return generateNpcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNpcPrompt',
  input: { schema: GenerateNpcInputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are a creative storyteller and world-builder for a tabletop RPG.

  Generate a unique Non-Player Character (NPC) based on the following criteria:
  - Race: {{{race}}}
  - Occupation: {{{occupation}}}
  - Setting: {{{setting}}}
  {{#if additionalDetails}}- Additional Details: {{{additionalDetails}}}{{/if}}

  Provide a memorable name, a rich description of their appearance and personality, and a compelling backstory with motivations and potential plot hooks.
  The response should be in Brazilian Portuguese.
  
  You MUST return ONLY a valid JSON object matching this Zod schema:
  '''json
  {
    "name": "The generated NPC's full name.",
    "description": "A detailed physical and personality description for the NPC.",
    "backstory": "A compelling backstory for the NPC, including motivations and secrets."
  }
  '''
  `,
});

const generateNpcFlow = ai.defineFlow(
  {
    name: 'generateNpcFlow',
    inputSchema: GenerateNpcInputSchema,
    outputSchema: GenerateNpcOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return JSON.parse(response.text);
  }
);
