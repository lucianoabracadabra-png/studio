'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { Character } from '@/lib/character-data';
import { languages } from '@/lib/character-data';
import { LanguagesIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';


type InfoPanelProps = {
    character: Character;
};

const LanguagePopover = ({ knownLanguages }: { knownLanguages: string[] }) => (
    <Popover>
        <PopoverTrigger asChild>
             <Button variant="link" className="text-foreground/80 p-0 h-auto justify-start">
                <LanguagesIcon className="mr-2 h-4 w-4" />
                <span className='text-foreground/80'>Idiomas Conhecidos</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 glassmorphic-card">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none text-foreground">Idiomas</h4>
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
                                     <p key={dialect} className={cn("text-foreground/80", knownLanguages.includes(dialect) ? "text-foreground" : "text-muted-foreground/50")}>
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

export function InfoPanelSummary({ character, isOpen }: { character: Character, isOpen: boolean }) {
    const { info, name, concept } = character;
    return (
        <Card className='glassmorphic-card hover:bg-card/70 transition-colors cursor-pointer'>
            <CardContent className='p-3'>
                <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 rounded-md overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0'>
                        <Image
                            src={info.imageUrl}
                            alt={`Portrait of ${name}`}
                            fill
                            className='object-cover'
                            data-ai-hint={info.imageHint}
                        />
                    </div>
                    <div className='flex-grow'>
                        <p className='font-headline text-2xl magical-glow'>{name}</p>
                        <p className='text-sm text-muted-foreground'>{concept}</p>
                    </div>
                    <div className='text-right'>
                        <p className='font-mono text-lg font-bold text-foreground'>{info.experiencia.atual}</p>
                        <p className='text-xs text-muted-foreground'>/ {info.experiencia.total} XP</p>
                    </div>
                    <div className='px-2'>
                        {isOpen ? <ChevronUp className='text-muted-foreground' /> : <ChevronDown className='text-muted-foreground' />}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function InfoPanel({ character }: InfoPanelProps) {
    const { info, name } = character;
    return (
        <Card className='glassmorphic-card mt-2 animate-in fade-in'>
            <CardContent className='p-4 md:p-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='md:col-span-1'>
                        <div className='aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-white/20 shadow-lg'>
                             <Image 
                                src={info.imageUrl}
                                alt={`Portrait of ${name}`}
                                fill
                                className='object-cover'
                                data-ai-hint={info.imageHint}
                            />
                        </div>
                    </div>
                    <div className='md:col-span-2 space-y-4'>
                        <div className='border-b-2 border-primary/30 pb-2'>
                            <p className='font-headline text-4xl magical-glow'>{name}</p>
                            <p className='text-muted-foreground'>{character.concept}</p>
                        </div>
                         <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm'>
                            <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Altura</Label>
                                <p className='text-foreground/80'>{info.altura}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Peso</Label>
                                <p className='text-foreground/80'>{info.peso}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Cabelo</Label>
                                <p className='text-foreground/80'>{info.cabelo}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Olhos</Label>
                                <p className='text-foreground/80'>{info.olhos}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Pele</Label>
                                <p className='text-foreground/80'>{info.pele}</p>
                            </div>
                            <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Idade</Label>
                                <p className='text-foreground/80'>{info.idade}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className='grid grid-cols-2 gap-6 text-sm'>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Ideais</Label>
                                <p className='text-foreground/80'>{info.ideais}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Origem</Label>
                                <p className='text-foreground/80'>{info.origem}</p>
                            </div>
                        </div>
                         <div className='space-y-1 text-sm'>
                            <Label className='text-muted-foreground'>Idiomas</Label>
                            <LanguagePopover knownLanguages={character.info.idiomas} />
                        </div>
                        <Separator />
                        <div className='space-y-1 text-sm'>
                            <Label className='text-muted-foreground'>Experiência</Label>
                            <p className='font-mono text-lg text-foreground'>{info.experiencia.atual} / {info.experiencia.total}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
