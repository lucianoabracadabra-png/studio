'use server';
/**
 * @fileOverview An environment description generation AI flow.
 *
 * - generateEnvironmentDescription - A function that handles the environment description process.
 * - GenerateEnvironmentDescriptionInput - The input type for the generateEnvironmentDescription function.
 * - GenerateEnvironmentDescriptionOutput - The return type for the generateEnvironmentDescription function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const GenerateEnvironmentDescriptionInputSchema = z.object({
  environmentType: z.string(),
  style: z.string().optional(),
  additionalDetails: z.string().optional(),
});
export type GenerateEnvironmentDescriptionInput = z.infer<typeof GenerateEnvironmentDescriptionInputSchema>;

const GenerateEnvironmentDescriptionOutputSchema = z.object({
  description: z.string().describe("A rich, multi-sensory description of the environment, engaging sight, sound, and smell."),
});
export type GenerateEnvironmentDescriptionOutput = z.infer<typeof GenerateEnvironmentDescriptionOutputSchema>;

export async function generateEnvironmentDescription(input: GenerateEnvironmentDescriptionInput): Promise<GenerateEnvironmentDescriptionOutput> {
  return generateEnvironmentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEnvironmentDescriptionPrompt',
  input: { schema: GenerateEnvironmentDescriptionInputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are a master storyteller, painting vivid pictures with words for a tabletop RPG.

  Generate a rich, atmospheric description for the following environment:
  - Type: {{{environmentType}}}
  {{#if style}}- Style: {{{style}}}{{/if}}
  {{#if additionalDetails}}- Additional Details: {{{additionalDetails}}}{{/if}}

  Engage multiple senses (sight, sound, smell, touch) to create an immersive experience for the players. Focus on creating a strong mood and atmosphere.
  The response should be in Brazilian Portuguese.
  
  You MUST return ONLY a valid JSON object matching this Zod schema:
  '''json
  {
    "description": "A rich, multi-sensory description of the environment, engaging sight, sound, and smell."
  }
  '''
  `,
});

const generateEnvironmentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEnvironmentDescriptionFlow',
    inputSchema: GenerateEnvironmentDescriptionInputSchema,
    outputSchema: GenerateEnvironmentDescriptionOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return JSON.parse(response.text);
  }
);
