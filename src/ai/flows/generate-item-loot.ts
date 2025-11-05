'use server';
/**
 * @fileOverview A magical item and loot generation AI flow.
 *
 * - generateItemLoot - A function that handles the item generation process.
 * - GenerateItemLootInput - The input type for the generateItemLoot function.
 * - GenerateItemLootOutput - The return type for the generateItemLoot function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const GenerateItemLootInputSchema = z.object({
    itemType: z.string(),
    rarity: z.string(),
    setting: z.string(),
    additionalDetails: z.string().optional(),
});
export type GenerateItemLootInput = z.infer<typeof GenerateItemLootInputSchema>;

const GenerateItemLootOutputSchema = z.object({
    itemName: z.string().describe("The name of the generated item."),
    itemValue: z.string().describe("The value of the item in gold pieces."),
    itemDescription: z.string().describe("A detailed description of the item's appearance, history, and abilities.")
});
export type GenerateItemLootOutput = z.infer<typeof GenerateItemLootOutputSchema>;


export async function generateItemLoot(input: GenerateItemLootInput): Promise<GenerateItemLootOutput> {
    return generateItemLootFlow(input);
}


const generateItemLootFlow = ai.defineFlow(
    {
        name: 'generateItemLootFlow',
        inputSchema: GenerateItemLootInputSchema,
        outputSchema: GenerateItemLootOutputSchema,
    },
    async (input) => {
        const { output } = await ai.prompt({
            model: googleAI.model('gemini-1.5-flash'),
            prompt: `You are a master Dungeon Master creating a unique magical item for a tabletop RPG.

            Generate a magical item based on the following criteria:
            - Item Type: {{{itemType}}}
            - Rarity: {{{rarity}}}
            - Game Setting: {{{setting}}}
            {{#if additionalDetails}}- Additional Details: {{{additionalDetails}}}{{/if}}
        
            Provide a creative name, a plausible value in gold pieces, and a rich description including its appearance, history, and magical properties.
            The response should be in Brazilian Portuguese.
            `,
            output: {
                schema: GenerateItemLootOutputSchema,
            },
            input: input,
        });
        return output;
    }
);
