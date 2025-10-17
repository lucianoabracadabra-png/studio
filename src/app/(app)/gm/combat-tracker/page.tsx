import { CombatTracker } from "./_components/combat-tracker";

export default function CombatTrackerPage() {
  return (
    <>
      <h1 className="text-3xl font-headline magical-glow animate-in fade-in-down">Rastreador de Combate</h1>
      <div className="animate-in fade-in-up">
        <CombatTracker />
      </div>
    </>
  );
}
