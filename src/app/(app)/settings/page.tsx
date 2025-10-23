import { promises as fs } from 'fs';
import path from 'path';
import { JsonViewer } from './_components/json-viewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper function to read and parse a JSON file
async function getJsonData(fileName: string) {
    const filePath = path.join(process.cwd(), 'src/lib/data', fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading or parsing ${fileName}:`, error);
        return { error: `Could not load ${fileName}`};
    }
}

export default async function SettingsPage() {
    const dataFiles = [
        'armors.json',
        'campaigns.json',
        'character-data.json',
        'items.json',
        'navigation.json',
        'weapons.json',
        'wiki-data.json',
    ];

    const allData = await Promise.all(
        dataFiles.map(async (file) => ({
            name: file.replace('.json', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            id: file.replace('.json', ''),
            data: await getJsonData(file),
        }))
    );

    const defaultTab = allData.length > 0 ? allData[0].id : "";

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Gestão de Base de Dados</h1>
      <p className="text-muted-foreground mb-8">
        Inspecione o conteúdo dos ficheiros JSON que servem como base de dados para a sua aplicação.
      </p>

       <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                {allData.map(file => (
                    <TabsTrigger key={file.id} value={file.id}>{file.name}</TabsTrigger>
                ))}
            </TabsList>
            {allData.map(file => (
                <TabsContent key={file.id} value={file.id} className="pt-6">
                    <JsonViewer data={file.data} title={`Base de Dados: ${file.name}`} />
                </TabsContent>
            ))}
        </Tabs>
    </>
  );
}
