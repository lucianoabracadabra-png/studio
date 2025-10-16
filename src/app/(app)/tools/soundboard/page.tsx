import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export default function SoundboardPage() {
  return (
    <div className="flex items-center justify-center flex-1 flex-col">
      <h1 className="text-3xl font-headline magical-glow mb-8 animate-in fade-in-down">Soundboard</h1>
      <Card className="w-full max-w-md text-center animate-in fade-in-up">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Volume2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Soundboard</CardTitle>
          <CardDescription>This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ambient sounds, thrilling sound effects, and musical scores to set the mood for your adventures are being composed. Get ready to enhance your game's atmosphere!</p>
        </CardContent>
      </Card>
    </div>
  );
}
