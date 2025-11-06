
'use client';

import { useState, useEffect } from 'react';
import { CharacterSheet } from './_components/character-sheet';
import charactersData from '@/lib/data/characters.json';
import type { Character } from '@/lib/character-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCharacter } from '@/context/character-context';

export default function CharactersPage() {
  const { activeCharacter, setActiveCharacter, allCharacters } = useCharacter();
  
  // This local state is now only for tracking unsaved changes.
  const [characterForSheet, setCharacterForSheet] = useState<Character>(activeCharacter);
  const { toast } = useToast();

  useEffect(() => {
    // When the global active character changes, update the sheet.
    setCharacterForSheet(JSON.parse(JSON.stringify(activeCharacter)));
  }, [activeCharacter]);


  const handleCharacterChange = (id: string) => {
    const newChar = allCharacters.find(c => c.id === id);
    if (newChar) {
      setActiveCharacter(newChar);
    }
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would save to a database.
    console.log("Saving changes for", characterForSheet.name, characterForSheet);
    // Persist the changes to the global state as well
    setActiveCharacter(characterForSheet);
    toast({
      title: "Alterações Salvas!",
      description: `As alterações para ${characterForSheet.name} foram salvas (no console).`,
    });
  }
  
  const handleRevertChanges = () => {
    setCharacterForSheet(JSON.parse(JSON.stringify(activeCharacter))); // Revert to original global state
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
          <Select onValueChange={handleCharacterChange} defaultValue={activeCharacter.id}>
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
          <Button onClick={handleRevertChanges} variant="outline">
            <Trash className="mr-2 h-4 w-4" />
            Descartar
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>
      <CharacterSheet initialCharacterData={characterForSheet} />
    </div>
  );
}
