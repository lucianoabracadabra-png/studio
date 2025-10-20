'use server';
/**
 * @fileOverview An NPC generation AI agent.
 *
 * - generateNpc - A function that handles the NPC generation process.
 * - GenerateNpcInput - The input type for the generateNpc function.
 * - GenerateNpcOutput - The return type for the generateNpc function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNpcInputSchema = z.object({
  setting: z.string().describe('The game setting for the NPC.'),
  race: z.string().describe('The race of the NPC.'),
  occupation: z.string().describe('The occupation of the NPC.'),
  additionalDetails: z.string().optional().describe('Any additional details to include in the NPC generation.'),
});
export type GenerateNpcInput = z.infer<typeof GenerateNpcInputSchema>;

const GenerateNpcOutputSchema = z.object({
  name: z.string().describe('The name of the NPC.'),
  description: z.string().describe('A detailed description of the NPC, including their personality, motivations, and appearance.'),
  backstory: z.string().describe('A backstory for the NPC.'),
});
export type GenerateNpcOutput = z.infer<typeof GenerateNpcOutputSchema>;

export async function generateNpc(input: GenerateNpcInput): Promise<GenerateNpcOutput> {
  return generateNpcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNpcPrompt',
  input: {schema: GenerateNpcInputSchema},
  output: {schema: GenerateNpcOutputSchema},
  model: 'googleai/gemini-pro',
  prompt: `You are a creative game master assistant, skilled at creating compelling and unique non-player characters (NPCs) for role-playing games.

  Generate a character name, detailed description, and backstory, and set the name, description, and backstory output fields appropriately.

  Setting: {{{setting}}}
  Race: {{{race}}}
  Occupation: {{{occupation}}}
  Additional Details: {{{additionalDetails}}}
  `,
});

const generateNpcFlow = ai.defineFlow(
  {
    name: 'generateNpcFlow',
    inputSchema: GenerateNpcInputSchema,
    outputSchema: GenerateNpcOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
