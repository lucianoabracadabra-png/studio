'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Character } from '@/lib/character-data';

type InfoPanelProps = {
    characterInfo: Character['info'];
    name: string;
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className='flex justify-between items-baseline border-b border-white/10 pb-1'>
        <p className='font-bold text-sm text-foreground/80'>{label}:</p>
        <p className='text-right'>{value}</p>
    </div>
);

const LanguageDisplay = () => (
    <div className='flex items-baseline gap-2'>
         <p className='font-bold text-sm text-foreground/80'>Idioma:</p>
        <div className='flex-grow flex justify-end items-center gap-2'>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>T</span>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>U</span>
            <span className='font-mono px-1 bg-yellow-400/80 text-yellow-950 border border-yellow-600 rounded-sm'>E</span>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>M</span>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>K</span>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>B</span>
            <span className='font-mono px-1 bg-muted/50 border border-input rounded-sm'>D</span>
        </div>
    </div>
);

export function InfoPanel({ characterInfo, name }: InfoPanelProps) {
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
                                src={characterInfo.imageUrl}
                                alt={`Portrait of ${name}`}
                                fill
                                className='object-cover'
                                data-ai-hint={characterInfo.imageHint}
                            />
                        </div>
                    </div>
                    <div className='col-span-2 space-y-2'>
                        <div className='border border-white/10 rounded-md p-2 text-center bg-background/30'>
                            <p className='font-headline text-2xl'>{name}</p>
                        </div>
                         <div className='space-y-2 p-2 border border-white/10 rounded-md bg-background/30 h-[calc(100%-3.5rem)]'>
                            <InfoRow label="Altura" value={`${characterInfo.altura} cm`} />
                            <InfoRow label="Peso" value={`${characterInfo.peso} kg`} />
                            <InfoRow label="Cabelo" value={characterInfo.cabelo} />
                            <InfoRow label="Olhos" value={characterInfo.olhos} />
                            <InfoRow label="Pele" value={characterInfo.pele} />
                            <InfoRow label="Idade" value={characterInfo.idade} />
                        </div>
                    </div>
                </div>
                <div className='space-y-2 p-2 border border-white/10 rounded-md bg-background/30'>
                    <InfoRow label="Ideais" value={characterInfo.ideais} />
                    <InfoRow label="Origem" value={characterInfo.origem} />
                    <LanguageDisplay />
                    <div className='flex justify-between items-baseline pt-1'>
                        <InfoRow label="Experiência" value={`${characterInfo.experiencia.atual} / ${characterInfo.experiencia.total}`} />
                        <InfoRow label="Total gasto" value={characterInfo.experiencia.total} />
                    </div>
                </div>
                <div className='p-2 border border-white/10 rounded-md bg-background/30 text-center text-sm text-muted-foreground'>
                    <p>Altruísmo | Emoção | Corrupção</p>
                </div>
            </CardContent>
        </Card>
    );
}
