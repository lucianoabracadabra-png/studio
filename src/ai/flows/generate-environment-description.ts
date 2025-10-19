'use server';

/**
 * @fileOverview Generates descriptions of environments using AI.
 *
 * - generateEnvironmentDescription - A function that handles the environment description generation process.
 * - GenerateEnvironmentDescriptionInput - The input type for the generateEnvironmentDescription function.
 * - GenerateEnvironmentDescriptionOutput - The return type for the generateEnvironmentDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEnvironmentDescriptionInputSchema = z.object({
  environmentType: z.string().describe('The type of environment (e.g., forest, dungeon, city).'),
  style: z.string().optional().describe('The environment style (e.g., mystical, ruined, cyberpunk).'),
  additionalDetails: z.string().optional().describe('Any additional details to include in the description.'),
});
export type GenerateEnvironmentDescriptionInput = z.infer<typeof GenerateEnvironmentDescriptionInputSchema>;

const GenerateEnvironmentDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description of the environment.'),
});
export type GenerateEnvironmentDescriptionOutput = z.infer<typeof GenerateEnvironmentDescriptionOutputSchema>;

export async function generateEnvironmentDescription(input: GenerateEnvironmentDescriptionInput): Promise<GenerateEnvironmentDescriptionOutput> {
  return generateEnvironmentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEnvironmentDescriptionPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GenerateEnvironmentDescriptionInputSchema},
  output: {schema: GenerateEnvironmentDescriptionOutputSchema},
  prompt: `You are a fantasy world builder, skilled at writing rich and detailed descriptions of environments for tabletop role-playing games.

  Generate a description of the following environment, based on the user input.
  Environment Type: {{{environmentType}}}
  Style: {{{style}}}
  Additional Details: {{{additionalDetails}}}

  Description:`,
});

const generateEnvironmentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEnvironmentDescriptionFlow',
    inputSchema: GenerateEnvironmentDescriptionInputSchema,
    outputSchema: GenerateEnvironmentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
