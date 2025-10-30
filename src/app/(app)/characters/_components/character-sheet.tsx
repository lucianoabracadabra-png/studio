'use client';

import React, { useState, useReducer, useMemo, useEffect } from 'react';
import initialCharacterData from '@/lib/character-data.json';
import { itemDatabase } from '@/lib/character-data';
import type { Character, Armor, Weapon, Accessory, HealthState, CharacterItem, ItemOwnership } from '@/lib/character-data';
import { getNextAlignmentState, iconMap } from '@/lib/character-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, HeartCrack, Info, Shield, Swords, Gem, BookOpen, PersonStanding, BrainCircuit, Users, ChevronDown, Plus, Minus, MoveUpRight, Anchor, Leaf } from 'lucide-react';
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
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const FocusHeaderCard = ({ title, icon, resourceName, current, max, spentPoints, dispatch, pilar }: { title: string, icon: React.ElementType, resourceName: string, current: number, max: number, spentPoints: number, dispatch: React.Dispatch<any>, pilar: 'fisico' | 'mental' | 'social' }) => {
    
    const handleDecrement = () => {
        dispatch({ type: 'DECREMENT_SPENT', pilar: pilar });
    };
    
    const handleIncrement = () => {
        dispatch({ type: 'INCREMENT_SPENT', pilar: pilar });
    };
    
    return (
        <Card>
            <CardContent className='pt-6 space-y-2'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold text-xl'>{title}</h3>
                    <span style={{ color: 'var(--focus-color)' }}>{React.createElement(icon)}</span>
                </div>
                <Separator />
                <div className='grid grid-cols-2 gap-x-4 items-center text-sm'>
                    <div>
                        <p className='font-bold'>{resourceName}</p>
                        <p className='font-mono font-bold text-lg' style={{ color: 'var(--focus-color)' }}>{current} / {max}</p>
                    </div>
                    <div>
                        <p className='text-muted-foreground'>Gasto:</p>
                        <div className='flex items-center gap-2'>
                             <Button variant='outline' size='icon' className='h-6 w-6 hover:text-white' style={{ '--button-hover-bg': 'var(--focus-color)' } as React.CSSProperties} onClick={handleDecrement}><Minus className='h-4 w-4'/></Button>
                             <span className='font-mono text-lg text-center w-6'>{spentPoints}</span>
                             <Button variant='outline' size='icon' className='h-6 w-6 hover:text-white' style={{ '--button-hover-bg': 'var(--focus-color)' } as React.CSSProperties} onClick={handleIncrement}><Plus className='h-4 w-4'/></Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AttributeItem = ({ name, level }: { name: string; level: number }) => {
    return (
        <div className="flex items-center gap-3">
             <div className={cn("w-8 h-8 flex items-center justify-center rounded-md font-bold text-lg text-primary-foreground")} style={{ backgroundColor: 'var(--focus-color)' }}>
                {level}
            </div>
            <span className="text-foreground font-medium">{name}</span>
        </div>
    );
};


const SkillItem = ({ name, value }: { name: string; value: number }) => {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-foreground">{name}</span>
            <div className='flex gap-1.5 items-center'>
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className={cn('w-3 h-3 bg-muted rounded-sm transform rotate-45', { 'bg-[var(--focus-color)]': i < value })}
                        style={i < value ? { backgroundColor: 'var(--focus-color)' } : {}}
                    />
                ))}
            </div>
        </div>
    );
};


const FocusBranch = ({ focusData, title, pilar, icon, state, dispatch, colorHsl }: { 
    focusData: any, 
    title: string, 
    pilar: 'fisico' | 'mental' | 'social', 
    icon: React.ElementType,
    state: any,
    dispatch: React.Dispatch<any>,
    colorHsl: string
}) => {

    const modularSkills = focusData.treinamentos || focusData.ciencias || focusData.artes;
    const modularSkillsTitle = pilar === 'fisico' ? 'Treinamentos' : pilar === 'mental' ? 'Ciências' : 'Artes';

    const resource = focusData.vigor || focusData.focus || focusData.grace;
    
    const maxResource = Object.values(state.attributes).reduce((sum: number, level: any) => sum + level, 0);
    const currentResourceValue = maxResource - state.spentPoints;

    return (
        <div 
            className={`grid grid-cols-1 md:grid-cols-2 gap-4`} 
            style={{ 
                '--focus-color-hsl': colorHsl, 
                '--focus-color': `hsl(${colorHsl})`,
            } as React.CSSProperties}
        >
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
                        <CardTitle className='text-base' style={{ color: 'var(--focus-color)' }}>Atributos</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-2 gap-x-4 gap-y-3'>
                        {Object.entries(state.attributes).map(([name, level]) => (
                             <AttributeItem 
                                key={name} 
                                name={name} 
                                level={level as number}
                             />
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
                        <div className='md:grid md:grid-cols-2 md:gap-x-4 divide-y divide-border'>
                            {Object.entries(state.skills).map(([name, value]) => (
                                <SkillItem 
                                    key={name} 
                                    name={name} 
                                    value={value as number}
                                />
                            ))}
                        </div>
                        
                        {modularSkills && (
                            <>
                                
                                <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-4">{modularSkillsTitle}</h4>
                                <div className='md:grid md:grid-cols-2 md:gap-x-4 divide-y divide-border'>
                                    {Object.entries(state.modular).map(([name, value]) => (
                                        <SkillItem 
                                            key={name} 
                                            name={name} 
                                            value={value as number}
                                        />
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

const SoulCracks = ({ value, onToggle }: { value: number; onToggle: (index: number) => void; }) => {
    return (
        <div className="flex items-center gap-2">
            {[...Array(10)].map((_, i) => {
                const isCracked = i < value;
                return (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => onToggle(i)}>
                                    {isCracked ? (
                                         <Heart className={cn(
                                            "h-6 w-6 transition-all text-red-500 drop-shadow-[0_0_3px_hsl(var(--destructive))]"
                                        )} />
                                    ) : (
                                        <HeartCrack className="h-6 w-6 text-muted-foreground/30" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isCracked ? <p>Rachadura #{i + 1} (Ativa)</p> : <p>Rachadura #{i + 1}</p>}
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

const SortableInventoryItem = ({ item }: { item: CharacterItem }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id: item.id,
        disabled: !item.equippable
    });
    const { openItem, isItemOpen } = useMovableWindow();

    const type = item.type;
    const isOpen = isItemOpen(item.id);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    const handleOpen = () => {
        if (!item.equippable) return;
        let content;
        if (type === 'Armadura') content = <ArmorCardDetails armor={item as Armor} />;
        else if (type === 'Arma') content = <WeaponCardDetails weapon={item as Weapon} />;
        else if (type === 'Acessório') content = <AccessoryCardDetails accessory={item as Accessory} />;
        else return;

        openItem({ id: item.id, title: item.name, content });
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card 
                className={cn(
                    "transition-all", 
                    isOpen && "shadow-lg",
                    isDragging && "shadow-xl",
                    item.equippable
                        ? "cursor-grab hover:shadow-md"
                        : "cursor-default"
                )}
                onClick={item.equippable ? handleOpen : undefined}
            >
                <CardContent className="p-3 flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <span className={cn("text-accent", isOpen && "text-primary")}>
                            {iconMapInventory[type]}
                        </span>
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{type} {item.quantity && item.quantity > 1 && `(x${item.quantity})`}</p>
                        </div>
                    </div>

                    {!item.equippable && (
                        <div className='text-right'>
                            <p className='font-mono text-sm'>{item.weight.toFixed(2)}kg</p>
                            {item.quantity && item.quantity > 1 && <p className='text-xs text-muted-foreground'>Total: {(item.weight * item.quantity).toFixed(2)}kg</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};


const EquippedSection = ({ items }: { items: CharacterItem[] }) => {
    const { openAllEquipped } = useMovableWindow();
    
    const handleOpenAll = () => {
        const allEquippedItems = items.map(item => {
            let content;
            const type = item.type;
            if (type === 'Armadura') content = <ArmorCardDetails armor={item as Armor} />;
            else if (type === 'Arma') content = <WeaponCardDetails weapon={item as Weapon} />;
            else if (type === 'Acessório') content = <AccessoryCardDetails accessory={item as Accessory} />;
            else return null;
            return { id: item.id, title: item.name, content };
        }).filter(Boolean) as { id: string; title: string; content: React.ReactNode; }[];
        openAllEquipped(allEquippedItems);
    };
    
    const itemIds = useMemo(() => items.map(i => i.id), [items]);

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
            <SortableContext id="equipped" items={itemIds} strategy={verticalListSortingStrategy}>
                <CardContent 
                    className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[120px] rounded-b-lg")}
                >
                    {items.length > 0 ? items.map(item => (
                       <SortableInventoryItem key={item.id} item={item} />
                    )) : (
                        <p className="text-xs text-center text-muted-foreground col-span-3 py-4">Nenhum item equipado. Arraste itens do inventário para cá.</p>
                    )}
                </CardContent>
            </SortableContext>
        </Card>
    );
}

const InventorySection = ({ items }: { items: CharacterItem[] }) => {
    const totalWeight = items.reduce((acc, item) => acc + (item.weight * (item.quantity || 1)), 0);
    const itemIds = useMemo(() => items.map(i => i.id), [items]);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-baseline">
                    <CardTitle>Inventário</CardTitle>
                    <p className="font-mono text-muted-foreground flex items-center gap-2 text-sm"><Info className="h-4 w-4"/> {totalWeight.toFixed(2)}kg</p>
                </div>
            </CardHeader>
             <SortableContext id="inventory" items={itemIds} strategy={verticalListSortingStrategy}>
                 <CardContent 
                    className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[120px] rounded-b-lg")}
                >
                    {items.map(item => (
                        <SortableInventoryItem key={item.id} item={item} />
                    ))}
                </CardContent>
            </SortableContext>
        </Card>
    );
}

// Reducer logic
const reduceArrayToState = (arr: {name: string, value: number}[]) => arr.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {});

const hydrateCharacterItems = (itemOwnerships: ItemOwnership[]): CharacterItem[] => {
    return itemOwnerships.map(ownership => {
        const baseItem = itemDatabase.get(ownership.itemId);
        if (!baseItem) {
            console.warn(`Item with id ${ownership.itemId} not found in database.`);
            return null;
        }
        return {
            ...baseItem,
            id: baseItem.id, 
            isEquipped: ownership.equipped,
            quantity: ownership.currentQuantity || baseItem.quantity,
            equippable: !!baseItem.equippable
        };
    }).filter((item): item is CharacterItem => item !== null);
};


const characterReducer = (state: Character, action: any): Character => {
    switch (action.type) {
        case 'SET_HEALTH': {
            const { partId, boxIndex, newState } = action.payload;
            const newBodyParts = { ...state.health.bodyParts };
            const newStates = [...newBodyParts[partId].states];
            newStates[boxIndex] = newState;
            newBodyParts[partId] = { ...newBodyParts[partId], states: newStates };

            return {
                ...state,
                health: { ...state.health, bodyParts: newBodyParts }
            };
        }
        case 'TOGGLE_ALIGNMENT': {
            const { axisName } = action.payload;
            const newAlignment = state.spirit.alignment.map(axis => {
                if (axis.name === axisName) {
                    return { ...axis, state: getNextAlignmentState(axis.state, axis.poles) };
                }
                return axis;
            });
            return { ...state, spirit: { ...state.spirit, alignment: newAlignment } };
        }
        case 'TOGGLE_CRACKS': {
            const { index } = action.payload;
            const currentCracks = state.soul.cracks;
            const newCracks = (index + 1) === currentCracks ? currentCracks - 1 : index + 1;
            return {
                ...state,
                soul: { ...state.soul, cracks: Math.max(0, newCracks) }
            };
        }
        case 'SET_SKILL': {
            const { pilar, name, level } = action.payload;
            const focusPilar = state.focus[pilar as keyof typeof state.focus];
            const newSkills = (focusPilar as any).skills.map((skill: any) => 
                skill.name === name ? { ...skill, value: level } : skill
            );
            return {
                ...state,
                focus: {
                    ...state.focus,
                    [pilar]: { ...focusPilar, skills: newSkills }
                }
            };
        }
        case 'SET_MODULAR': {
            const { pilar, name, level } = action.payload;
            const pilarKey = pilar === 'fisico' ? 'treinamentos' : pilar === 'mental' ? 'ciencias' : 'artes';
            const focusPilar = state.focus[pilar as keyof typeof state.focus];
            const newModulars = ((focusPilar as any)[pilarKey] as any[]).map(mod => 
                mod.name === name ? { ...mod, value: level } : mod
            );
             return {
                ...state,
                focus: {
                    ...state.focus,
                    [pilar]: { ...focusPilar, [pilarKey]: newModulars }
                }
            };
        }
        case 'INCREMENT_SPENT': {
            // Placeholder, not implemented in this reducer for now
            return state;
        }
        case 'DECREMENT_SPENT': {
             // Placeholder, not implemented in this reducer for now
            return state;
        }
        case 'SET_ITEMS': {
            return { ...state, equipment: action.payload };
        }
        default:
            return state;
    }
};

const initialFocusState = (character: Character) => ({
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
});

function focusReducer(state: ReturnType<typeof initialFocusState>, action: any) {
    switch (action.type) {
        case 'SET_SKILL':
        case 'SET_MODULAR': {
            const { pilar, payload } = action;
            const { name, level } = payload;
            const pilarState = state[pilar as keyof typeof state];
            const keyToUpdate = action.type === 'SET_SKILL' ? 'skills' : 'modular';
            
            return {
                ...state,
                [pilar]: {
                    ...pilarState,
                    [keyToUpdate]: {
                        ...pilarState[keyToUpdate as keyof typeof pilarState],
                        [name]: level
                    }
                }
            };
        }
        case 'INCREMENT_SPENT':
            return {
                ...state,
                [action.pilar]: {
                    ...state[action.pilar as keyof typeof state],
                    spentPoints: state[action.pilar as keyof typeof state].spentPoints + 1
                }
            };
        case 'DECREMENT_SPENT':
            return {
                ...state,
                [action.pilar]: {
                    ...state[action.pilar as keyof typeof state],
                    spentPoints: Math.max(0, state[action.pilar as keyof typeof state].spentPoints - 1)
                }
            };
        default:
            return state;
    }
}


export function CharacterSheet() {
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [activeFocusTab, setActiveFocusTab] = useState('physical');
    
    const [character, characterDispatch] = useReducer(characterReducer, initialCharacterData as unknown as Character);
    
    const [characterItems, setCharacterItems] = useState<CharacterItem[]>(() => 
        hydrateCharacterItems(character.equipment)
    );
    
    const [focusState, focusDispatch] = useReducer(focusReducer, initialFocusState(character));

    useEffect(() => {
        focusDispatch({ type: 'RESET_FOCUS', payload: initialFocusState(character) });
    }, [character.focus]);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );


    const handleHealthChange = (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => {
        characterDispatch({ type: 'SET_HEALTH', payload: { partId, boxIndex, newState }});
    };

    const handleAlignmentToggle = (axisName: string) => {
        // Alignment is now read-only
    }

    const handleCracksToggle = (index: number) => {
        characterDispatch({ type: 'TOGGLE_CRACKS', payload: { index }});
    };
    
    const handleSkillChange = (pilar: 'fisico' | 'mental' | 'social', name: string, newLevel: number) => {
        focusDispatch({ type: 'SET_SKILL', pilar, payload: { name, level: newLevel } });
    };

    const handleModularChange = (pilar: 'fisico' | 'mental' | 'social', name: string, newLevel: number) => {
        focusDispatch({ type: 'SET_MODULAR', pilar, payload: { name, level: newLevel } });
    };
    
    function findContainer(id: string | number) {
        if (id === 'equipped' || equippedItems.some(i => i.id === id)) {
            return 'equipped';
        }
        if (id === 'inventory' || inventoryItems.some(i => i.id === id)) {
            return 'inventory';
        }
        return null;
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
    
        if (!over) return;
    
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);
    
        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = characterItems.findIndex((item) => item.id === active.id);
        const overIndex = characterItems.findIndex((item) => item.id === over.id);
        
        if (activeIndex !== overIndex) {
            setCharacterItems((items) => arrayMove(items, activeIndex, overIndex));
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        const activeContainer = findContainer(activeId);
        let overContainer = findContainer(overId);
        
        if (!overContainer) {
             if (overId === 'equipped' || overId === 'inventory') {
                overContainer = overId as string;
            } else {
                return;
            }
        }
    
        if (!activeContainer || activeContainer === overContainer) {
            return;
        }
    
        setCharacterItems(prevItems => {
            const activeIndex = prevItems.findIndex(i => i.id === activeId);
            const overIndex = prevItems.findIndex(i => i.id === overId);
            const newEquippedState = overContainer === 'equipped';

            if(activeIndex === -1) return prevItems;

            const activeItem = prevItems[activeIndex];

            if (newEquippedState && !activeItem.equippable) {
                return prevItems;
            }
            
            // Update item's equipped state
            const updatedItems = [...prevItems];
            updatedItems[activeIndex] = { ...activeItem, isEquipped: newEquippedState };

            // Update underlying character data
             characterDispatch({
                type: 'SET_ITEMS',
                payload: updatedItems.map(item => ({
                    itemId: item.id,
                    equipped: item.isEquipped,
                    currentQuantity: item.quantity
                }))
            });

            // Re-sort the array visually for immediate feedback
            if (overIndex !== -1) {
                 return arrayMove(updatedItems, activeIndex, overIndex);
            }
            return updatedItems;
        });
    }
    
    // Memoized lists for rendering
    const equippedItems = useMemo(() => characterItems.filter(item => item.isEquipped), [characterItems]);
    const inventoryItems = useMemo(() => characterItems.filter(item => !item.isEquipped), [characterItems]);

    const focusColors: Record<string, { hex: string; hsl: string }> = {
        physical: { hex: '#ea4335', hsl: '5 81% 56%' },
        mental: { hex: '#4285f4', hsl: '221 83% 53%' },
        social: { hex: '#34a853', hsl: '142 71% 45%' },
    };

    const focusCardStyle = {
        '--page-accent-color': focusColors[activeFocusTab].hex,
        boxShadow: `0 0 25px rgba(0,0,0,0.4), 0 0 15px ${focusColors[activeFocusTab].hex}99`,
    } as React.CSSProperties;

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
                        <div className="flex justify-center items-end gap-4 pt-2">
                           {character.soul.domains.map(d => {
                                const Icon = iconMap[d.icon as keyof typeof iconMap] || Heart;
                                return (
                                    <Book
                                        key={d.name}
                                        label={d.name}
                                        icon={Icon}
                                        colorHsl={d.color}
                                        level={d.level}
                                        isActive={d.level > 0}
                                        isClickable={true}
                                    />
                               )})}
                        </div>
                        <div className="space-y-3 pt-2">
                            <h3 className='font-semibold text-center text-muted-foreground'>Rachaduras</h3>
                            <div className="flex justify-center">
                                <SoulCracks value={character.soul.cracks} onToggle={handleCracksToggle} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-center">Espírito</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center items-end gap-4 pt-2">
                            {character.spirit.personality.map(p => {
                                const Icon = iconMap[p.icon as keyof typeof iconMap] || Shield;
                                return (
                                    <Book
                                        key={p.name}
                                        label={p.name}
                                        icon={Icon}
                                        colorHsl={p.colorHsl}
                                        isClickable={true}
                                        level={p.value}
                                        isActive={p.value > 0}
                                    />
                                )})}
                        </div>
                         <div className="flex justify-center items-end gap-4 pt-2">
                            {[character.soul.anima.fluxo, character.soul.anima.patrono].map(p => {
                                const Icon = iconMap[p.icon as keyof typeof iconMap] || Heart;
                                return (
                                     <Book
                                        key={p.name}
                                        label={p.name}
                                        icon={Icon}
                                        colorHsl={p.colorHsl}
                                        isClickable={true}
                                        level={p.value}
                                        isActive={p.value > 0}
                                    />
                                )})}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card style={focusCardStyle}>
                <CardHeader>
                    <CardTitle className='text-center'>
                        Focos de Desenvolvimento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="physical" className="w-full" onValueChange={value => setActiveFocusTab(value)}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="physical" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'physical' ? { backgroundColor: 'var(--page-accent-color)' } : {}}>
                                <PersonStanding />Físico
                            </TabsTrigger>
                            <TabsTrigger value="mental" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'mental' ? { backgroundColor: 'var(--page-accent-color)' } : {}}>
                                <BrainCircuit />Mental
                            </TabsTrigger>
                            <TabsTrigger value="social" className='flex items-center gap-2 data-[state=active]:text-white data-[state=active]:border-transparent' style={activeFocusTab === 'social' ? { backgroundColor: 'var(--page-accent-color)' } : {}}>
                                <Users />Social
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="physical" className='pt-6' style={{ '--page-accent-color': focusColors.physical.hex }}>
                            <FocusBranch focusData={character.focus.physical} title='Físico' pilar='fisico' icon={PersonStanding} state={focusState.fisico} dispatch={focusDispatch} colorHsl={focusColors.physical.hsl} />
                        </TabsContent>
                        <TabsContent value="mental" className='pt-6' style={{ '--page-accent-color': focusColors.mental.hex }}>
                            <FocusBranch focusData={character.focus.mental} title='Mental' pilar='mental' icon={BrainCircuit} state={focusState.mental} dispatch={focusDispatch} colorHsl={focusColors.mental.hsl} />
                        </TabsContent>
                        <TabsContent value="social" className='pt-6' style={{ '--page-accent-color': focusColors.social.hex }}>
                            <FocusBranch focusData={character.focus.social} title='Social' pilar='social' icon={Users} state={focusState.social} dispatch={focusDispatch} colorHsl={focusColors.social.hsl} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
             
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <EquippedSection items={equippedItems} />
                <InventorySection items={inventoryItems} />
            </DndContext>
        </div>
    );
}
