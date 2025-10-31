'use client';

import { CharacterSheet } from './_components/character-sheet';
import characterData from '@/lib/character-data.json';
import type { Character } from '@/lib/character-data';

export default function CharactersPage() {
  const typedCharacterData = characterData as Character;
  
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <CharacterSheet initialCharacterData={typedCharacterData} />
    </div>
  );
}
