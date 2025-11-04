'use client';

import { useState } from 'react';
import { CharacterSheet } from './_components/character-sheet';
import charactersData from '@/lib/data/characters.json';
import type { Character } from '@/lib/character-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CharactersPage() {
  const [allCharacters] = useState<Character[]>(charactersData.characters as Character[]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(allCharacters[0].id);
  
  const getInitialCharacterState = (id: string) => {
    const char = allCharacters.find(c => c.id === id);
    if (!char) return allCharacters[0];
    return JSON.parse(JSON.stringify(char)); // Deep copy to prevent state mutation issues
  };
  
  const [character, setCharacter] = useState<Character>(() => getInitialCharacterState(selectedCharacterId));
  const { toast } = useToast();

  const handleCharacterChange = (id: string) => {
    setSelectedCharacterId(id);
    setCharacter(getInitialCharacterState(id));
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would save to a database.
    console.log("Saving changes for", character.name, character);
    toast({
      title: "Alterações Salvas!",
      description: `As alterações para ${character.name} foram salvas (no console).`,
    });
  }
  
  const handleClearChanges = () => {
    setCharacter(getInitialCharacterState(selectedCharacterId));
    toast({
      title: "Alterações Descartadas",
      description: "As alterações não salvas foram revertidas.",
    });
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fichas de Personagem</h1>
        <div className="flex items-center gap-4">
          <Select onValueChange={handleCharacterChange} defaultValue={selectedCharacterId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um personagem" />
            </SelectTrigger>
            <SelectContent>
              {allCharacters.map(char => (
                <SelectItem key={char.id} value={char.id}>
                  {char.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleClearChanges} variant="outline">
            <Trash className="mr-2 h-4 w-4" />
            Descartar
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>
      <CharacterSheet initialCharacterData={character} />
    </div>
  );
}
