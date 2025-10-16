import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemGenerator } from "./_components/item-generator";
import { NpcGenerator } from "./_components/npc-generator";

export default function GeneratorPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="item">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="item">Item & Loot</TabsTrigger>
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
