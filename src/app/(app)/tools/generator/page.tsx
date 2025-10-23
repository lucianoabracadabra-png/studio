import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemGenerator } from "./_components/item-generator";
import { NpcGenerator } from "./_components/npc-generator";
import { EnvironmentGenerator } from "./_components/environment-generator";

export default function GeneratorPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Geradores de IA</h1>
      <Tabs defaultValue="npc" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="npc">Gerador de NPC</TabsTrigger>
          <TabsTrigger value="item">Gerador de Item</TabsTrigger>
          <TabsTrigger value="scene">Gerador de Cena</TabsTrigger>
        </TabsList>
        <TabsContent value="npc" className="pt-6">
          <NpcGenerator />
        </TabsContent>
        <TabsContent value="item" className="pt-6">
          <ItemGenerator />
        </TabsContent>
        <TabsContent value="scene" className="pt-6">
            <EnvironmentGenerator />
        </TabsContent>
      </Tabs>
    </>
  );
}
