'use client';

import React, { useState, useMemo } from 'react';
import type { Token, TokenType, VttState, VttTool } from './vtt-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Shield, Layers, Save, Undo, Upload, Music, BookText, ZoomIn, ZoomOut, Maximize, MousePointer, Ruler, Cloud, Pen, Zap, Wrench, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface VttSidebarProps {
  vttState: VttState;
  setTokens: React.Dispatch<React.SetStateAction<VttState['tokens']>>;
  setMapState: React.Dispatch<React.SetStateAction<VttState['map']>>;
  setLayers: React.Dispatch<React.SetStateAction<VttState['layers']>>;
  setCombat: React.Dispatch<React.SetStateAction<VttState['combat']>>;
  onToolSelect: (tool: VttTool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
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

const TokensPanel = ({ vttState, setTokens }: Pick<VttSidebarProps, 'vttState' | 'setTokens'>) => {
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
            return [...prev, tokenToAdd];
        });

        if (newTokenData.type === 'hero') setShowHeroCreator(false);
        else setShowEnemyCreator(false);
    };

    const removeToken = (id: number) => {
        setTokens(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-4">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className='pb-2'>
                    <div className='flex justify-between items-center'>
                    <CardTitle className='flex items-center gap-2 text-lg'>Heróis</CardTitle>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHeroCreator(s => !s)}><PlusCircle /></Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {showHeroCreator && <TokenCreator tokenType='hero' onAddToken={addToken} />}
                    {heroTokens.length === 0 && !showHeroCreator ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum herói.</p> : heroTokens.map(token => (
                    <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                    ))}
                </CardContent>
            </Card>
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className='pb-2'>
                    <div className='flex justify-between items-center'>
                    <CardTitle className='flex items-center gap-2 text-lg'>Inimigos</CardTitle>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowEnemyCreator(s => !s)}><PlusCircle /></Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {showEnemyCreator && <TokenCreator tokenType='enemy' onAddToken={addToken} />}
                    {enemyTokens.length === 0 && !showEnemyCreator ? <p className='text-xs text-muted-foreground text-center py-2'>Nenhum inimigo.</p> : enemyTokens.map(token => (
                    <TokenListItem key={token.id} token={token} onRemove={removeToken} />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

const LayersPanel = ({ vttState, setMapState, setLayers }: Pick<VttSidebarProps, 'vttState' | 'setMapState' | 'setLayers'>) => {
    return (
        <div className='space-y-4'>
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader><CardTitle className='text-lg'>Camadas do Mapa</CardTitle></CardHeader>
                <CardContent className='space-y-4'>
                    <div className="space-y-2">
                    <Label htmlFor="map-url">URL do Mapa Base</Label>
                    <div className='flex gap-2'>
                        <Input id="map-url" value={vttState.map.url} onChange={e => setMapState(prev => ({...prev, url: e.target.value}))} placeholder="Deixe em branco para relva" />
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
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader><CardTitle className='text-lg'>Gerenciar Cena</CardTitle></CardHeader>
                <CardContent className='grid grid-cols-1 gap-2'>
                    <Button><Save className='mr-2'/> Salvar Cena</Button>
                    <Button variant="outline"><Upload className='mr-2' /> Carregar Cena</Button>
                    <Button variant="secondary"><Undo className='mr-2' /> Desfazer Ação</Button>
                </CardContent>
            </Card>
        </div>
    )
}

const mainTools: { id: VttTool, label: string, icon: React.ElementType }[] = [
    { id: 'select', label: 'Selecionar & Mover', icon: MousePointer },
    { id: 'measure', label: 'Medir Distância', icon: Ruler },
    { id: 'fog', label: 'Névoa de Guerra', icon: Cloud },
    { id: 'ping', label: 'Pingar no Mapa', icon: Zap },
];

const ToolsPanel = ({ vttState, onToolSelect, onZoomIn, onZoomOut, onCenter }: Pick<VttSidebarProps, 'vttState' | 'onToolSelect' | 'onZoomIn' | 'onZoomOut' | 'onCenter'>) => (
    <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-2'>
        {mainTools.map(tool => (
            <TooltipProvider key={tool.id}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant={vttState.ui.activeTool === tool.id ? 'secondary' : 'outline'} 
                            size="lg" 
                            onClick={() => onToolSelect(tool.id)}
                            className="h-16 flex flex-col gap-1"
                        >
                            <tool.icon className='h-6 w-6' />
                            <span className='text-xs'>{tool.label.split(' ')[0]}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>{tool.label}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ))}
        </div>
        <Separator />
        <div className='space-y-2'>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={onZoomOut} className="flex-1"><ZoomOut /></Button>
                <div className="font-mono text-xs p-2 rounded-md bg-muted text-center flex-1">{Math.round(vttState.map.zoom * 100)}%</div>
                <Button variant="outline" size="icon" onClick={onZoomIn} className="flex-1"><ZoomIn /></Button>
            </div>
            <Button variant="outline" onClick={onCenter} className='w-full'><Maximize className='mr-2' /> Centralizar</Button>
        </div>
    </div>
);

const JukeboxPanel = () => (
    <div className='space-y-4 text-center text-muted-foreground text-sm p-4'>
        <Music className="mx-auto h-10 w-10 text-primary/50" />
        Mesa de Som em desenvolvimento.
    </div>
);

const JournalPanel = () => (
     <div className='space-y-4 text-center text-muted-foreground text-sm p-4'>
        <BookText className="mx-auto h-10 w-10 text-primary/50" />
        Diário & Notas em desenvolvimento.
    </div>
);

const sidebarPanels = {
    tokens: TokensPanel,
    layers: LayersPanel,
    tools: ToolsPanel,
    audio: JukeboxPanel,
    journal: JournalPanel,
}
type PanelId = keyof typeof sidebarPanels;

const sidebarButtons: { id: PanelId, label: string, icon: React.ElementType }[] = [
    { id: 'tokens', label: 'Tokens', icon: Shield },
    { id: 'layers', label: 'Camadas', icon: Layers },
    { id: 'tools', label: 'Ferramentas', icon: Wrench },
    { id: 'audio', label: 'Mesa de Som', icon: Music },
    { id: 'journal', label: 'Diário & Notas', icon: BookText },
];

export function VttSidebar(props: VttSidebarProps) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  const togglePanel = (panelId: PanelId) => {
    setActivePanel(prev => prev === panelId ? null : panelId);
  }

  const ActivePanelComponent = activePanel ? sidebarPanels[activePanel] : null;

  return (
    <div className="h-full flex justify-end">
        <div className={cn("h-full bg-card/90 backdrop-blur-sm border-l border-white/10 flex flex-col transition-all duration-300 ease-in-out overflow-hidden", activePanel ? 'w-80' : 'w-0')}>
             {ActivePanelComponent && (
                <div className='flex flex-col flex-grow w-80'>
                    <div className='flex items-center justify-between p-2 border-b'>
                        <h3 className='font-headline text-lg ml-2'>{sidebarButtons.find(b => b.id === activePanel)?.label}</h3>
                        <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)}>
                            <X className='h-5 w-5'/>
                        </Button>
                    </div>
                    <ScrollArea className='flex-grow'>
                        <div className="p-4">
                            <ActivePanelComponent {...props} />
                        </div>
                    </ScrollArea>
                </div>
             )}
        </div>
        <div className='h-full w-16 bg-card/90 border-l border-white/10 flex flex-col items-center py-4 gap-2'>
            {sidebarButtons.map(button => (
                <TooltipProvider key={button.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={activePanel === button.id ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className='h-12 w-12'
                                onClick={() => togglePanel(button.id)}
                            >
                                <button.icon/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{button.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    </div>
  );
}
