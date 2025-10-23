'use client';

import React, { useState, useEffect, useReducer } from 'react';
import { characterData as initialCharacterData, Character, Armor, Weapon, Accessory, HealthState, AlignmentAxis, getNextAlignmentState, Fluxo, Patrono, languages } from '@/lib/character-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, HeartCrack, Info, Shield, Swords, Gem, BookOpen, PersonStanding, BrainCircuit, Users, ChevronDown, Hand, Footprints } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMovableWindow } from '@/context/movable-window-context';
import { InfoPanel, InfoPanelSummary, LanguagePopover } from './info-panel';
import { HealthPanel } from './health-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Book } from '@/components/layout/book';

const FocusHeaderCard = ({ title, icon, resource, spentPoints }: { title: string, icon: React.ElementType, resource: { name: string, value: number, max: number }, spentPoints: number }) => (
    <Card>
        <CardContent className='pt-6 space-y-2'>
            <div className='flex items-center justify-between'>
                 <h3 className='font-bold text-xl'>{title}</h3>
                 <span className='text-primary'>{React.createElement(icon)}</span>
            </div>
            <Separator />
            <div className='grid grid-cols-2 gap-x-4 items-center text-sm'>
                <div>
                    <p className='font-bold'>{resource.name}</p>
                    <p className='font-mono'>{resource.value} / {resource.max}</p>
                </div>
                <div>
                    <p className='text-muted-foreground'>Gasto:</p>
                    <p className='font-mono'>{spentPoints}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

type AttributeItemProps = {
    name: string;
    level: number;
    pilar: 'fisico' | 'mental' | 'social';
    onLevelChange: (name: string, newLevel: number) => void;
};

const AttributeItem = ({ name, level, pilar, onLevelChange }: AttributeItemProps) => {
    return (
        <div className="flex justify-between items-center">
            <div className='flex items-center gap-2'>
                <span className='font-bold text-lg w-5 text-center text-primary'>
                    {level}
                </span>
                <span className="text-foreground">{name}</span>
            </div>
            <div className="flex items-center gap-1">
                {[...Array(15)].map((_, i) => (
                    <button
                        key={i}
                        className={cn('w-2 h-2 rounded-full cursor-pointer transition-all', i < level ? 'bg-primary' : 'bg-muted')}
                        onClick={() => onLevelChange(name, i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

const SkillItem = ({ name, initialValue, pilar }: { name: string; initialValue: number, pilar: 'fisico' | 'mental' | 'social' }) => {
    const [level, setLevel] = useState(initialValue);
    
    const handleDotClick = (newLevel: number) => {
        setLevel(currentLevel => {
            const finalLevel = newLevel === currentLevel ? newLevel - 1 : newLevel;
            return Math.max(0, finalLevel);
        });
    };

    return (
         <div className="flex justify-between items-center py-1">
            <span className="text-foreground">{name}</span>
            <div className='flex gap-1.5 items-center'>
                {[...Array(7)].map((_, i) => (
                    <button
                        key={i}
                        className={cn('w-3 h-3 bg-muted cursor-pointer transition-all rounded-sm transform rotate-45', { 'bg-primary': i < level })}
                        onClick={() => handleDotClick(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

type FocusState = {
    attributes: { [key: string]: number };
    spentPoints: number;
};

type FocusAction = 
    | { type: 'SET_ATTRIBUTE'; payload: { name: string; level: number, baseLevel: number } }
    | { type: 'RESET' };

function focusReducer(state: FocusState, action: FocusAction): FocusState {
    switch (action.type) {
        case 'SET_ATTRIBUTE': {
            const { name, level } = action.payload;
            const newAttributes = { ...state.attributes, [name]: level };

            const spentPoints = Object.entries(newAttributes).reduce((total, [attrName, currentLevel]) => {
                const base = initialCharacterData.focus.physical.attributes.find(a => a.name === attrName)?.value || 
                             initialCharacterData.focus.mental.attributes.find(a => a.name === attrName)?.value ||
                             initialCharacterData.focus.social.attributes.find(a => a.name === attrName)?.value || 0;
                
                if (currentLevel > base) {
                    total += (currentLevel - base);
                }
                return total;
            }, 0);

            return {
                ...state,
                attributes: newAttributes,
                spentPoints: spentPoints,
            };
        }
        case 'RESET':
            return { attributes: {}, spentPoints: 0 };
        default:
            return state;
    }
}


const FocusBranch = ({ focusData, title, pilar, icon }: { focusData: any, title: string, pilar: 'fisico' | 'mental' | 'social', icon: React.ElementType }) => {
    const initialAttributeState: FocusState = {
        attributes: focusData.attributes.reduce((acc: any, attr: any) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {}),
        spentPoints: 0,
    };

    const [state, dispatch] = useReducer(focusReducer, initialAttributeState);

    const handleAttributeChange = (name: string, newLevel: number) => {
        const baseLevel = focusData.attributes.find((a: any) => a.name === name)?.value || 0;
        dispatch({ type: 'SET_ATTRIBUTE', payload: { name, level: newLevel, baseLevel }});
    };

    const modularSkills = focusData.treinamentos || focusData.ciencias || focusData.artes;
    const modularSkillsTitle = pilar === 'fisico' ? 'Treinamentos' : pilar === 'mental' ? 'Ciências' : 'Artes';

    const resource = focusData.vigor || focusData.focus || focusData.grace;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <div className="md:col-span-1">
                <FocusHeaderCard title={title} icon={icon} resource={resource} spentPoints={state.spentPoints} />
            </div>
            
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base'>Atributos</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {focusData.attributes.map((attr: {name: string, value: number}) => (
                            <AttributeItem 
                                key={attr.name} 
                                name={attr.name} 
                                level={state.attributes[attr.name]} 
                                pilar={pilar}
                                onLevelChange={(name, level) => handleAttributeChange(name, level)}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base'>Perícias</CardTitle>
                    </CardHeader>
                    <CardContent className='md:grid md:grid-cols-2 md:gap-x-4 divide-y divide-border'>
                        {focusData.skills.map((skill: {name: string, value: number}) => (
                            <SkillItem key={skill.name} name={skill.name} initialValue={skill.value} pilar={pilar} />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {modularSkills && (
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-base'>{modularSkillsTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className='md:grid md:grid-cols-2 md:gap-x-4 divide-y divide-border'>
                            {modularSkills.map((skill: {name: string, value: number}) => (
                                <SkillItem key={skill.name} name={skill.name} initialValue={skill.value} pilar={pilar} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

const SoulCracks = ({ value }: { value: number }) => {
    return (
        <div className="flex items-center gap-2">
            {[...Array(10)].map((_, i) => {
                const isCracked = i < value;
                return (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger>
                                {isCracked ? (
                                    <HeartCrack className="h-6 w-6 text-red-500" />
                                ) : (
                                    <Heart className="h-6 w-6 text-muted-foreground/50" />
                                )}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rachadura #{i + 1}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
        </div>
    );
};

const ArmorCardDetails = ({ armor }: { armor: Armor }) => (
    <div className='space-y-4 pt-4'>
        <p className="text-sm text-muted-foreground">{armor.extras}</p>
        <Separator/>
        <div className='grid grid-cols-3 gap-2 text-center'>
            <div><Label className='text-muted-foreground'>Cortante</Label><p className='font-mono text-foreground'>{armor.slashing}</p></div>
            <div><Label className='text-muted-foreground'>Esmagamento</Label><p className='font-mono text-foreground'>{armor.bludgeoning}</p></div>
            <div><Label className='text-muted-foreground'>Perfurante</Label><p className='font-mono text-foreground'>{armor.piercing}</p></div>
        </div>
        <div className='grid grid-cols-3 gap-2 text-center'>
            <div><Label className='text-muted-foreground'>Resistência</Label><p className='font-mono text-foreground'>{armor.resistance}</p></div>
            <div><Label className='text-muted-foreground'>Durabilidade</Label><p className='font-mono text-foreground'>{armor.durability}</p></div>
            <div><Label className='text-muted-foreground'>Peso</Label><p className='font-mono text-foreground'>{armor.weight}kg</p></div>
        </div>
    </div>
);

const WeaponCardDetails = ({ weapon }: { weapon: Weapon }) => (
     <div className='space-y-4 pt-4'>
        <p className="text-sm text-muted-foreground">{weapon.extras}</p>
        <Separator/>
        {weapon.thrust && (
            <div>
                <h4 className='font-semibold text-accent mb-2'>Thrust</h4>
                <div className='grid grid-cols-4 gap-2 text-center text-sm'>
                    <div><Label className='text-muted-foreground'>Dano</Label><p className='text-foreground'>{weapon.thrust.damage}</p></div>
                    <div><Label className='text-muted-foreground'>Tipo</Label><p className='text-foreground'>{weapon.thrust.type}</p></div>
                    <div><Label className='text-muted-foreground'>AP</Label><p className='text-foreground'>{weapon.thrust.ap}</p></div>
                    <div><Label className='text-muted-foreground'>Precisão</Label><p className='text-foreground'>{weapon.thrust.accuracy}</p></div>
                </div>
            </div>
        )}
        {weapon.swing && (
            <div>
                <h4 className='font-semibold text-accent mb-2'>Swing</h4>
                <div className='grid grid-cols-4 gap-2 text-center text-sm'>
                    <div><Label className='text-muted-foreground'>Dano</Label><p className='text-foreground'>{weapon.swing.damage}</p></div>
                    <div><Label className='text-muted-foreground'>Tipo</Label><p className='text-foreground'>{weapon.swing.type}</p></div>
                    <div><Label className='text-muted-foreground'>AP</Label><p className='text-foreground'>{weapon.swing.ap}</p></div>
                    <div><Label className='text-muted-foreground'>Precisão</Label><p className='text-foreground'>{weapon.swing.accuracy}</p></div>
                </div>
            </div>
        )}
        <div className='grid grid-cols-2 gap-2 text-center pt-2 border-t border-border'>
            <div><Label className='text-muted-foreground'>Peso</Label><p className='font-mono text-foreground'>{weapon.weight}kg</p></div>
            <div><Label className='text-muted-foreground'>Tamanho</Label><p className='font-mono uppercase text-foreground'>{weapon.size}</p></div>
        </div>
    </div>
);

const AccessoryCardDetails = ({ accessory }: { accessory: Accessory }) => (
    <div className='space-y-4 pt-4'>
        <p className="text-sm text-muted-foreground">{accessory.typeAndDescription}</p>
        <Separator/>
        <div className='grid grid-cols-2 gap-2 text-center'>
            <div><Label className='text-muted-foreground'>Peso</Label><p className='font-mono text-foreground'>{accessory.weight}kg</p></div>
            <div><Label className='text-muted-foreground'>Efeito</Label><p className='font-mono text-foreground'>{accessory.effect}</p></div>
        </div>
    </div>
);


const EquippedItemCard = ({ item, type }: { item: Armor | Weapon | Accessory, type: 'armor' | 'weapon' | 'accessory' }) => {
    const { openItem, isItemOpen } = useMovableWindow();

    const iconMap = {
        armor: <Shield />,
        weapon: <Swords />,
        accessory: <Gem />
    };
    
    const isOpen = isItemOpen(item.name);

    const handleOpen = () => {
        let content;
        if (type === 'armor') {
            content = <ArmorCardDetails armor={item as Armor} />;
        } else if (type === 'weapon') {
            content = <WeaponCardDetails weapon={item as Weapon} />;
        } else {
            content = <AccessoryCardDetails accessory={item as Accessory} />;
        }
        openItem({ id: item.name, title: item.name, content });
    };

    return (
        <Button
            variant="outline"
            className={cn(
                "w-full justify-start h-auto p-3",
                isOpen && "bg-primary/20 border-primary/50"
            )}
            onClick={handleOpen}
        >
            <div className="flex items-center gap-3">
                <span className={cn("text-accent", isOpen && "text-primary")}>{iconMap[type]}</span>
                <p className="text-base font-semibold text-foreground">{item.name}</p>
            </div>
        </Button>
    );
};

const EquippedSection = ({ equipment }: { equipment: Character['equipment'] }) => {
    const { openAllEquipped } = useMovableWindow();

    const equippedArmors = equipment.armors.filter(i => i.equipped);
    const equippedWeapons = equipment.weapons.filter(i => i.equipped);
    const equippedAccessories = equipment.accessories.filter(i => i.equipped);

    const handleOpenAll = () => {
        const allEquippedItems = [
            ...equippedArmors.map(item => ({ id: item.name, title: item.name, content: <ArmorCardDetails armor={item} /> })),
            ...equippedWeapons.map(item => ({ id: item.name, title: item.name, content: <WeaponCardDetails weapon={item} /> })),
            ...equippedAccessories.map(item => ({ id: item.name, title: item.name, content: <AccessoryCardDetails accessory={item} /> })),
        ];
        openAllEquipped(allEquippedItems);
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle>Equipamento</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleOpenAll}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Abrir Todos
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-center text-muted-foreground">Armaduras</h3>
                    {equippedArmors.length > 0 ? equippedArmors.map(item => <EquippedItemCard key={item.name} item={item} type="armor" />) : <p className="text-xs text-center text-muted-foreground">Nenhuma armadura equipada.</p>}
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-center text-muted-foreground">Armas</h3>
                    {equippedWeapons.length > 0 ? equippedWeapons.map(item => <EquippedItemCard key={item.name} item={item} type="weapon" />) : <p className="text-xs text-center text-muted-foreground">Nenhuma arma equipada.</p>}
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-center text-muted-foreground">Acessórios</h3>
                    {equippedAccessories.length > 0 ? equippedAccessories.map(item => <EquippedItemCard key={item.name} item={item} type="accessory" />) : <p className="text-xs text-center text-muted-foreground">Nenhum acessório equipado.</p>}
                </div>
            </CardContent>
        </Card>
    );
}

const InventorySection = ({ equipment, inventory }: { equipment: Character['equipment'], inventory: Character['inventory'] }) => {
    
    const unequippedItems = [
        ...equipment.armors.filter(i => !i.equipped).map(i => ({...i, quantity: 1, type: 'Armadura'})),
        ...equipment.weapons.filter(i => !i.equipped).map(i => ({...i, quantity: 1, type: 'Arma'})),
        ...equipment.accessories.filter(i => !i.equipped).map(i => ({...i, quantity: 1, type: 'Acessório'})),
        ...equipment.projectiles.map(i => ({...i, type: 'Projétil'})),
        ...inventory.bag.map(i => ({...i, type: 'Item'})),
    ];
    
    const totalWeight = unequippedItems.reduce((acc, item) => acc + (item.weight * item.quantity), 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-baseline">
                    <CardTitle>Inventário</CardTitle>
                    <p className="font-mono text-muted-foreground flex items-center gap-2 text-sm"><Info className="h-4 w-4"/> {totalWeight.toFixed(2)}kg</p>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className='text-center'>Qtd</TableHead>
                            <TableHead className='text-right'>Peso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unequippedItems.map(item => (
                            <TableRow key={item.name}>
                                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.type}</TableCell>
                                <TableCell className='text-center text-foreground'>{item.quantity}</TableCell>
                                <TableCell className='text-right font-mono text-foreground'>{(item.weight * item.quantity).toFixed(2)}kg</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export function CharacterSheet() {
    const [character, setCharacter] = useState<Character>(() => {
        const charImage = PlaceHolderImages.find(p => p.id === 'character-dahl');
        if (charImage) {
            initialCharacterData.info.imageUrl = charImage.imageUrl;
        }
        return initialCharacterData;
    });

    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

    const handleHealthChange = (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => {
        setCharacter(prev => {
            const newBodyParts = { ...prev.health.bodyParts };
            const newStates = [...newBodyParts[partId].states];
            newStates[boxIndex] = newState;
            newBodyParts[partId] = { ...newBodyParts[partId], states: newStates };

            return {
                ...prev,
                health: {
                    ...prev.health,
                    bodyParts: newBodyParts
                }
            };
        });
    };

    const handleAlignmentToggle = (axisName: string) => {
        setCharacter(prev => {
            const newAlignment = prev.spirit.alignment.map(axis => {
                if (axis.name === axisName) {
                    return { ...axis, state: getNextAlignmentState(axis.state, axis.poles) };
                }
                return axis;
            });
            return { ...prev, spirit: { ...prev.spirit, alignment: newAlignment } };
        })
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            
            <Collapsible open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen}>
                <CollapsibleTrigger className='w-full'>
                   <InfoPanelSummary character={character} isOpen={isInfoPanelOpen} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <InfoPanel 
                        character={character}
                        onAlignmentToggle={handleAlignmentToggle}
                    />
                </CollapsibleContent>
            </Collapsible>
            
            <HealthPanel healthData={character.health} onHealthChange={handleHealthChange} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader><CardTitle className="text-center">Alma</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center items-end gap-2">
                           {character.soul.domains.map(d => (
                                <TooltipProvider key={d.name}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="relative">
                                                <Book
                                                    icon={d.icon}
                                                    colorHsl={d.color}
                                                    isClickable={false}
                                                    showLabel={false}
                                                    label={d.name}
                                                    isActive={d.level > 0}
                                                />
                                                {d.level > 0 && (
                                                    <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center pointer-events-none">
                                                        <span className="text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                            {d.level}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className='font-bold'>{d.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                           ))}
                        </div>
                        <Separator/>
                        <div className="space-y-3 pt-2">
                            <h3 className='font-semibold text-center text-muted-foreground'>Rachaduras</h3>
                            <div className="flex justify-center">
                                <SoulCracks value={character.soul.cracks} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-center">Espírito</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="personality-table-container">
                            <div className='personality-table-header'>PERSONALIDADE</div>
                            <div className='personality-table-body'>
                                {character.spirit.personality.map(p => (
                                    <div key={p.name} className='personality-table-cell'>
                                        <div className='value'>{p.value}</div>
                                        <div className='name'>{p.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center">
                                <p className="font-headline font-bold text-lg text-amber-400">FLUXO</p>
                                <p className="text-2xl font-bold">{character.soul.anima.fluxo.level}</p>
                            </div>
                             <div className="text-center">
                                <p className="font-headline font-bold text-lg text-amber-400">PATRONO</p>
                                <p className="text-2xl font-bold">{character.soul.anima.patrono.level}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='text-center'>Focos de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="physical" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="physical" className='flex items-center gap-2'><PersonStanding />Físico</TabsTrigger>
                            <TabsTrigger value="mental" className='flex items-center gap-2'><BrainCircuit />Mental</TabsTrigger>
                            <TabsTrigger value="social" className='flex items-center gap-2'><Users />Social</TabsTrigger>
                        </TabsList>
                        <TabsContent value="physical" className='pt-6'>
                            <FocusBranch focusData={character.focus.physical} title='Físico' pilar='fisico' icon={PersonStanding} />
                        </TabsContent>
                        <TabsContent value="mental" className='pt-6'>
                            <FocusBranch focusData={character.focus.mental} title='Mental' pilar='mental' icon={BrainCircuit} />
                        </TabsContent>
                        <TabsContent value="social" className='pt-6'>
                            <FocusBranch focusData={character.focus.social} title='Social' pilar='social' icon={Users} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
             
            <EquippedSection equipment={character.equipment} />
            <InventorySection equipment={character.equipment} inventory={character.inventory} />
        </div>
    );
}
