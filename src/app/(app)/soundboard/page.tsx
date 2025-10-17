import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export default function SoundboardPage() {
  return (
    <>
      <h1 className="text-3xl font-headline magical-glow mb-8 animate-in fade-in-down">Mesa de Som</h1>
      <Card className="w-full max-w-md text-center animate-in fade-in-up">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Volume2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Mesa de Som</CardTitle>
          <CardDescription>Este recurso está atualmente em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sons ambientes, efeitos sonoros emocionantes e partituras musicais para definir o clima de suas aventuras estão sendo compostos. Prepare-se para aprimorar a atmosfera do seu jogo!</p>
        </CardContent>
      </Card>
    </>
  );
}
