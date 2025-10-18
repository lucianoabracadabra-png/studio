'use client';

import React, { useState } from 'react';
import type { Token, VttState } from './vtt-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Shield, Swords, Map, Layers, Save, Undo, Upload } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface VttSidebarProps {
  vttState: VttState;
  setTokens: React.Dispatch<React.SetStateAction<VttState['tokens']>>;
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  setLayers: React.Dispatch<React.SetStateAction<VttState['layers']>>;
}

const TokenCreator = ({
    tokenType,
    onAddToken
}: {
    tokenType: 'hero' | 'enemy',
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


export function VttSidebar({ vttState, setTokens, setMapState, setLayers }: VttSidebarProps) {
  const [showHeroCreator, setShowHeroCreator] = useState(false);
  const [showEnemyCreator, setShowEnemyCreator] = useState(false);

  const addToken = (newTokenData: Omit<Token, 'id' | 'position'>) => {
    const allTokens = [...vttState.tokens.heroes, ...vttState.tokens.enemies];
    const newId = allTokens.length > 0 ? Math.max(...allTokens.map(t => t.id)) + 1 : 1;
    
    const tokenToAdd: Token = {
      id: newId,
      ...newTokenData,
      position: { x: 200, y: 200 },
    };

    setTokens(prev => {
        if (tokenToAdd.shape === 'circle') {
            return { ...prev, heroes: [...prev.heroes, tokenToAdd] }
        } else {
            return { ...prev, enemies: [...prev.enemies, tokenToAdd] }
        }
    });

    if (tokenToAdd.shape === 'circle') setShowHeroCreator(false);
    else setShowEnemyCreator(false);
  };

  const removeToken = (id: number) => {
    setTokens(prev => ({
        heroes: prev.heroes.filter(t => t.id !== id),
        enemies: prev.enemies.filter(t => t.id !== id),
    }));
  };
  
  return (
    <div className="w-80 h-full bg-card/70 border-l border-white/10 flex flex-col">
       <Tabs defaultValue="tokens" className="flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          <TabsTrigger value="tokens"><Shield className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="layers"><Layers className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="scene"><Save className="h-4 w-4" /></TabsTrigger>
        </TabsList>

        <ScrollArea className='flex-grow'>
          <div className="p-4">
            <TabsContent value="tokens">
              <Card className="glassmorphic-card">
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-center'>
                      <CardTitle className='flex items-center gap-2 text-lg'><Shield/> Heróis</CardTitle>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHeroCreator(s => !s)}><PlusCircle /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showHeroCreator && <TokenCreator tokenType='hero' onAddToken={addToken} />}
                    {vttState.tokens.heroes.length === 0 ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum herói adicionado.</p> : vttState.tokens.heroes.map(token => (
                      <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                    ))}
                  </CardContent>
              </Card>
              <Separator className="my-4"/>
              <Card className="glassmorphic-card">
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-center'>
                      <CardTitle className='flex items-center gap-2 text-lg'><Swords/> Inimigos</CardTitle>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowEnemyCreator(s => !s)}><PlusCircle /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showEnemyCreator && <TokenCreator tokenType='enemy' onAddToken={addToken} />}
                    {vttState.tokens.enemies.length === 0 ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum inimigo adicionado.</p> : vttState.tokens.enemies.map(token => (
                      <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                    ))}
                  </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layers">
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
                      <Label htmlFor="fog-switch" className="font-semibold">Névoa de Guerra</Label>
                      <Switch id="fog-switch" checked={vttState.layers.isFogOfWarActive} onCheckedChange={checked => setLayers(prev => ({...prev, isFogOfWarActive: checked}))}/>
                    </div>
                     <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <Label htmlFor="light-switch" className="font-semibold">Camada de Luz</Label>
                      <Switch id="light-switch" checked={vttState.layers.isLightLayerActive} onCheckedChange={checked => setLayers(prev => ({...prev, isLightLayerActive: checked}))}/>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scene">
              <Card className="glassmorphic-card">
                <CardHeader><CardTitle className='text-lg'>Gerenciar Cena</CardTitle></CardHeader>
                <CardContent className='grid grid-cols-1 gap-2'>
                  <Button><Save className='mr-2'/> Salvar Cena</Button>
                  <Button variant="outline"><Upload className='mr-2' /> Carregar Cena</Button>
                  <Button variant="secondary"><Undo className='mr-2' /> Desfazer Ação</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
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
