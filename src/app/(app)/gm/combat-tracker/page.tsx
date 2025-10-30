import { CombatTracker } from "./_components/combat-tracker";

export default function CombatTrackerPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Rastreador de Combate</h1>
      <div className="border-2 border-[var(--page-accent-color)] shadow-[0_0_15px_rgba(0,0,0,0.3),0_0_10px_hsl(var(--page-accent-color)/0.4)] rounded-lg">
        <CombatTracker />
      </div>
    </>
  );
}
