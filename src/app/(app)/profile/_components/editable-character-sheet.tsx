'use client';

import React, { useState, useReducer, useMemo, useEffect } from 'react';
import type { Character, Armor, Weapon, Accessory, HealthState, CharacterItem, ItemOwnership } from '@/lib/character-data';
import { getNextAlignmentState, iconMap, itemDatabase } from '@/lib/character-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, HeartCrack, Info, Shield, Swords, Gem, BookOpen, PersonStanding, BrainCircuit, Users, ChevronDown, Plus, Minus, MoveUpRight, Anchor, Leaf, Wind, Star, Flame, Mountain, Droplets } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HealthPanel } from '../../characters/_components/health-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Book } from '@/components/layout/book';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// This is a simplified reducer for the editable sheet. 
// A more robust solution might use a library like Immer.
const characterEditReducer = (state: Character, action: { type: string, payload: any }): Character => {
    const { type, payload } = action;

    if (type.startsWith('info.')) {
        const field = type.split('.')[1];
        return { ...state, info: { ...state.info, [field]: payload }};
    }
    
    switch (type) {
        case 'name':
        case 'concept':
            return { ...state, [type]: payload };
        case 'SET_HEALTH': {
            const { partId, boxIndex, newState } = payload;
            const newBodyParts = { ...state.health.bodyParts };
            const newStates = [...newBodyParts[partId].states];
            newStates[boxIndex] = newState;
            newBodyParts[partId] = { ...newBodyParts[partId], states: newStates };

            return {
                ...state,
                health: { ...state.health, bodyParts: newBodyParts }
            };
        }
        case 'SET_FOCUS_ATTRIBUTE': {
            const { pilar, name, value } = payload;
            const focusPilar = state.focus[pilar as keyof typeof state.focus] as any;
            const newAttributes = focusPilar.attributes.map((attr: any) => 
                attr.name === name ? { ...attr, value: parseInt(value, 10) || 0 } : attr
            );
            return { ...state, focus: { ...state.focus, [pilar]: { ...focusPilar, attributes: newAttributes } } };
        }
        case 'SET_FOCUS_SKILL': {
            const { pilar, name, value } = payload;
            const focusPilar = state.focus[pilar as keyof typeof state.focus] as any;
            const newSkills = focusPilar.skills.map((skill: any) => 
                skill.name === name ? { ...skill, value: parseInt(value, 10) || 0 } : skill
            );
            return { ...state, focus: { ...state.focus, [pilar]: { ...focusPilar, skills: newSkills } } };
        }
        case 'SET_FOCUS_MODULAR': {
            const { pilar, modularKey, name, value } = payload;
            const focusPilar = state.focus[pilar as keyof typeof state.focus] as any;
            const newModulars = focusPilar[modularKey].map((mod: any) =>
                mod.name === name ? { ...mod, value: parseInt(value, 10) || 0 } : mod
            );
            return { ...state, focus: { ...state.focus, [pilar]: { ...focusPilar, [modularKey]: newModulars } } };
        }
        default:
            return state;
    }
};

const EditableField = ({ label, value, onValueChange, placeholder, isTextarea = false }: { label: string, value: string | number, onValueChange: (value: string) => void, placeholder?: string, isTextarea?: boolean }) => (
    <div className='space-y-1'>
        <Label className='text-muted-foreground text-xs'>{label}</Label>
        {isTextarea ? (
             <Textarea value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} className='text-sm h-20' />
        ) : (
            <Input type={typeof value === 'number' ? 'number' : 'text'} value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} className='text-sm' />
        )}
    </div>
);

const FocusBranchEditor = ({ focusData, title, pilar, icon, dispatch }: { 
    focusData: any, 
    title: string, 
    pilar: 'physical' | 'mental' | 'social', 
    icon: React.ElementType,
    dispatch: React.Dispatch<any>
}) => {
    
    const modularSkills = focusData.treinamentos || focusData.ciencias || focusData.artes;
    const modularSkillsTitle = pilar === 'physical' ? 'Treinamentos' : pilar === 'mental' ? 'Ciências' : 'Artes';
    const modularSkillsKey = pilar === 'physical' ? 'treinamentos' : pilar === 'mental' ? 'ciencias' : 'artes';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base' style={{ color: 'var(--focus-color)' }}>Atributos</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-2 gap-x-6 gap-y-4'>
                        {focusData.attributes.map((attr: {name: string, value: number}) => (
                            <div key={attr.name} className="flex items-center gap-3">
                               <Input 
                                    type="number" 
                                    value={attr.value}
                                    onChange={e => dispatch({ type: 'SET_FOCUS_ATTRIBUTE', payload: { pilar, name: attr.name, value: e.target.value }})}
                                    className="w-16 h-8 text-center font-bold text-lg text-primary-foreground" 
                                    style={{ backgroundColor: 'var(--focus-color)' }}
                                />
                                <span className="text-foreground font-medium">{attr.name}</span>
                           </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base' style={{ color: 'var(--focus-color)' }}>Habilidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <h4 className="text-sm font-semibold text-muted-foreground mb-2">Perícias</h4>
                        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                             {focusData.skills.map((skill: {name: string, value: number}) => (
                                <div key={skill.name} className="flex justify-between items-center py-1">
                                    <Label className="text-foreground text-sm">{skill.name}</Label>
                                    <Input 
                                        type="number" 
                                        value={skill.value} 
                                        onChange={e => dispatch({ type: 'SET_FOCUS_SKILL', payload: { pilar, name: skill.name, value: e.target.value }})}
                                        className="w-16 h-8 text-center font-bold text-sm"
                                        min={0}
                                        max={7}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {modularSkills && (
                            <>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">{modularSkillsTitle}</h4>
                                <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                                    {modularSkills.map((skill: {name: string, value: number}) => (
                                        <div key={skill.name} className="flex justify-between items-center py-1">
                                            <Label className="text-foreground text-sm">{skill.name}</Label>
                                            <Input 
                                                type="number" 
                                                value={skill.value} 
                                                onChange={e => dispatch({ type: 'SET_FOCUS_MODULAR', payload: { pilar, modularKey: modularSkillsKey, name: skill.name, value: e.target.value }})}
                                                className="w-16 h-8 text-center font-bold text-sm"
                                                min={0}
                                                max={7}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const iconMapEditable: { [key: string]: LucideIcon } = {
    Droplets, Wind, Star, Flame, Mountain, Shield, Anchor, Leaf, Heart,
};

export function EditableCharacterSheet({ character, setCharacter }: { character: Character, setCharacter: React.Dispatch<any> }) {
    const dispatch = (action: { type: string; payload: any; }) => setCharacter(characterEditReducer(character, action));
    const [activeFocusTab, setActiveFocusTab] = useState('physical');
    
    const { info, name, concept } = character;
    
    const imageUrl = useMemo(() => {
        if (info.imageUrl.startsWith('placeholder:')) {
            const id = info.imageUrl.split(':')[1];
            return PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';
        }
        return info.imageUrl;
    }, [info.imageUrl]);
    
    const handleHealthChange = (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => {
        dispatch({ type: 'SET_HEALTH', payload: { partId, boxIndex, newState }});
    };

    const focusColors: Record<string, { hex: string; hsl: string }> = {
        physical: { hex: '#ea4335', hsl: '5 81% 56%' },
        mental: { hex: '#4285f4', hsl: '221 83% 53%' },
        social: { hex: '#34a853', hsl: '142 71% 45%' },
    };

    const pageStyle = {
        '--page-accent-color': 'hsl(265, 90%, 70%)',
    } as React.CSSProperties;

     const focusCardStyle = {
        '--card-border-color': `hsl(${focusColors[activeFocusTab].hsl})`,
        boxShadow: `0 0 25px -5px hsl(${focusColors[activeFocusTab].hsl} / 0.6), 0 0 10px -5px hsl(${focusColors[activeFocusTab].hsl} / 0.5)`
    } as React.CSSProperties;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6" style={pageStyle}>
             <Card>
                <CardContent className='p-4 md:p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div className='md:col-span-1 space-y-4'>
                            <div className='aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-border shadow-lg'>
                                <Image 
                                    src={imageUrl}
                                    alt={`Portrait of ${name}`}
                                    fill
                                    className='object-cover'
                                    data-ai-hint={info.imageHint}
                                />
                            </div>
                            <EditableField label="URL da Imagem" value={info.imageUrl} onValueChange={v => dispatch({type: 'info.imageUrl', payload: v})} />
                            <EditableField label="Dica de IA para Imagem" value={info.imageHint} onValueChange={v => dispatch({type: 'info.imageHint', payload: v})} />
                        </div>
                        <div className='md:col-span-2 space-y-4'>
                            <div className='border-b pb-4 space-y-4'>
                               <EditableField label="Nome do Personagem" value={name} onValueChange={v => dispatch({type: 'name', payload: v})} placeholder="Nome do Personagem" />
                               <EditableField label="Conceito" value={concept} onValueChange={v => dispatch({type: 'concept', payload: v})} placeholder="Ex: Caçador de recompensas" />
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm pt-4'>
                                <EditableField label="Altura" value={info.altura} onValueChange={v => dispatch({type: 'info.altura', payload: v})} />
                                <EditableField label="Peso" value={info.peso} onValueChange={v => dispatch({type: 'info.peso', payload: v})} />
                                <EditableField label="Cabelo" value={info.cabelo} onValueChange={v => dispatch({type: 'info.cabelo', payload: v})} />
                                <EditableField label="Olhos" value={info.olhos} onValueChange={v => dispatch({type: 'info.olhos', payload: v})} />
                                <EditableField label="Pele" value={info.pele} onValueChange={v => dispatch({type: 'info.pele', payload: v})} />
                                <EditableField label="Idade" value={info.idade} onValueChange={v => dispatch({type: 'info.idade', payload: v})} />
                            </div>
                            <Separator />
                             <div className='grid grid-cols-1 gap-4 text-sm'>
                                <EditableField label="Ideais" value={info.ideais} onValueChange={v => dispatch({type: 'info.ideais', payload: v})} isTextarea />
                                <EditableField label="Origem" value={info.origem} onValueChange={v => dispatch({type: 'info.origem', payload: v})} />
                            </div>
                            <Separator />
                             <div className='space-y-1 text-sm'>
                                <Label className='text-muted-foreground'>Experiência</Label>
                                <div className='flex items-center gap-2'>
                                    <Input type="number" value={info.experiencia.atual} onChange={e => dispatch({type: 'info.experiencia', payload: { ...info.experiencia, atual: parseInt(e.target.value) || 0 }})} />
                                    <span className='text-muted-foreground'>/</span>
                                     <Input type="number" value={info.experiencia.total} onChange={e => dispatch({type: 'info.experiencia', payload: { ...info.experiencia, total: parseInt(e.target.value) || 0 }})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <HealthPanel healthData={character.health} onHealthChange={handleHealthChange} />
            
             <Card style={{ '--card-border-color': `hsl(${focusColors[activeFocusTab].hsl})`, ...focusCardStyle }}>
                <CardHeader>
                    <CardTitle className='text-center' style={{ color: focusColors[activeFocusTab].hex }}>
                        Focos de Desenvolvimento
                    </CardTitle>
                </CardHeader>
                <CardContent style={{ '--card-border-color': `hsl(${focusColors[activeFocusTab].hsl})` } as React.CSSProperties}>
                    <Tabs defaultValue="physical" className="w-full" onValueChange={value => setActiveFocusTab(value)}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="physical" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'physical' ? { backgroundColor: focusColors.physical.hex } : {}}>
                                <PersonStanding />Físico
                            </TabsTrigger>
                            <TabsTrigger value="mental" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'mental' ? { backgroundColor: focusColors.mental.hex } : {}}>
                                <BrainCircuit />Mental
                            </TabsTrigger>
                            <TabsTrigger value="social" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'social' ? { backgroundColor: focusColors.social.hex } : {}}>
                                <Users />Social
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="physical" className='pt-6' style={{ '--focus-color': focusColors.physical.hex, '--focus-color-hsl': focusColors.physical.hsl } as React.CSSProperties}>
                            <FocusBranchEditor focusData={character.focus.physical} title='Físico' pilar='physical' icon={PersonStanding} dispatch={dispatch} />
                        </TabsContent>
                        <TabsContent value="mental" className='pt-6' style={{ '--focus-color': focusColors.mental.hex, '--focus-color-hsl': focusColors.mental.hsl } as React.CSSProperties}>
                           <FocusBranchEditor focusData={character.focus.mental} title='Mental' pilar='mental' icon={BrainCircuit} dispatch={dispatch} />
                        </TabsContent>
                        <TabsContent value="social" className='pt-6' style={{ '--focus-color': focusColors.social.hex, '--focus-color-hsl': focusColors.social.hsl } as React.CSSProperties}>
                             <FocusBranchEditor focusData={character.focus.social} title='Social' pilar='social' icon={Users} dispatch={dispatch} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

        </div>
    );
}
