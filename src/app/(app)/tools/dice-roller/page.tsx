import { DiceRoller } from './_components/dice-roller';

export default function DiceRollerPage() {
  return (
    <>
        <h1 className="text-3xl font-bold mb-6">Rolador de Dados</h1>
        <div>
            <DiceRoller />
        </div>
    </>
  );
}
