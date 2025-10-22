'use server';

import {
  generateEnvironmentDescription,
  type GenerateEnvironmentDescriptionInput,
  type GenerateEnvironmentDescriptionOutput,
} from '@/ai/flows/generate-environment-description';
import {
    generateItemLoot,
    type GenerateItemLootInput,
    type GenerateItemLootOutput,
} from '@/ai/flows/generate-item-loot';
import {
    generateNpc,
    type GenerateNpcInput,
    type GenerateNpcOutput,
} from '@/ai/flows/generate-npc';


export async function generateItemLootAction(
  input: GenerateItemLootInput
): Promise<GenerateItemLootOutput> {
  return await generateItemLoot(input);
}

export async function generateNpcAction(
  input: GenerateNpcInput
): Promise<GenerateNpcOutput> {
    return await generateNpc(input);
}

export async function generateEnvironmentDescriptionAction(
    input: GenerateEnvironmentDescriptionInput
): Promise<GenerateEnvironmentDescriptionOutput> {
    return await generateEnvironmentDescription(input);
}
