'use server';

import {
  generateNpc as generateNpcFlow,
  type GenerateNpcInput,
  type GenerateNpcOutput,
} from '@/ai/flows/generate-npc';

import {
  generateItemLoot as generateItemLootFlow,
  type GenerateItemLootInput,
  type GenerateItemLootOutput,
} from '@/ai/flows/generate-item-loot';

import {
  generateEnvironmentDescription as generateEnvironmentDescriptionFlow,
  type GenerateEnvironmentDescriptionInput,
  type GenerateEnvironmentDescriptionOutput,
} from '@/ai/flows/generate-environment-description';


export async function generateNpcAction(
  input: GenerateNpcInput
): Promise<GenerateNpcOutput> {
  return await generateNpcFlow(input);
}


export async function generateItemLootAction(
  input: GenerateItemLootInput
): Promise<GenerateItemLootOutput> {
  return await generateItemLootFlow(input);
}


export async function generateEnvironmentDescriptionAction(
  input: GenerateEnvironmentDescriptionInput
): Promise<GenerateEnvironmentDescriptionOutput> {
  return await generateEnvironmentDescriptionFlow(input);
}
