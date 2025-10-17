import { EnvironmentGenerator } from "./_components/environment-generator";

export default function DescriptionGeneratorPage() {
  return (
    <>
       <h1 className="text-3xl font-headline magical-glow animate-in fade-in-down">Descritor de Cenas</h1>
       <div className="animate-in fade-in-up">
        <EnvironmentGenerator />
       </div>
    </>
  );
}
