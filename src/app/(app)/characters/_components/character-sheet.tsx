'use client';

import { useState, useEffect } from 'react';
import { characterData as initialCharacterData, Character, Armor, Weapon, Accessory, Projectile, BagItem } from '@/lib/character-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, HeartCrack, Info, Shield, Swords, Gem, Backpack, ArrowRight, Shirt, PersonStanding, BrainCircuit, Users, PlusCircle, Plus, Minus, ChevronDown, Weight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMovableWindow } from '@/context/movable-window-context';


const FocusHeaderCard = ({ title, icon: Icon, resource }: { title: string, icon: React.ElementType, resource: { name: string, value: number, max: number }}) => (
    <Card className='glassmorphic-card'>
        <CardHeader>
            <CardTitle className='flex items-center justify-between font-headline text-2xl magical-glow'>
                {title}
                <Icon className='w-8 h-8' />
            </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
            <div className="flex items-baseline justify-between">
                <p className='font-bold text-lg'>{resource.name}</p>
                <p className='font-mono text-lg'>{resource.value} / {resource.max}</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-muted-foreground">
                <p className='font-bold text-lg text-accent'>1</p>
                <p>Gasto</p>
            </div>
        </CardContent>
    </Card>
);

const getEffectClasses = (level: number, type: 'attribute' | 'skill') => {
    const classes: string[] = [];
    let glowLevel = 0;

    if (type === 'attribute') {
        if (level >= 5) {
            if (level >= 15) classes.push('shaking-4');
            else if (level >= 11) classes.push('shaking-3');
            else if (level >= 8) classes.push('shaking-2');
            else classes.push('shaking-1');
        }
        if (level >= 10) {
            classes.push('pulsing');
        }
        if (level >= 5) {
            if (level >= 14) glowLevel = (level === 14) ? 6 : 7;
            else glowLevel = Math.ceil((level - 4) / 2);
        }
    } else { // skill
        if (level >= 7) {
            classes.push('shaking');
        }
        if (level >= 5) {
            classes.push('pulsing');
            if (level === 5) classes.push('pulsing-1');
            else if (level === 6) classes.push('pulsing-2');
            else if (level === 7) classes.push('pulsing-3');
        }
        if (level >= 3) {
            glowLevel = level - 2;
        }
    }

    return {
        animationClasses: classes.join(' '),
        glowLevel: glowLevel
    };
};

const AttributeItem = ({ name, initialValue, pilar }: { name: string; initialValue: number, pilar: 'fisico' | 'mental' | 'social' }) => {
    const [level, setLevel] = useState(initialValue);
    const { animationClasses, glowLevel } = getEffectClasses(level, 'attribute');

    const handleLevelChange = (amount: number) => {
        setLevel(prev => Math.max(0, Math.min(15, prev + amount)));
    }

    return (
        <div className="item-lista">
            <div className="item-header">
                <span className="nome">{name}</span>
                <div className="custos-wrapper">
                    <div className="custo-display">Gasto<b>0</b></div>
                    <div className="custo-display">Próximo<b>-</b></div>
                </div>
            </div>
            <div className="item-control">
                <div className="stepper-container">
                    <button className="stepper-btn" onClick={() => handleLevelChange(-1)}><Minus size={16}/></button>
                    <span 
                        className={cn('stepper-value', `pilar-${pilar}`, animationClasses)}
                        data-glow-level={glowLevel}
                        style={{ '--glow-color': `var(--cor-${pilar})`, '--glow-pulse-distance': `${15 + (level - 10) * 8}px` } as React.CSSProperties}
                    >
                        {level}
                    </span>
                    <button className="stepper-btn" onClick={() => handleLevelChange(1)}><Plus size={16}/></button>
                </div>
            </div>
        </div>
    );
};

const SkillItem = ({ name, initialValue, pilar }: { name: string; initialValue: number, pilar: 'fisico' | 'mental' | 'social' }) => {
    const [level, setLevel] = useState(initialValue);
    const [animationDelays, setAnimationDelays] = useState<string[]>([]);
    const { animationClasses, glowLevel } = getEffectClasses(level, 'skill');
    
    useEffect(() => {
        const delays = Array.from({ length: 7 }, () => `-${Math.random() * 2.5}s`);
        setAnimationDelays(delays);
    }, []);


    const handleDotClick = (newLevel: number) => {
        setLevel(currentLevel => {
            const finalLevel = newLevel === currentLevel ? newLevel - 1 : newLevel;
            return Math.max(0, finalLevel);
        });
    };

    return (
         <div className="item-lista">
            <div className="item-header">
                <span className="nome">{name}</span>
                <div className="custos-wrapper">
                    <div className="custo-display">Gasto<b>0</b></div>
                    <div className="custo-display">Próximo<b>-</b></div>
                </div>
            </div>
            <div className="item-control">
                <div 
                    className={cn('dots-container', `pilar-${pilar}`, animationClasses)}
                    data-glow-level={glowLevel}
                    style={{ '--pulse-color': `var(--cor-${pilar})` } as React.CSSProperties}
                >
                    {[...Array(7)].map((_, i) => (
                        <span
                            key={i}
                            className={cn('dot', { 'selected': i < level })}
                            data-level={i + 1}
                            onClick={() => handleDotClick(i + 1)}
                            style={{ animationDelay: animationDelays[i] }}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const FocusSection = ({ focusData, title, pilar, icon }: { focusData: Character['focus']['physical'], title: string, pilar: 'fisico' | 'mental' | 'social', icon: React.ElementType }) => {
    const pilarClass = `pilar-${pilar.toLowerCase()}`;
    return (
        <div className={`grid grid-cols-1 gap-6 ${pilarClass}`}>
            <FocusHeaderCard title={title} icon={icon} resource={focusData.vigor || focusData.focus || focusData.grace} />
            
            <Card className='sub-painel'>
                <CardHeader>
                    <h4 className='font-headline text-lg'>Atributos</h4>
                </CardHeader>
                <CardContent className='atributos-grid-interno'>
                    {focusData.attributes.map(attr => (
                        <AttributeItem key={attr.name} name={attr.name} initialValue={attr.value} pilar={pilar} />
                    ))}
                </CardContent>
            </Card>

            <Card className='sub-painel'>
                 <CardHeader>
                    <h4 className='font-headline text-lg'>Perícias</h4>
                </CardHeader>
                <CardContent className='pericias-lista'>
                    {focusData.skills.map(skill => (
                        <SkillItem key={skill.name} name={skill.name} initialValue={skill.value} pilar={pilar} />
                    ))}
                </CardContent>
            </Card>
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
                                    <HeartCrack className="h-6 w-6 text-red-500 animate-in fade-in" style={{ filter: 'drop-shadow(0 0 3px #ef4444)'}} />
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
            <div className='space-y-1'><Label>Cortante</Label><p className='font-mono'>{armor.slashing}</p></div>
            <div className='space-y-1'><Label>Esmagamento</Label><p className='font-mono'>{armor.bludgeoning}</p></div>
            <div className='space-y-1'><Label>Perfurante</Label><p className='font-mono'>{armor.piercing}</p></div>
        </div>
        <div className='grid grid-cols-3 gap-2 text-center'>
            <div className='space-y-1'><Label>Resistência</Label><p className='font-mono'>{armor.resistance}</p></div>
            <div className='space-y-1'><Label>Durabilidade</Label><p className='font-mono'>{armor.durability}</p></div>
            <div className='spacey-1'><Label>Peso</Label><p className='font-mono'>{armor.weight}kg</p></div>
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
                    <div><Label>Dano</Label><p>{weapon.thrust.damage}</p></div>
                    <div><Label>Tipo</Label><p>{weapon.thrust.type}</p></div>
                    <div><Label>AP</Label><p>{weapon.thrust.ap}</p></div>
                    <div><Label>Precisão</Label><p>{weapon.thrust.accuracy}</p></div>
                </div>
            </div>
        )}
        {weapon.swing && (
            <div>
                <h4 className='font-semibold text-accent mb-2'>Swing</h4>
                <div className='grid grid-cols-4 gap-2 text-center text-sm'>
                    <div><Label>Dano</Label><p>{weapon.swing.damage}</p></div>
                    <div><Label>Tipo</Label><p>{weapon.swing.type}</p></div>
                    <div><Label>AP</Label><p>{weapon.swing.ap}</p></div>
                    <div><Label>Precisão</Label><p>{weapon.swing.accuracy}</p></div>
                </div>
            </div>
        )}
        <div className='grid grid-cols-2 gap-2 text-center pt-2 border-t border-border'>
            <div className='space-y-1'><Label>Peso</Label><p className='font-mono'>{weapon.weight}kg</p></div>
            <div className='space-y-1'><Label>Tamanho</Label><p className='font-mono uppercase'>{weapon.size}</p></div>
        </div>
    </div>
);

const AccessoryCardDetails = ({ accessory }: { accessory: Accessory }) => (
    <div className='space-y-4 pt-4'>
        <p className="text-sm text-muted-foreground">{accessory.typeAndDescription}</p>
        <Separator/>
        <div className='grid grid-cols-2 gap-2 text-center'>
            <div className='space-y-1'><Label>Peso</Label><p className='font-mono'>{accessory.weight}kg</p></div>
            <div className='space-y-1'><Label>Efeito</Label><p className='font-mono'>{accessory.effect}</p></div>
        </div>
    </div>
);

const EquippedItemCard = ({ item, type }: { item: Armor | Weapon | Accessory, type: 'armor' | 'weapon' | 'accessory' }) => {
    const { openWindow } = useMovableWindow();

    const iconMap = {
        armor: <Shield />,
        weapon: <Swords />,
        accessory: <Gem />
    };

    const handleOpen = () => {
        let content;
        if (type === 'armor') {
            content = <ArmorCardDetails armor={item as Armor} />;
        } else if (type === 'weapon') {
            content = <WeaponCardDetails weapon={item as Weapon} />;
        } else {
            content = <AccessoryCardDetails accessory={item as Accessory} />;
        }
        openWindow(item.name, content);
    };

    return (
        <Button
            variant="outline"
            className="w-full justify-start h-auto p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
            onClick={handleOpen}
        >
            <div className="flex items-center gap-3">
                <span className="text-accent">{iconMap[type]}</span>
                <p className="text-base font-semibold">{item.name}</p>
            </div>
        </Button>
    );
};


const EquippedSection = ({ equipment }: { equipment: Character['equipment'] }) => {
    const equippedArmors = equipment.armors.filter(i => i.equipped);
    const equippedWeapons = equipment.weapons.filter(i => i.equipped);
    const equippedAccessories = equipment.accessories.filter(i => i.equipped);

    return (
        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle className='font-headline text-2xl magical-glow text-center'>Equipamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <h3 className="font-headline text-lg text-center">Armaduras</h3>
                    {equippedArmors.length > 0 ? equippedArmors.map(item => <EquippedItemCard key={item.name} item={item} type="armor" />) : <p className="text-xs text-center text-muted-foreground">Nenhuma armadura equipada.</p>}
                </div>
                 <div className="space-y-3">
                    <h3 className="font-headline text-lg text-center">Armas</h3>
                    {equippedWeapons.length > 0 ? equippedWeapons.map(item => <EquippedItemCard key={item.name} item={item} type="weapon" />) : <p className="text-xs text-center text-muted-foreground">Nenhuma arma equipada.</p>}
                </div>
                 <div className="space-y-3">
                    <h3 className="font-headline text-lg text-center">Acessórios</h3>
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
        <Card className="glassmorphic-card">
            <CardHeader>
                <div className="flex justify-between items-baseline">
                    <CardTitle className='font-headline text-2xl magical-glow'>Inventário</CardTitle>
                    <p className="font-mono text-muted-foreground flex items-center gap-2"><Weight className="h-4 w-4"/> {totalWeight.toFixed(2)}kg</p>
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
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-muted-foreground">{item.type}</TableCell>
                                <TableCell className='text-center'>{item.quantity}</TableCell>
                                <TableCell className='text-right font-mono'>{(item.weight * item.quantity).toFixed(2)}kg</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export function CharacterSheet() {
    const [character, setCharacter] = useState<Character>(initialCharacterData);

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in-up">
            {/* HEADER */}
            <header className="flex justify-between items-baseline border-b-2 border-primary/20 pb-4">
                <h1 className="font-headline text-5xl font-bold magical-glow">{character.name}</h1>
                <p className="text-xl text-muted-foreground italic">&quot;{character.concept}&quot;</p>
            </header>

            {/* FOCUS PANEL */}
            <section>
                <Card className='glassmorphic-card'>
                    <CardHeader>
                        <CardTitle className='font-headline text-3xl magical-glow text-center'>FOCOS</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Tabs defaultValue="physical">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="physical"><PersonStanding className='mr-2'/>Físico</TabsTrigger>
                                <TabsTrigger value="mental"><BrainCircuit className='mr-2'/>Mental</TabsTrigger>
                                <TabsTrigger value="social"><Users className='mr-2'/>Social</TabsTrigger>
                            </TabsList>
                            <TabsContent value="physical" className='mt-4'>
                                <FocusSection focusData={character.focus.physical} title='FÍSICO' pilar='fisico' icon={PersonStanding} />
                            </TabsContent>
                             <TabsContent value="mental" className='mt-4'>
                                <FocusSection focusData={character.focus.mental} title='MENTAL' pilar='mental' icon={BrainCircuit} />
                            </TabsContent>
                             <TabsContent value="social" className='mt-4'>
                                <FocusSection focusData={character.focus.social} title='SOCIAL' pilar='social' icon={Users} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </section>

             {/* SOUL & SPIRIT PANEL */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SPIRIT */}
                <Card className="glassmorphic-card">
                    <CardHeader><CardTitle className="font-headline text-2xl magical-glow text-center">ESPÍRITO</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className='font-semibold text-center text-muted-foreground'>Personalidade</h3>
                             {character.spirit.personality.map(p => (
                                <div key={p.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <Label>{p.name}</Label>
                                        <span className="font-mono">{p.value}</span>
                                    </div>
                                    <Slider defaultValue={[p.value]} max={10} step={1} />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className='font-semibold text-center text-muted-foreground'>Alinhamento</h3>
                            {character.spirit.alignment.map(a => (
                                <div key={a.name} className="space-y-2">
                                     <div className="flex justify-between items-center text-sm mb-1">
                                        <span className='font-semibold text-left'>{a.poles[0]}</span>
                                        <Label className='font-bold'>{a.name}</Label>
                                        <span className='font-semibold text-right'>{a.poles[1]}</span>
                                    </div>
                                    <Slider defaultValue={[a.value]} min={-5} max={5} step={1} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* SOUL */}
                <Card className="glassmorphic-card">
                     <CardHeader><CardTitle className="font-headline text-2xl magical-glow text-center">ALMA</CardTitle></CardHeader>
                     <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="space-y-1">
                                <Label className="flex items-center justify-center gap-1">
                                    Fluxo
                                    <TooltipProvider><Tooltip><TooltipTrigger><Info className='h-3 w-3'/></TooltipTrigger><TooltipContent><p>Energia cósmica que permeia tudo.</p></TooltipContent></Tooltip></TooltipProvider>
                                </Label>
                                <p className="text-3xl font-bold">{character.soul.anima.flow}</p>
                            </div>
                             <div className="space-y-1">
                                <Label className="flex items-center justify-center gap-1">
                                    Patrono
                                    <TooltipProvider><Tooltip><TooltipTrigger><Info className='h-3 w-3'/></TooltipTrigger><TooltipContent><p>Vínculo com uma entidade poderosa.</p></TooltipContent></Tooltip></TooltipProvider>
                                </Label>
                                <p className="text-3xl font-bold">{character.soul.anima.patron}</p>
                            </div>
                        </div>
                        <Separator/>
                         <div className="space-y-2">
                            <h3 className='font-semibold text-center text-muted-foreground'>Domínios</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                {character.soul.domains.map(d => (
                                    <div key={d.name} className="flex justify-between items-center">
                                        <Label>{d.name}</Label>
                                        <span className='font-mono font-bold text-primary'>{'●'.repeat(d.level)}{'○'.repeat(5-d.level)}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                        <Separator/>
                        <div className="space-y-3">
                             <h3 className='font-semibold text-center text-muted-foreground flex items-center justify-center gap-1'>
                                Rachaduras
                                 <TooltipProvider><Tooltip><TooltipTrigger><Info className='h-3 w-3'/></TooltipTrigger><TooltipContent><p>Corrupção da alma pelo uso indevido de poder.</p></TooltipContent></Tooltip></TooltipProvider>
                            </h3>
                            <div className="flex justify-center">
                                <SoulCracks value={character.soul.cracks} />
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </section>
             <section>
                <EquippedSection equipment={character.equipment} />
            </section>
             <section>
                <InventorySection equipment={character.equipment} inventory={character.inventory} />
            </section>
        </div>
    );
}

    
