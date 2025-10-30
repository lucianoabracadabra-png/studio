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
import campaignsData from '@/lib/data/campaigns.json';

const { campaigns } = campaignsData;

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Campanha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const image = PlaceHolderImages.find(p => p.id === campaign.imageId);
          return (
            <Card key={campaign.name} className="overflow-hidden flex flex-col group">
              <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                      {image && <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={image.imageHint}
                      />}
                  </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-xl mb-2">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild className="w-full font-bold">
                  <Link href="#">Entrar na Campanha</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  );
}
