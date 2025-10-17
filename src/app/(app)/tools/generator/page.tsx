import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemGenerator } from "./_components/item-generator";
import { NpcGenerator } from "./_components/npc-generator";

export default function GeneratorPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-headline magical-glow animate-in fade-in-down">Geradores de IA</h1>
      <Tabs defaultValue="item" className="animate-in fade-in-up">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="item">Item & Tesouro</TabsTrigger>
          <TabsTrigger value="npc">NPC</TabsTrigger>
        </TabsList>
        <TabsContent value="item">
          <ItemGenerator />
        </TabsContent>
        <TabsContent value="npc">
          <NpcGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
