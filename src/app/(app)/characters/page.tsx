import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CharactersPage() {
  return (
    <div className="flex items-center justify-center flex-1">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Character Sheets</CardTitle>
          <CardDescription>This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Soon, you'll be able to manage your heroes, track their stats, and equip them for adventure right here. Stay tuned!</p>
        </CardContent>
      </Card>
    </div>
  );
}
