import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function WikiPage() {
  return (
    <div className="flex items-center justify-center flex-1 flex-col">
       <h1 className="text-3xl font-headline magical-glow mb-8 animate-in fade-in-down">Campaign Wiki</h1>
      <Card className="w-full max-w-md text-center animate-in fade-in-up">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Campaign Wiki</CardTitle>
          <CardDescription>This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A place for your world's history, lore, important NPCs, and locations is being crafted. Your campaign's encyclopedia is coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
