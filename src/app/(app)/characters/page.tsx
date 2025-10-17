import { CharacterSheet } from "./_components/character-sheet";

export default function CharactersPage() {
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <CharacterSheet />
    </div>
  );
}
