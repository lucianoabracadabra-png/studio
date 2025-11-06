import Image from 'next/image';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from \"@/components/ui/card\";
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PlusCircle, ChevronDown, Edit } from 'lucide-react';
import Link from 'next/link';
import campaignsData from '@/lib/data/campaigns.json';
import { cn } from '@/lib/utils';


// Assume this shape for campaign data, potentially extended with sessions
interface Campaign {
  id: string;
  name: string;
  description: string;
  imageId: string;
  sessions?: {
    id: string;
    name: string;
    date: string;
  }[];
}

// Mock data with sessions added
const campaigns: Campaign[] = campaignsData.campaigns.map(campaign => {
  // Add mock sessions to each campaign for demonstration
  return {
    ...campaign,
    sessions: [
      { id: `${campaign.id}-s1`, name: "A Chegada à Aldeia", date: "2023-10-26" },
      { id: `${campaign.id}-s2`, name: "As Criptas Esquecidas", date: "2023-11-02" },
    ]
  };
});

export default function DashboardPage() {
  return (
    <>
 <div className="flex items-center justify-between mb-6">
 <h1 className="text-3xl font-bold">Minhas Campanhas</h1>
        <Button asChild className="mt-4 sm:mt-0">
           <Link href="/tools/generator">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar com IA
 Gerar com IA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                  <Link href={`/vtt`}>Entrar na Campanha</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  );
}
