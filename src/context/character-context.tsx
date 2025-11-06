
'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { Character } from '@/lib/character-data';
import charactersData from '@/lib/data/characters.json';

interface CharacterContextType {
  allCharacters: Character[];
  activeCharacter: Character;
  setActiveCharacter: (character: Character) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const allCharacters = useMemo(() => charactersData.characters as Character[], []);
  const [activeCharacter, setActiveCharacter] = useState<Character>(allCharacters[0]);

  const value = {
    allCharacters,
    activeCharacter,
    setActiveCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
