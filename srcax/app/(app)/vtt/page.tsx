import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function VttPage() {
  return (
    <div className="flex items-center justify-center flex-1">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Map className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Virtual Tabletop (VTT)</CardTitle>
          <CardDescription>This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Prepare for an immersive experience! Our VTT with customizable grids, token movement, and fog of war is on its way.</p>
        </CardContent>
      </Card>
    </div>
  );
}
