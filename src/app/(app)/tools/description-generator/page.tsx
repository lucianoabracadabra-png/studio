import { EnvironmentGenerator } from "./_components/environment-generator";

export default function DescriptionGeneratorPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
       <h1 className="text-3xl font-headline magical-glow text-center animate-in fade-in-down">Scene Describer</h1>
       <div className="animate-in fade-in-up">
        <EnvironmentGenerator />
       </div>
    </div>
  );
}
