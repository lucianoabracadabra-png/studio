'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Users, MapPin, Sparkles, Key, ChevronDown, UserCircle } from 'lucide-react';

// Tipos baseados no schema Zod do fluxo `process-session`
type Highlight = {
  title: string;
  scene_description: string;
  transcript_excerpt: string;
};

type Npc = {
  name: string;
  description: string;
};

type Item = {
  name: string;
  transcript_excerpt: string;
};

type Location = {
  name: string;
  description: string;
};

type PlayerCharacter = {
  name: string;
  appearance_description: string;
};

type SessionData = {
  id: string;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  highlights: Highlight[];
  npcs: Npc[];
  player_characters: PlayerCharacter[];
  items: Item[];
  locations: Location[];
};

export default function CampaignDetailPage() {
  const params = useParams();
  const { campaignId } = params;
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This check ensures localStorage is accessed only on the client side.
    if (typeof window !== 'undefined' && campaignId) {
      const storedSessions: SessionData[] = JSON.parse(localStorage.getItem('generatedSessions') || '[]');
      const foundSession = storedSessions.find(s => s.id === campaignId);
      
      if (foundSession) {
        setSession(foundSession);
      }
      setLoading(false);
    }
  }, [campaignId]);

  if (loading) {
    return (
        <div className='space-y-6'>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="aspect-[16/9] w-full">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  if (!session) {
    // This will be shown if the session is not found in localStorage
    // or if the component is rendered on the server without the data.
    return notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{session.title}</h1>
        <p className="text-xl text-muted-foreground">{session.subtitle}</p>
      </header>

      <Card className="overflow-hidden">
        <div className="relative w-full aspect-[16/9]">
            <Image
                src={session.coverImageUrl}
                alt={`Capa para ${session.title}`}
                fill
                className="object-cover"
                priority
            />
        </div>
      </Card>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoSection icon={Sparkles} title="Destaques da Sessão" data={session.highlights} renderItem={(item: Highlight) => (
                <>
                    <p className="font-bold text-primary">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.scene_description}</p>
                    <blockquote className="mt-2 pl-4 border-l-2 border-accent text-sm italic">
                        "{item.transcript_excerpt}"
                    </blockquote>
                </>
            )} />

            <InfoSection icon={Users} title="NPCs Encontrados" data={session.npcs} renderItem={(item: Npc) => (
                <>
                    <p className="font-bold text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </>
            )} />

            <InfoSection icon={UserCircle} title="Personagens em Foco" data={session.player_characters} renderItem={(item: PlayerCharacter) => (
                 <>
                    <p className="font-bold text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.appearance_description}</p>
                </>
            )} noImage />
            
            <InfoSection icon={Key} title="Itens Relevantes" data={session.items} renderItem={(item: Item) => (
                <>
                    <p className="font-bold text-primary">{item.name}</p>
                    <blockquote className="mt-1 pl-4 border-l-2 border-accent text-sm italic">
                        "{item.transcript_excerpt}"
                    </blockquote>
                </>
            )} />

             <InfoSection icon={MapPin} title="Lugares Visitados" data={session.locations} renderItem={(item: Location) => (
                <>
                    <p className="font-bold text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </>
            )} />
        </div>
    </div>
  );
}

interface InfoSectionProps<T> {
    icon: React.ElementType;
    title: string;
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    noImage?: boolean;
}

function InfoSection<T>({ icon: Icon, title, data, renderItem, noImage = false }: InfoSectionProps<T>) {
    if (!data || data.length === 0) return null;

    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {data.map((item, index) => (
                    <Collapsible key={index} className="border-b last:border-b-0 pb-4 last:pb-0" defaultOpen={index < 3}>
                        <div className="flex justify-between items-start">
                            <div className="flex-grow space-y-1">
                                {renderItem(item)}
                            </div>
                            <div className='flex items-center gap-2 pl-4'>
                                {!noImage && (
                                    <Button size="icon" variant="outline" className="h-9 w-9">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                )}
                                 <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </div>
                         <CollapsibleContent>
                            <div className='pt-4 text-xs text-muted-foreground'>
                                {/* Futuro conteúdo do Collapsible, como imagem gerada */}
                            </div>
                         </CollapsibleContent>
                    </Collapsible>
                 ))}
            </CardContent>
        </Card>
    )
}
