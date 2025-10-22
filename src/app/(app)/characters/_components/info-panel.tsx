'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { Character } from '@/lib/character-data';
import { languages } from '@/lib/character-data';
import { LanguagesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';


type InfoPanelProps = {
    character: Character;
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className='flex justify-between items-baseline border-b border-white/10 pb-1'>
        <p className='font-bold text-sm text-foreground/80'>{label}:</p>
        <p className='text-right'>{value}</p>
    </div>
);

const LanguagePopover = ({ knownLanguages }: { knownLanguages: string[] }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="link" className="text-foreground/80 p-0 h-auto justify-start">
                <LanguagesIcon className="mr-2 h-4 w-4" />
                <span>Idiomas Conhecidos</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 glassmorphic-card">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Idiomas</h4>
                    <p className="text-sm text-muted-foreground">
                        Idiomas conhecidos pelo personagem.
                    </p>
                </div>
                <div className="grid gap-2">
                    {languages.map(family => (
                        <div key={family.root} className="text-sm">
                            <p className={cn("font-bold", knownLanguages.includes(family.root) ? "text-primary" : "text-muted-foreground")}>
                                {family.root}
                            </p>
                            <div className='pl-4 border-l-2 border-border ml-1'>
                                {family.dialects.map(dialect => (
                                     <p key={dialect} className={cn(knownLanguages.includes(dialect) ? "text-foreground" : "text-muted-foreground/50")}>
                                        {dialect}
                                     </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PopoverContent>
    </Popover>
);

export function InfoPanel({ character }: InfoPanelProps) {
    const { info, name } = character;
    return (
        <Card className='glassmorphic-card'>
            <CardHeader className='p-0 border-b-2 border-primary/20'>
                <p className='font-headline text-2xl text-center p-1 magical-glow'>INFORMAÇÕES</p>
            </CardHeader>
            <CardContent className='p-2 space-y-2'>
                <div className='grid grid-cols-3 gap-2'>
                    <div className='col-span-1'>
                        <div className='aspect-w-3 aspect-h-4 relative rounded-md overflow-hidden border-2 border-white/20'>
                             <Image 
                                src={info.imageUrl}
                                alt={`Portrait of ${name}`}
                                fill
                                className='object-cover'
                                data-ai-hint={info.imageHint}
                            />
                        </div>
                    </div>
                    <div className='col-span-2 space-y-2'>
                        <div className='border border-white/10 rounded-md p-2 text-center bg-background/30'>
                            <p className='font-headline text-2xl'>{name}</p>
                        </div>
                         <div className='space-y-2 p-2 border border-white/10 rounded-md bg-background/30 h-[calc(100%-3.5rem)]'>
                            <InfoRow label="Altura" value={`${info.altura} cm`} />
                            <InfoRow label="Peso" value={`${info.peso} kg`} />
                            <InfoRow label="Cabelo" value={info.cabelo} />
                            <InfoRow label="Olhos" value={info.olhos} />
                            <InfoRow label="Pele" value={info.pele} />
                            <InfoRow label="Idade" value={info.idade} />
                        </div>
                    </div>
                </div>
                <div className='space-y-2 p-2 border border-white/10 rounded-md bg-background/30'>
                    <InfoRow label="Ideais" value={info.ideais} />
                    <InfoRow label="Origem" value={info.origem} />
                    <div className='flex justify-between items-baseline border-b border-white/10 pb-1'>
                         <p className='font-bold text-sm text-foreground/80'>Idioma:</p>
                         <LanguagePopover knownLanguages={character.info.idiomas} />
                    </div>
                    <div className='pt-1'>
                        <InfoRow label="Experiência" value={`${info.experiencia.atual} / ${info.experiencia.total}`} />
                    </div>
                </div>
                <div className='p-2 border border-white/10 rounded-md bg-background/30 text-center text-sm text-muted-foreground'>
                    <p>Altruísmo | Emoção | Corrupção</p>
                </div>
            </CardContent>
        </Card>
    );
}
