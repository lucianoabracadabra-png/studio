import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Database className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Gestão de Base de Dados</CardTitle>
          <CardDescription>Este recurso está atualmente em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em breve, você poderá visualizar e configurar as tabelas e bases de dados da sua aplicação diretamente a partir desta página.</p>
        </CardContent>
      </Card>
    </>
  );
}
