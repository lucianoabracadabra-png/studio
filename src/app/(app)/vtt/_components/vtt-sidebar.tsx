'use client';

import React, { useState, useMemo } from 'react';
import type { Token, TokenType, VttState } from './vtt-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Shield, Swords, Map, Layers, Save, Undo, Upload, Music, BookText, ChevronUp, ChevronDown, Repeat } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface VttSidebarProps {
  vttState: VttState;
  combatants: Token[];
  setTokens: React.Dispatch<React.SetStateAction<VttState['tokens']>>;
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  setLayers: React.Dispatch<React.SetStateAction<VttState['layers']>>;
  setCombat: React.Dispatch<React.SetStateAction<VttState['combat']>>;
}

const TokenCreator = ({
    tokenType,
    onAddToken
}: {
    tokenType: TokenType,
    onAddToken: (newTokenData: Omit<Token, 'id' | 'position'>) => void
}) => {
    const [newToken, setNewToken] = useState({
        name: '',
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    });

    const handleAdd = () => {
        if (!newToken.name) return;
        onAddToken({
            name: newToken.name,
            imageUrl: `https://picsum.photos/seed/${newToken.name}/50/50`,
            color: newToken.color,
            shape: tokenType === 'hero' ? 'circle' : 'square',
            type: tokenType
        })
        setNewToken({ name: '', color: `#${Math.floor(Math.random()*16777215).toString(16)}`});
    }

    return (
        <div className="p-3 bg-muted/30 rounded-lg space-y-3">
             <div className="space-y-1">
                <Label htmlFor={`token-name-${tokenType}`} className='text-xs'>Nome</Label>
                <Input
                id={`token-name-${tokenType}`}
                value={newToken.name}
                onChange={e => setNewToken(p => ({ ...p, name: e.target.value }))}
                placeholder={tokenType === 'hero' ? 'Ex: Aragorn' : 'Ex: Orc #1'}
                className="h-8"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor={`token-color-${tokenType}`} className='text-xs'>Cor</Label>
                <Input
                id={`token-color-${tokenType}`}
                type="color"
                value={newToken.color}
                onChange={e => setNewToken(p => ({ ...p, color: e.target.value }))}
                className="p-0 h-8"
                />
            </div>
            <Button onClick={handleAdd} className="w-full h-8">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar {tokenType === 'hero' ? 'Herói' : 'Inimigo'}
            </Button>
        </div>
    );
}

const TokenListItem = ({ token, onRemove }: { token: Token, onRemove: (id: number) => void}) => {
    return (
      <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
        <div
          className={cn(
            "w-8 h-8 border-2 flex-shrink-0",
            token.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
          )}
          style={{ borderColor: token.color }}
        >
          <Image src={token.imageUrl} alt={token.name} width={32} height={32} className={cn(token.shape === 'circle' ? 'rounded-full' : '')} />
        </div>
        <span className="flex-grow font-semibold text-sm truncate" title={token.name}>{token.name}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => onRemove(token.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
}

const TurnTracker = ({ combatants, activeTurnIndex, setCombat, allTokens }: { combatants: Token[], activeTurnIndex: number, setCombat: VttSidebarProps['setCombat'], allTokens: Token[] }) => {

    const nextTurn = () => {
        if (combatants.length === 0) return;
        setCombat(prev => ({ ...prev, activeTurnIndex: (prev.activeTurnIndex + 1) % combatants.length }))
    };
    const prevTurn = () => {
        if (combatants.length === 0) return;
        setCombat(prev => ({ ...prev, activeTurnIndex: (prev.activeTurnIndex - 1 + combatants.length) % combatants.length }))
    };

    const rerollInitiative = () => {
        const shuffled = [...allTokens].sort(() => Math.random() - 0.5);
        setCombat(prev => ({
            ...prev,
            turnOrder: shuffled.map(t => t.id),
            activeTurnIndex: shuffled.length > 0 ? 0 : -1,
        }))
    }
    
    return (
        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle className='text-lg flex justify-between items-center'>
                    Rastreador de Turnos
                    <Button variant="outline" size="sm" onClick={rerollInitiative} disabled={allTokens.length === 0}>
                        <Repeat className='mr-2 h-3 w-3'/>
                        Iniciativa
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex justify-between items-center gap-2'>
                    <Button size="icon" onClick={prevTurn} disabled={combatants.length === 0}><ChevronUp/></Button>
                    <div className='flex-grow text-center'>
                        <p className='text-sm text-muted-foreground'>Turno</p>
                        <p className='text-xl font-bold'>{combatants.length > 0 ? activeTurnIndex + 1 : 0} / {combatants.length}</p>
                    </div>
                    <Button size="icon" onClick={nextTurn} disabled={combatants.length === 0}><ChevronDown/></Button>
                </div>
                <Separator/>
                <ScrollArea className='h-80'>
                    <div className='space-y-2 pr-4'>
                        {combatants.length > 0 ? combatants.map((c, index) => (
                             <div key={c.id} className={cn("flex items-center gap-3 p-2 rounded-md transition-all", activeTurnIndex === index ? 'bg-primary/20 border border-primary' : 'bg-muted/30')}>
                                <div
                                className={cn(
                                    "w-8 h-8 border-2 flex-shrink-0",
                                    c.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
                                )}
                                style={{ borderColor: c.color }}
                                >
                                <Image src={c.imageUrl} alt={c.name} width={32} height={32} className={cn(c.shape === 'circle' ? 'rounded-full' : '')} />
                                </div>
                                <span className="flex-grow font-semibold text-sm truncate" title={c.name}>{c.name}</span>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-10 text-xs">Nenhum combatente na ordem de iniciativa.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

const Jukebox = () => (
    <Card className="glassmorphic-card">
        <CardHeader><CardTitle className='text-lg'>Mesa de Som</CardTitle></CardHeader>
        <CardContent className='space-y-4 text-center text-muted-foreground text-sm'>
            <Music className="mx-auto h-10 w-10 text-primary/50" />
           Funcionalidade em desenvolvimento.
        </CardContent>
    </Card>
);

const Journal = () => (
    <Card className="glassmorphic-card">
        <CardHeader><CardTitle className='text-lg'>Diário & Notas</CardTitle></CardHeader>
        <CardContent className='space-y-4 text-center text-muted-foreground text-sm'>
            <BookText className="mx-auto h-10 w-10 text-primary/50" />
            Funcionalidade em desenvolvimento.
        </CardContent>
    </Card>
);

export function VttSidebar({ vttState, setTokens, setMapState, setLayers, setCombat, combatants }: VttSidebarProps) {
  const [showHeroCreator, setShowHeroCreator] = useState(false);
  const [showEnemyCreator, setShowEnemyCreator] = useState(false);
  
  const heroTokens = useMemo(() => vttState.tokens.filter(t => t.type === 'hero'), [vttState.tokens]);
  const enemyTokens = useMemo(() => vttState.tokens.filter(t => t.type === 'enemy'), [vttState.tokens]);

  const addToken = (newTokenData: Omit<Token, 'id' | 'position'>) => {
    setTokens(prev => {
        const newId = (prev.length > 0 ? Math.max(...prev.map(t => t.id)) : 0) + 1;
        const tokenToAdd: Token = {
          id: newId,
          ...newTokenData,
          position: { x: 100, y: 100 },
        };
        
        setCombat(c => ({...c, turnOrder: [...c.turnOrder, tokenToAdd.id], activeTurnIndex: c.turnOrder.length === 0 ? 0 : c.activeTurnIndex }));

        return [...prev, tokenToAdd];
    });


    if (newTokenData.type === 'hero') setShowHeroCreator(false);
    else setShowEnemyCreator(false);
  };

  const removeToken = (id: number) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <div className="w-80 h-full bg-card/70 border-l border-white/10 flex flex-col">
       <Tabs defaultValue="tokens" className="flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-5 rounded-none">
          <TabsTrigger value="tokens"><Shield className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="combat"><Swords className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="layers"><Layers className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="audio"><Music className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="journal"><BookText className="h-4 w-4" /></TabsTrigger>
        </TabsList>

        <ScrollArea className='flex-grow'>
          <div className="p-4">
            <TabsContent value="tokens">
              <div className="space-y-4">
                  <Card className="glassmorphic-card">
                      <CardHeader className='pb-2'>
                        <div className='flex justify-between items-center'>
                          <CardTitle className='flex items-center gap-2 text-lg'>Heróis</CardTitle>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHeroCreator(s => !s)}><PlusCircle /></Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {showHeroCreator && <TokenCreator tokenType='hero' onAddToken={addToken} />}
                        {heroTokens.length === 0 && !showHeroCreator ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum herói adicionado.</p> : heroTokens.map(token => (
                          <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                        ))}
                      </CardContent>
                  </Card>
                  <Card className="glassmorphic-card">
                      <CardHeader className='pb-2'>
                        <div className='flex justify-between items-center'>
                          <CardTitle className='flex items-center gap-2 text-lg'>Inimigos</CardTitle>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowEnemyCreator(s => !s)}><PlusCircle /></Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {showEnemyCreator && <TokenCreator tokenType='enemy' onAddToken={addToken} />}
                        {enemyTokens.length === 0 && !showEnemyCreator ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum inimigo adicionado.</p> : enemyTokens.map(token => (
                          <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                        ))}
                      </CardContent>
                  </Card>
              </div>
            </TabsContent>

            <TabsContent value="combat">
                <TurnTracker combatants={combatants} activeTurnIndex={vttState.combat.activeTurnIndex} setCombat={setCombat} allTokens={vttState.tokens} />
            </TabsContent>

            <TabsContent value="layers">
              <div className='space-y-4'>
                <Card className="glassmorphic-card">
                    <CardHeader><CardTitle className='text-lg'>Camadas do Mapa</CardTitle></CardHeader>
                    <CardContent className='space-y-4'>
                        <div className="space-y-2">
                          <Label htmlFor="map-url">URL do Mapa Base</Label>
                          <div className='flex gap-2'>
                            <Input id="map-url" value={vttState.map.url} onChange={e => setMapState(prev => ({...prev, url: e.target.value}))} placeholder="https://..." />
                            <Button size="icon" variant="outline"><Upload/></Button>
                          </div>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                          <Label htmlFor="grid-switch" className="font-semibold">Grelha Visível</Label>
                          <Switch id="grid-switch" checked={vttState.layers.isGridVisible} onCheckedChange={checked => setLayers(prev => ({...prev, isGridVisible: checked}))}/>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                          <Label htmlFor="fog-switch" className="font-semibold">Névoa de Guerra</Label>
                          <Switch id="fog-switch" checked={vttState.layers.isFogOfWarActive} onCheckedChange={checked => setLayers(prev => ({...prev, isFogOfWarActive: checked}))}/>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                          <Label htmlFor="light-switch" className="font-semibold">Camada de Luz</Label>
                          <Switch id="light-switch" checked={vttState.layers.isLightLayerActive} onCheckedChange={checked => setLayers(prev => ({...prev, isLightLayerActive: checked}))}/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glassmorphic-card">
                    <CardHeader><CardTitle className='text-lg'>Gerenciar Cena</CardTitle></CardHeader>
                    <CardContent className='grid grid-cols-1 gap-2'>
                      <Button><Save className='mr-2'/> Salvar Cena</Button>
                      <Button variant="outline"><Upload className='mr-2' /> Carregar Cena</Button>
                      <Button variant="secondary"><Undo className='mr-2' /> Desfazer Ação</Button>
                    </CardContent>
                </Card>
              </div>
            </TabsContent>

             <TabsContent value="audio">
                <Jukebox />
             </TabsContent>
            
             <TabsContent value="journal">
                <Journal />
             </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
