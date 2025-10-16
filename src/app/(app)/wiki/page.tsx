import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function WikiPage() {
  return (
    <div className="flex items-center justify-center flex-1">
      <Card className="w-full max-w-md text-center">
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
