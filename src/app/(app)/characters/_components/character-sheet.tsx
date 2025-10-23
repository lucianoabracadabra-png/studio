
'use client';

import React, { useState, useReducer } from 'react';
import initialCharacterData from '@/lib/character-data.json';
import type { Character, Armor, Weapon, Accessory, HealthState } from '@/lib/character-data';
import { getNextAlignmentState, iconMap } from '@/lib/character-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HeartCrack, Info, Shield, Swords, Gem, BookOpen, PersonStanding, BrainCircuit, Users, ChevronDown, Plus, Minus, MoveUpRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMovableWindow } from '@/context/movable-window-context';
import { InfoPanel, InfoPanelSummary } from './info-panel';
import { HealthPanel } from './health-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Book } from '@/components/layout/book';

const FocusHeaderCard = ({ title, icon, resourceName, current, max, spentPoints, dispatch, pilar }: { title: string, icon: React.ElementType, resourceName: string, current: number, max: number, spentPoints: number, dispatch: React.Dispatch<any>, pilar: 'físico' | 'mental' | 'social' }) => {
    
    const handleDecrement = () => {
        dispatch({ type: 'DECREMENT_SPENT', pilar: pilar });
    };
    
    const handleIncrement = () => {
        dispatch({ type: 'INCREMENT_SPENT', pilar: pilar });
    };

    const pilarColorClass = {
        físico: 'text-orange-500',
        mental: 'text-blue-500',
        social: 'text-green-500',
    };

    return (
        <Card>
            <CardContent className='pt-6 space-y-2'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold text-xl'>{title}</h3>
                    <span className={pilarColorClass[pilar]}>{React.createElement(icon)}</span>
                </div>
                <Separator />
                <div className='grid grid-cols-2 gap-x-4 items-center text-sm'>
                    <div>
                        <p className='font-bold'>{resourceName}</p>
                        <p className={`font-mono font-bold text-lg ${pilarColorClass[pilar]}`}>{current} / {max}</p>
                    </div>
                    <div>
                        <p className='text-muted-foreground'>Gasto:</p>
                        <div className='flex items-center gap-2'>
                             <Button variant='outline' size='icon' className='h-6 w-6' onClick={handleDecrement}><Minus className='h-4 w-4'/></Button>
                             <span className='font-mono text-lg text-center w-6'>{spentPoints}</span>
                             <Button variant='outline' size='icon' className='h-6 w-6' onClick={handleIncrement}><Plus className='h-4 w-4'/></Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AttributeItem = ({ name, level, colorClass }: { name: string; level: number, colorClass: string }) => {
    return (
        <div className="flex items-center gap-3 py-1">
            <span className={cn("font-bold text-lg w-4 text-center", colorClass)}>{level}</span>
            <span className="text-foreground">{name}</span>
        </div>
    );
};


const SkillItem = ({ name, initialValue, pilar, colorClass, onLevelChange }: { name: string; initialValue: number, pilar: 'físico' | 'mental' | 'social', colorClass: string, onLevelChange: (pilar: 'físico' | 'mental' | 'social', name: string, newLevel: number) => void }) => {
    
    const handleDotClick = (newLevel: number) => {
        const finalLevel = newLevel === initialValue ? newLevel - 1 : newLevel;
        onLevelChange(pilar, name, Math.max(0, finalLevel));
    };

    return (
         <div className="flex justify-between items-center py-1">
            <span className="text-foreground">{name}</span>
            <div className='flex gap-1.5 items-center'>
                {[...Array(7)].map((_, i) => (
                    <button
                        key={i}
                        className={cn('w-3 h-3 bg-muted cursor-pointer transition-all rounded-sm transform rotate-45', { [colorClass]: i < initialValue })}
                        onClick={() => handleDotClick(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

type FocusPilarState = {
  attributes: { [key: string]: number };
  skills: { [key: string]: number };
  modular: { [key: string]: number };
  spentPoints: number;
};

type FocusState = {
    fisico: FocusPilarState;
    mental: FocusPilarState;
    social: FocusPilarState;
};

type FocusAction =
  | { type: 'SET_ATTRIBUTE'; pilar: keyof FocusState; payload: { name: string; level: number } }
  | { type: 'SET_SKILL'; pilar: keyof FocusState; payload: { name: string; level: number } }
  | { type: 'SET_MODULAR'; pilar: keyof FocusState; payload: { name: string; level: number } }
  | { type: 'INCREMENT_SPENT'; pilar: keyof FocusState }
  | { type: 'DECREMENT_SPENT'; pilar: keyof FocusState };


function focusReducer(state: FocusState, action: FocusAction): FocusState {
  const { pilar } = action;
  switch (action.type) {
    case 'SET_ATTRIBUTE': {
        const { payload } = action;
        const currentLevel = state[pilar].attributes[payload.name];
        const newLevel = currentLevel === payload.level ? payload.level -1 : payload.level;
        return {
            ...state,
            [pilar]: {
                ...state[pilar],
                attributes: { ...state[pilar].attributes, [payload.name]: Math.max(0, newLevel) },
            },
        };
    }
    case 'SET_SKILL': {
        const { payload } = action;
        return {
            ...state,
            [pilar]: {
                ...state[pilar],
                skills: { ...state[pilar].skills, [payload.name]: payload.level },
            },
        };
    }
    case 'SET_MODULAR': {
        const { payload } = action;
        return {
            ...state,
            [pilar]: {
                ...state[pilar],
                modular: { ...state[pilar].modular, [payload.name]: payload.level },
            },
        };
    }
    case 'INCREMENT_SPENT': {
      return {
        ...state,
        [pilar]: { ...state[pilar], spentPoints: state[pilar].spentPoints + 1 },
      };
    }
    case 'DECREMENT_SPENT': {
      return {
        ...state,
        [pilar]: { ...state[pilar], spentPoints: Math.max(0, state[pilar].spentPoints - 1) },
      };
    }
    default:
      return state;
  }
}


const FocusBranch = ({ focusData, title, pilar, icon, state, dispatch }: { 
    focusData: any, 
    title: string, 
    pilar: 'físico' | 'mental' | 'social', 
    icon: React.ElementType,
    state: FocusPilarState,
    dispatch: React.Dispatch<FocusAction>
}) => {
    const handleAttributeChange = (pilar: 'físico' | 'mental' | 'social', name: string, newLevel: number) => {
        dispatch({ type: 'SET_ATTRIBUTE', pilar, payload: { name, level: newLevel } });
    };
    
    const handleSkillChange = (pilar: 'físico' | 'mental' | 'social', name: string, newLevel: number) => {
        dispatch({ type: 'SET_SKILL', pilar, payload: { name, level: newLevel } });
    };

    const handleModularChange = (pilar: 'físico' | 'mental' | 'social', name: string, newLevel: number) => {
        dispatch({ type: 'SET_MODULAR', pilar, payload: { name, level: newLevel } });
    };

    const modularSkills = focusData.treinamentos || focusData.ciencias || focusData.artes;
    const modularSkillsTitle = pilar === 'físico' ? 'Treinamentos' : pilar === 'mental' ? 'Ciências' : 'Artes';

    const resource = focusData.vigor || focusData.focus || focusData.grace;
    
    const maxResource = Object.values(state.attributes).reduce((sum: number, level: any) => sum + level, 0);
    const currentResourceValue = maxResource - state.spentPoints;

    const pilarColorClasses = {
        físico: { text: 'text-orange-500', bg: 'bg-orange-500' },
        mental: { text: 'text-blue-500', bg: 'bg-blue-500' },
        social: { text: 'text-green-500', bg: 'bg-green-500' },
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <div className="md:col-span-1">
                <FocusHeaderCard 
                    title={title} 
                    icon={icon} 
                    resourceName={resource.name}
                    current={currentResourceValue}
                    max={maxResource}
                    spentPoints={state.spentPoints} 
                    dispatch={dispatch} 
                    pilar={pilar}
                />
            </div>
            
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base'>Atributos</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 divide-y divide-border'>
                        {Object.entries(state.attributes).map(([name, level]) => (
                             <AttributeItem 
                                key={name} 
                                name={name} 
                                level={level}
                                colorClass={pilarColorClasses[pilar].text}
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
                        {Object.entries(state.skills).map(([name, level]) => (
                            <SkillItem 
                                key={name} 
                                name={name} 
                                initialValue={level} 
                                pilar={pilar} 
                                colorClass={pilarColorClasses[pilar].bg}
                                onLevelChange={handleSkillChange} 
                            />
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
                            {Object.entries(state.modular).map(([name, level]) => (
                                <SkillItem 
                                    key={name} 
                                    name={name} 
                                    initialValue={level} 
                                    pilar={pilar} 
                                    colorClass={pilarColorClasses[pilar].bg}
                                    onLevelChange={handleModularChange}
                                />
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
                                    <HeartCrack className="h-6 w-6 text-muted-foreground/50" />
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

const iconMapInventory = {
    'Armadura': <Shield />,
    'Arma': <Swords />,
    'Acessório': <Gem />,
    'Projétil': <MoveUpRight />,
    'Item': <Info />
};

const InventoryItemCard = ({ item }: { item: any }) => {
    const { openItem, isItemOpen } = useMovableWindow();

    const getItemType = (item: any): keyof typeof iconMapInventory => {
        if ('slashing' in item) return 'Armadura';
        if ('swing' in item || 'thrust' in item) return 'Arma';
        if ('typeAndDescription' in item) return 'Acessório';
        if ('ap' in item && 'accuracy' in item) return 'Projétil';
        return 'Item';
    }

    const type = getItemType(item);
    const isOpen = isItemOpen(item.name);

    const handleOpen = () => {
        if (!item.equippable) return;
        let content;
        if (type === 'Armadura') content = <ArmorCardDetails armor={item as Armor} />;
        else if (type === 'Arma') content = <WeaponCardDetails weapon={item as Weapon} />;
        else if (type === 'Acessório') content = <AccessoryCardDetails accessory={item as Accessory} />;
        else return;

        openItem({ id: item.name, title: item.name, content });
    };
    
    return (
        <Card 
            className={cn("cursor-pointer transition-all hover:shadow-md", isOpen && "border-primary shadow-lg", !item.equippable && "cursor-default hover:shadow-none")}
            onClick={item.equippable ? handleOpen : undefined}
        >
            <CardContent className="p-3 flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <span className={cn("text-accent", isOpen && "text-primary")}>
                         {iconMapInventory[type]}
                    </span>
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{type} {item.quantity > 1 && `(x${item.quantity})`}</p>
                    </div>
                </div>

                {item.equippable && !item.equipped ? (
                    <Button variant="outline" size="sm">
                        <MoveUpRight className="mr-2 h-4 w-4" />
                        Equipar
                    </Button>
                ) : !item.equippable && (
                    <div className='text-right'>
                        <p className='font-mono text-sm'>{item.weight.toFixed(2)}kg</p>
                        <p className='text-xs text-muted-foreground'>Total: {(item.weight * item.quantity).toFixed(2)}kg</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


const EquippedSection = ({ equipment }: { equipment: Character['equipment'] }) => {
    const { openAllEquipped } = useMovableWindow();

    const equippedItems = [
        ...equipment.armors.filter(i => i.equipped),
        ...equipment.weapons.filter(i => i.equipped),
        ...equipment.accessories.filter(i => i.equipped),
    ];

    const handleOpenAll = () => {
        const allEquippedItems = [
            ...equipment.armors.filter(i => i.equipped).map(item => ({ id: item.name, title: item.name, content: <ArmorCardDetails armor={item} /> })),
            ...equipment.weapons.filter(i => i.equipped).map(item => ({ id: item.name, title: item.name, content: <WeaponCardDetails weapon={item} /> })),
            ...equipment.accessories.filter(i => i.equipped).map(item => ({ id: item.name, title: item.name, content: <AccessoryCardDetails accessory={item} /> })),
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {equippedItems.length > 0 ? equippedItems.map(item => <InventoryItemCard key={item.name} item={item} />) : <p className="text-xs text-center text-muted-foreground col-span-3 py-4">Nenhum item equipado.</p>}
            </CardContent>
        </Card>
    );
}

const InventorySection = ({ equipment, inventory }: { equipment: Character['equipment'], inventory: Character['inventory'] }) => {
    
    const unequippedItems = [
        ...equipment.armors.filter(i => !i.equipped).map(i => ({...i, quantity: 1, equippable: true})),
        ...equipment.weapons.filter(i => !i.equipped).map(i => ({...i, quantity: 1, equippable: true})),
        ...equipment.accessories.filter(i => !i.equipped).map(i => ({...i, quantity: 1, equippable: true})),
        ...equipment.projectiles.map(i => ({...i, equippable: false})),
        ...inventory.bag.map(i => ({...i, equippable: false})),
    ];
    
    const totalWeight = unequippedItems.reduce((acc, item) => acc + (item.weight * (item.quantity || 1)), 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-baseline">
                    <CardTitle>Inventário</CardTitle>
                    <p className="font-mono text-muted-foreground flex items-center gap-2 text-sm"><Info className="h-4 w-4"/> {totalWeight.toFixed(2)}kg</p>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {unequippedItems.map(item => (
                    <InventoryItemCard key={item.name} item={item} />
                ))}
            </CardContent>
        </Card>
    );
}

const reduceArrayToState = (arr: {name: string, value: number}[]) => arr.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {});

export function CharacterSheet() {
    const [character, setCharacter] = useState<Character>(() => {
        const charImage = PlaceHolderImages.find(p => p.id === 'character-dahl');
        const typedData = initialCharacterData as unknown as Character;
        if (charImage) {
            typedData.info.imageUrl = charImage.imageUrl;
        }
        return typedData;
    });

    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    
    const initialFocusState: FocusState = {
        fisico: {
            attributes: reduceArrayToState(character.focus.physical.attributes),
            skills: reduceArrayToState(character.focus.physical.skills),
            modular: reduceArrayToState(character.focus.physical.treinamentos),
            spentPoints: 0,
        },
        mental: {
            attributes: reduceArrayToState(character.focus.mental.attributes),
            skills: reduceArrayToState(character.focus.mental.skills),
            modular: reduceArrayToState(character.focus.mental.ciencias),
            spentPoints: 0,
        },
        social: {
            attributes: reduceArrayToState(character.focus.social.attributes),
            skills: reduceArrayToState(character.focus.social.skills),
            modular: reduceArrayToState(character.focus.social.artes),
            spentPoints: 0,
        },
    };
    const [focusState, focusDispatch] = useReducer(focusReducer, initialFocusState);


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
    
    const spiritBooks = [
        ...character.spirit.personality,
        character.soul.anima.fluxo,
        character.soul.anima.patrono
    ];

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
                           {character.soul.domains.map(d => {
                                const Icon = iconMap[d.icon];
                                return (
                                <TooltipProvider key={d.name}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="relative">
                                                <Book
                                                    icon={Icon}
                                                    colorHsl={d.color}
                                                    isClickable={false}
                                                    showLabel={false}
                                                    label={d.name}
                                                    isActive={d.level > 0}
                                                />
                                                {d.level > 0 && (
                                                    <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center pointer-events-none">
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
                           )})}
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
                    <CardContent className="space-y-6 flex justify-center items-end gap-2">
                         {spiritBooks.map(p => {
                            const Icon = iconMap[p.icon as keyof typeof iconMap];
                            return (
                                <TooltipProvider key={p.name}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="relative">
                                                <Book
                                                    icon={Icon}
                                                    colorHsl={p.colorHsl}
                                                    isClickable={false}
                                                    showLabel={false}
                                                    label={p.name}
                                                    isActive={p.value > 0}
                                                />
                                                {p.value > 0 && (
                                                    <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center pointer-events-none">
                                                        <span className="text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                            {p.value}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className='font-bold'>{p.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )})}
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
                            <FocusBranch focusData={character.focus.physical} title='Físico' pilar='físico' icon={PersonStanding} state={focusState.fisico} dispatch={focusDispatch} />
                        </TabsContent>
                        <TabsContent value="mental" className='pt-6'>
                            <FocusBranch focusData={character.focus.mental} title='Mental' pilar='mental' icon={BrainCircuit} state={focusState.mental} dispatch={focusDispatch} />
                        </TabsContent>
                        <TabsContent value="social" className='pt-6'>
                            <FocusBranch focusData={character.focus.social} title='Social' pilar='social' icon={Users} state={focusState.social} dispatch={focusDispatch} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
             
            <EquippedSection equipment={character.equipment} />
            <InventorySection equipment={character.equipment} inventory={character.inventory} />
        </div>
    );
}
