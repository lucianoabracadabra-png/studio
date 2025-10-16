import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";

export default function CombatTrackerPage() {
  return (
    <div className="flex items-center justify-center flex-1">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Swords className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Combat Tracker</CardTitle>
          <CardDescription>This GM tool is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Get ready to manage initiative, track HP, and unleash monsters! This powerful tool for running smooth combat encounters is being forged.</p>
        </CardContent>
      </Card>
    </div>
  );
}
