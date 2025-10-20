'use server';

/**
 * @fileOverview A loot and item generation AI agent.
 *
 * - generateItemLoot - A function that handles the loot generation process.
 * - GenerateItemLootInput - The input type for the generateItemLoot function.
 * - GenerateItemLootOutput - The return type for the generateItemLoot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItemLootInputSchema = z.object({
  itemType: z.string().describe('The type of item to generate (e.g., weapon, armor, potion, scroll).'),
  rarity: z.string().describe('The rarity of the item (e.g., common, uncommon, rare, very rare, legendary).'),
  setting: z.string().describe('The game setting for which the item is being generated (e.g., Forgotten Realms, Eberron).'),
  additionalDetails: z.string().optional().describe('Any additional details or specifications for the item (e.g., specific materials, desired enchantments).'),
});
export type GenerateItemLootInput = z.infer<typeof GenerateItemLootInputSchema>;

const GenerateItemLootOutputSchema = z.object({
  itemName: z.string().describe('The name of the generated item.'),
  itemDescription: z.string().describe('A detailed description of the item, including its properties and abilities.'),
  itemValue: z.string().describe('The approximate value of the item in gold pieces.'),
});
export type GenerateItemLootOutput = z.infer<typeof GenerateItemLootOutputSchema>;

export async function generateItemLoot(input: GenerateItemLootInput): Promise<GenerateItemLootOutput> {
  return generateItemLootFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItemLootPrompt',
  input: {schema: GenerateItemLootInputSchema},
  output: {schema: GenerateItemLootOutputSchema},
  model: 'googleai/gemini-1.5-flash-preview-0514',
  prompt: `You are an expert fantasy item generator for role-playing games. Given the item type, rarity, setting, and any additional details, you will generate a unique and interesting item for the players.

Item Type: {{{itemType}}}
Rarity: {{{rarity}}}
Setting: {{{setting}}}
Additional Details: {{{additionalDetails}}}

Generate a creative and detailed item, including its name, description, and approximate value in gold pieces. Make the item fit the described setting.

Output:
Item Name:
Item Description:
Item Value:`, // Ensure the output format matches the schema
});

const generateItemLootFlow = ai.defineFlow(
  {
    name: 'generateItemLootFlow',
    inputSchema: GenerateItemLootInputSchema,
    outputSchema: GenerateItemLootOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
