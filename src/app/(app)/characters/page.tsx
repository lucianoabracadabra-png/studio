'use client';

import { CharacterSheet } from './_components/character-sheet';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharactersPage() {
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <CharacterSheet />
    </div>
  );
}
