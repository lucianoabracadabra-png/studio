'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { Character, LanguageFamily, AlignmentAxis } from '@/lib/character-data';
import { languages, alignmentDescriptions } from '@/lib/character-data';
import { LanguagesIcon, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type InfoPanelProps = {
    character: Character;
    onAlignmentToggle: (axisName: string) => void;
};

export const LanguagePopover = ({ family, knownLanguages }: { family: LanguageFamily, knownLanguages: string[] }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" className="text-foreground justify-start text-left h-auto hover:bg-[var(--page-accent-color)]/20">
                    <LanguagesIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>{family.root}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none text-foreground">{family.root}</h4>
                        <p className="text-sm text-muted-foreground">
                            Dialetos conhecidos da família {family.root}.
                        </p>
                    </div>
                    <div className='pl-4 border-l-2 border-border ml-1 space-y-1'>
                        {family.dialects.map(dialect => (
                            <p key={dialect} className={cn(knownLanguages.includes(dialect) ? "text-foreground font-semibold" : "text-muted-foreground/50")}>
                                {dialect}
                            </p>
                        ))}
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const AlignmentButton = ({ axis }: { axis: AlignmentAxis }) => {
    const [pole1, pole2] = axis.poles;
    const description = alignmentDescriptions[axis.name as keyof typeof alignmentDescriptions];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='w-full'>
                         <Button variant="outline" className='w-full justify-between h-auto py-2 px-3 text-sm hover:bg-[var(--page-accent-color)]/20 cursor-default'>
                            <span className={cn(axis.state === pole1 ? 'font-bold text-foreground' : 'text-muted-foreground')}>{pole1}</span>
                            <span className='font-mono text-xs text-[var(--page-accent-color)]'>{axis.name}</span>
                            <span className={cn(axis.state === pole2 ? 'font-bold text-foreground' : 'text-muted-foreground')}>{pole2}</span>
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent className='max-w-[var(--radix-tooltip-trigger-width)]' side='bottom'>
                    <div className='p-1'>
                        <h4 className='font-bold text-primary mb-2'>{description.title}</h4>
                        <p className='text-xs text-muted-foreground mb-3'>{description.explanation}</p>
                        <Separator />
                        <div className='grid grid-cols-2 gap-x-4 pt-3 text-xs'>
                            <div>
                                <p className='font-semibold text-foreground'>{pole1}</p>
                                <p className='text-muted-foreground'>{description.poles[pole1]}</p>
                            </div>
                            <div>
                                <p className='font-semibold text-foreground'>{pole2}</p>
                                <p className='text-muted-foreground'>{description.poles[pole2]}</p>
                            </div>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}


export function InfoPanelSummary({ character, isOpen }: { character: Character, isOpen: boolean }) {
    const { info, name, concept } = character;
    return (
        <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
            <CardContent className='p-3'>
                <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 rounded-md overflow-hidden border-2 border-border shadow-md flex-shrink-0'>
                        <Image
                            src={info.imageUrl}
                            alt={`Portrait of ${name}`}
                            fill
                            className='object-cover'
                            data-ai-hint={info.imageHint}
                        />
                    </div>
                    <div className='flex-grow'>
                        <p className='font-bold text-xl text-foreground'>{name}</p>
                        <p className='text-sm text-muted-foreground'>{concept}</p>
                    </div>
                    <div className='text-right'>
                        <p className='font-mono text-lg font-bold text-foreground'>{info.experiencia.atual}</p>
                        <p className='text-xs text-muted-foreground'>/ {info.experiencia.total} XP</p>
                    </div>
                    <div className='px-2'>
                        <ChevronDown className={cn('text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function InfoPanel({ character, onAlignmentToggle }: InfoPanelProps) {
    const { info, name } = character;
    return (
        <Card className='mt-2 animate-in fade-in'>
            <CardContent className='p-4 md:p-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='md:col-span-1'>
                        <div className='aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-border shadow-lg'>
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
                        <div className='border-b pb-2'>
                            <p className='text-3xl font-bold text-foreground'>{name}</p>
                            <p className='text-muted-foreground'>{character.concept}</p>
                        </div>
                         <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm'>
                            <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Altura</Label>
                                <p className='text-foreground'>{info.altura}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Peso</Label>
                                <p className='text-foreground'>{info.peso}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Cabelo</Label>
                                <p className='text-foreground'>{info.cabelo}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Olhos</Label>
                                <p className='text-foreground'>{info.olhos}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Pele</Label>
                                <p className='text-foreground'>{info.pele}</p>
                            </div>
                            <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Idade</Label>
                                <p className='text-foreground'>{info.idade}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className='grid grid-cols-2 gap-6 text-sm'>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Ideais</Label>
                                <p className='text-foreground'>{info.ideais}</p>
                            </div>
                             <div className='space-y-1'>
                                <Label className='text-muted-foreground'>Origem</Label>
                                <p className='text-foreground'>{info.origem}</p>
                            </div>
                        </div>
                         <div className='space-y-2 text-sm'>
                            <Label className='text-muted-foreground'>Idiomas</Label>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {languages.map(family => (
                                    <LanguagePopover key={family.root} family={family} knownLanguages={character.info.idiomas} />
                                ))}
                            </div>
                        </div>
                        <Separator />
                         <div className="space-y-2">
                            <Label className='text-muted-foreground'>Alinhamento</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                                {character.spirit.alignment.map(axis => (
                                    <AlignmentButton key={axis.name} axis={axis} />
                                ))}
                            </div>
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
