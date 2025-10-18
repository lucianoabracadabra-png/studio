import { DiceRoller } from './_components/dice-roller';

export default function DiceRollerPage() {
  return (
    <>
        <h1 className="text-3xl font-headline magical-glow animate-in fade-in-down mb-6">Rolador de Dados</h1>
        <div className="animate-in fade-in-up">
            <DiceRoller />
        </div>
    </>
  );
}
