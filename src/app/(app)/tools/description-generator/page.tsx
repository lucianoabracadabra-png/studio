import { EnvironmentGenerator } from "./_components/environment-generator";

export default function DescriptionGeneratorPage() {
  return (
    <>
       <h1 className="text-3xl font-bold mb-4">Descritor de Cenas</h1>
       <div>
        <EnvironmentGenerator />
       </div>
    </>
  );
}
