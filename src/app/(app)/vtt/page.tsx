import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function VttPage() {
  return (
    <div className="flex items-center justify-center flex-1 flex-col">
      <h1 className="text-3xl font-headline magical-glow mb-8 animate-in fade-in-down">Mesa de Jogo Virtual</h1>
      <Card className="w-full max-w-md text-center animate-in fade-in-up">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Map className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Mesa de Jogo Virtual (VTT)</CardTitle>
          <CardDescription>Este recurso está atualmente em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Prepare-se para uma experiência imersiva! Nossa VTT com grades personalizáveis, movimento de tokens e névoa de guerra está a caminho.</p>
        </CardContent>
      </Card>
    </div>
  );
}
