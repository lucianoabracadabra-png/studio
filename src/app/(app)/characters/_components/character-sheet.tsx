'use client';

import { useState } from 'react';
import { characterData as initialCharacterData, Character, Armor, Weapon, Accessory, Projectile, BagItem } from '@/lib/character-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, HeartCrack, Info, Shield, Swords, Gem, Backpack, ArrowRight, Shirt, Hand, PersonStanding, Weight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const FocusCard = ({ title, resource, attributes, skills }: { title: string, resource: { name: string, value: number, max: number }, attributes: { name: string, value: number }[], skills: { name: string, value: number }[] }) => {
    return (
        <Card className="glassmorphic-card flex-1">
            <CardHeader>
                <CardTitle className="font-headline text-2xl magical-glow text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label>{resource.name}</Label>
                        <span className="text-sm font-mono">{resource.value}/{resource.max}</span>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Progress value={(resource.value / resource.max) * 100} className="w-full h-3 [&>div]:bg-primary" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{Math.round((resource.value / resource.max) * 100)}%</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    {attributes.map(attr => (
                        <div key={attr.name} className="space-y-1 text-center">
                            <Label>{attr.name}</Label>
                            <Input type="number" value={attr.value} className="text-center font-bold text-lg" readOnly />
                        </div>
                    ))}
                </div>

                <Separator />
                
                <div className='space-y-2'>
                    <h4 className="font-semibold text-center text-muted-foreground">Skills</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {skills.map(skill => (
                             <div key={skill.name} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                <span>{skill.name}</span>
                                <Input type="number" value={skill.value} className="w-16 h-8 text-center" readOnly />
                             </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

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

const ArmorCard = ({ armor }: { armor: Armor }) => (
    <Card className='bg-muted/30'>
        <CardHeader>
            <CardTitle className='flex justify-between items-center'>{armor.name} <Button size="sm" variant={armor.equipped ? 'secondary' : 'outline'}>{armor.equipped ? 'Equipado' : 'Equipar'}</Button></CardTitle>
            <CardDescription>{armor.extras}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
            <div className='grid grid-cols-3 gap-2 text-center'>
                <div className='space-y-1'><Label>Cortante</Label><p className='font-mono'>{armor.slashing}</p></div>
                <div className='space-y-1'><Label>Esmagamento</Label><p className='font-mono'>{armor.bludgeoning}</p></div>
                <div className='space-y-1'><Label>Perfurante</Label><p className='font-mono'>{armor.piercing}</p></div>
            </div>
             <div className='grid grid-cols-3 gap-2 text-center'>
                <div className='space-y-1'><Label>Resistência</Label><p className='font-mono'>{armor.resistance}</p></div>
                <div className='space-y-1'><Label>Durabilidade</Label><p className='font-mono'>{armor.durability}</p></div>
                <div className='space-y-1'><Label>Peso</Label><p className='font-mono'>{armor.weight}kg</p></div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-center'>
                <div className='space-y-1'><Label>Cobertura</Label><p className='font-mono'>{armor.coverage}</p></div>
                <div className='space-y-1'><Label>Tamanho</Label><p className='font-mono uppercase'>{armor.size}</p></div>
            </div>
        </CardContent>
    </Card>
)

const WeaponCard = ({ weapon }: { weapon: Weapon }) => (
    <Card className='bg-muted/30'>
        <CardHeader>
            <CardTitle className='flex justify-between items-center'>{weapon.name} <Button size="sm" variant={weapon.equipped ? 'secondary' : 'outline'}>{weapon.equipped ? 'Equipado' : 'Equipar'}</Button></CardTitle>
            <CardDescription>{weapon.extras}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
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
        </CardContent>
    </Card>
);

const AccessoryCard = ({ accessory }: { accessory: Accessory }) => (
    <Card className='bg-muted/30'>
        <CardHeader>
            <CardTitle className='flex justify-between items-center'>{accessory.name} <Button size="sm" variant={accessory.equipped ? 'secondary' : 'outline'}>{accessory.equipped ? 'Equipado' : 'Equipar'}</Button></CardTitle>
            <CardDescription>{accessory.typeAndDescription}</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-2 text-center'>
            <div className='space-y-1'><Label>Peso</Label><p className='font-mono'>{accessory.weight}kg</p></div>
            <div className='space-y-1'><Label>Efeito</Label><p className='font-mono'>{accessory.effect}</p></div>
        </CardContent>
    </Card>
)

const ProjectileCard = ({ projectile }: { projectile: Projectile }) => (
    <Card className='bg-muted/30'>
        <CardHeader>
            <CardTitle>{projectile.name} ({projectile.quantity})</CardTitle>
            <CardDescription>{projectile.extras}</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-4 text-center'>
            <div className='space-y-1'><Label>Tipo</Label><p>{projectile.type}</p></div>
            <div className='space-y-1'><Label>AP</Label><p>{projectile.ap}</p></div>
            <div className='space-y-1'><Label>Precisão</Label><p>{projectile.accuracy}</p></div>
            <div className='space-y-1'><Label>Peso Total</Label><p>{(projectile.weight * projectile.quantity).toFixed(2)}kg</p></div>
             <div className='space-y-1'><Label>Tamanho</Label><p className='uppercase'>{projectile.size}</p></div>
        </CardContent>
    </Card>
)

const BagCard = ({ items }: { items: BagItem[] }) => (
    <Card className='bg-muted/30'>
        <CardHeader>
            <CardTitle>Mochila</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className='text-center'>Qtd</TableHead>
                        <TableHead className='text-right'>Peso</TableHead>
                        <TableHead>Extras</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className='text-center'>{item.quantity}</TableCell>
                            <TableCell className='text-right'>{(item.weight * item.quantity).toFixed(2)}kg</TableCell>
                            <TableCell>{item.extras}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


const EquipmentAndInventory = ({ equipment, inventory }: { equipment: Character['equipment'], inventory: Character['inventory'] }) => {
    return (
        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle className='font-headline text-2xl magical-glow text-center'>Inventário & Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="equipment">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="equipment"><Shirt className='mr-2'/>Equipamento</TabsTrigger>
                        <TabsTrigger value="inventory"><Backpack className='mr-2'/>Inventário</TabsTrigger>
                    </TabsList>
                    <TabsContent value="equipment">
                        <Tabs defaultValue='armor' className='mt-4'>
                            <TabsList className='grid w-full grid-cols-4'>
                                <TabsTrigger value='armor'><Shield className='mr-2' />Armaduras</TabsTrigger>
                                <TabsTrigger value='weapons'><Swords className='mr-2' />Armamentos</TabsTrigger>
                                <TabsTrigger value='accessories'><Gem className='mr-2' />Acessórios</TabsTrigger>
                                <TabsTrigger value='projectiles'><ArrowRight className='mr-2' />Projéteis</TabsTrigger>
                            </TabsList>
                            <TabsContent value='armor' className='space-y-4 mt-4'>
                                {equipment.armors.map(armor => <ArmorCard key={armor.name} armor={armor} />)}
                            </TabsContent>
                            <TabsContent value='weapons' className='space-y-4 mt-4'>
                                {equipment.weapons.map(weapon => <WeaponCard key={weapon.name} weapon={weapon} />)}
                            </TabsContent>
                            <TabsContent value='accessories' className='space-y-4 mt-4'>
                                {equipment.accessories.map(accessory => <AccessoryCard key={accessory.name} accessory={accessory} />)}
                            </TabsContent>
                             <TabsContent value='projectiles' className='space-y-4 mt-4'>
                                {equipment.projectiles.map(projectile => <ProjectileCard key={projectile.name} projectile={projectile} />)}
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="inventory" className='mt-4'>
                        <BagCard items={inventory.bag} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};


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
            <section className="flex flex-col md:flex-row gap-6">
                <FocusCard 
                    title="FÍSICO"
                    resource={character.focus.physical.vigor}
                    attributes={character.focus.physical.attributes}
                    skills={character.focus.physical.skills}
                />
                <FocusCard 
                    title="MENTAL"
                    resource={character.focus.mental.focus}
                    attributes={character.focus.mental.attributes}
                    skills={character.focus.mental.skills}
                />
                <FocusCard 
                    title="SOCIAL"
                    resource={character.focus.social.grace}
                    attributes={character.focus.social.attributes}
                    skills={character.focus.social.skills}
                />
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
                <EquipmentAndInventory equipment={character.equipment} inventory={character.inventory} />
            </section>
        </div>
    );
}
