import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export default function SoundboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Mesa de Som</h1>
      <Card className="w-full max-w-md text-center border-2 border-[var(--page-accent-color)] shadow-[0_0_15px_rgba(0,0,0,0.3),0_0_10px_hsl(var(--page-accent-color)/0.4)]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Volume2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Mesa de Som</CardTitle>
          <CardDescription>Este recurso está atualmente em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sons ambientes, efeitos sonoros emocionantes e partituras musicais para definir o clima de suas aventuras estão sendo compostos. Prepare-se para aprimorar a atmosfera do seu jogo!</p>
        </CardContent>
      </Card>
    </>
  );
}
