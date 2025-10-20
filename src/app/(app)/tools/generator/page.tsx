import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function GeneratorPage() {
  return (
    <>
      <h1 className="text-3xl font-headline magical-glow mb-8 animate-in fade-in-down">Geradores de IA</h1>
      <Card className="w-full max-w-md text-center animate-in fade-in-up">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FlaskConical className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Geradores de IA</CardTitle>
          <CardDescription>Este recurso está atualmente em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ferramentas para gerar NPCs, itens, e mais conteúdo para as suas aventuras estão a ser forjadas. Volte em breve para acelerar a sua criação de mundos!</p>
        </CardContent>
      </Card>
    </>
  );
}
