import { InteractiveMap } from "./_components/interactive-map";

export default function AtlasPage() {
  return (
    <div className="w-full max-w-full mx-auto flex flex-col gap-6 py-6 h-[calc(100vh-4rem)]">
       <header className="animate-in fade-in-down px-6">
          <h1 className="text-4xl font-headline magical-glow">Atlas do Mundo</h1>
          <p className="text-lg text-muted-foreground mt-1">Navegue pelo mapa e descubra os segredos do nosso universo.</p>
      </header>
      <div className="flex-grow animate-in fade-in-up">
        <InteractiveMap />
      </div>
    </div>
  );
}
