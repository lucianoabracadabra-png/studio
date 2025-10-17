import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const campaigns = [
  {
    name: 'As Sombras Sussurrantes',
    description: 'Um mal antigo desperta nas criptas esquecidas.',
    image: PlaceHolderImages.find(p => p.id === 'campaign-1')!,
  },
  {
    name: 'A Coroa Carmesim do Rei da Montanha',
    description: 'Uma busca por um artefato perdido de poder imenso.',
    image: PlaceHolderImages.find(p => p.id === 'campaign-2')!,
  },
  {
    name: 'Cidade das Mil Estrelas',
    description: 'Intriga e perigo em uma metrópole vibrante.',
    image: PlaceHolderImages.find(p => p.id === 'campaign-4')!,
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between animate-in fade-in-down">
        <h1 className="text-3xl font-headline magical-glow">Painel de Controle</h1>
        <Button className="group">
          <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Criar Campanha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-up">
        {campaigns.map((campaign, i) => (
          <Card key={campaign.name} className="glassmorphic-card overflow-hidden flex flex-col group" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={campaign.image.imageUrl}
                        alt={campaign.image.description}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={campaign.image.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="font-headline text-xl mb-2">{campaign.name}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4">
              <Button asChild className="w-full font-bold">
                <Link href="#">Entrar na Campanha</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
