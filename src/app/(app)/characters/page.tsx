

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import CharacterSheet with SSR turned off
const CharacterSheet = dynamic(
  () => import('./_components/character-sheet').then(mod => mod.CharacterSheet),
  { 
    ssr: false, // This is the key change
    loading: () => (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }
);


export default function CharactersPage() {
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <CharacterSheet />
    </div>
  );
}
