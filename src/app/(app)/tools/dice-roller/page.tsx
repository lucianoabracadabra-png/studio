import { DiceRoller } from './_components/dice-roller';

export default function DiceRollerPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-headline magical-glow text-center animate-in fade-in-down">Dice Roller</h1>
        <div className="animate-in fade-in-up">
            <DiceRoller />
        </div>
    </div>
  );
}
