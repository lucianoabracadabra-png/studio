import { CombatTracker } from "./_components/combat-tracker";

export default function CombatTrackerPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Rastreador de Combate</h1>
      <div>
        <CombatTracker />
      </div>
    </>
  );
}
