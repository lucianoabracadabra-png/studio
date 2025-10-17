import { CombatTracker } from "./_components/combat-tracker";

export default function CombatTrackerPage() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-headline magical-glow animate-in fade-in-down">Rastreador de Combate</h1>
      <div className="animate-in fade-in-up">
        <CombatTracker />
      </div>
    </div>
  );
}
