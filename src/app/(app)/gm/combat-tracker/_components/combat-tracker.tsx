'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, UserPlus, Crown, Play, History, Check, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import navData from '@/lib/data/navigation.json';
import { profileLink } from '@/components/layout/sidebar-nav';
import { Circle, Square } from 'lucide-react';

type Combatant = {
  id: number;
  name: string;
  ap: number;
  isPlayer: boolean;
  reactionModifier: number; 
  colorHue: number;
};

type ActionTrail = {
  combatantId: number;
  fromAp: number;
  toAp: number;
  colorHue: number;
  turn: number;
};

type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
  colorHue?: number;
  isPlayer?: boolean;
}

const MAX_AP_ON_TIMELINE = 50;

const allLinks = [...navData.mainLinks, ...navData.gmToolsLinks, profileLink];
const bookColors = [...new Set(allLinks.filter(l => l.colorHue && typeof l.colorHue === 'string' && l.colorHue.match(/^\d/)).map(link => parseInt(link.colorHue.split(' ')[0], 10)))];
const hueToNameMap = allLinks.reduce((acc, link) => {
    if (link.colorHue && typeof link.colorHue === 'string' && link.colorHue.match(/^\d/)) {
        acc[parseInt(link.colorHue.split(' ')[0], 10)] = link.label;
    }
    return acc;
}, {} as Record<number, string>);


const ColorSelector = ({ selectedHue, onSelect, disabled }: { selectedHue: number, onSelect: (hue: number) => void, disabled?: boolean }) => {
    return (
        <div className={cn('flex flex-wrap gap-2', disabled && 'opacity-50')}>
            {bookColors.map(hue => {
                const isSelected = selectedHue === hue;
                
                return (
                    <button
                        key={hue}
                        type="button"
                        onClick={() => !disabled && onSelect(hue)}
                        disabled={disabled}
                        className={cn(
                            'w-8 h-8 rounded-full transition-all flex items-center justify-center border-2',
                            isSelected ? 'border-white' : 'border-transparent hover:scale-105',
                            disabled ? 'cursor-not-allowed' : ''
                        )}
                        style={{ backgroundColor: `hsl(${hue}, 90%, 70%)`}}
                        aria-label={`Select color hue ${hue}`}
                    >
                        {isSelected && <Check className='h-5 w-5 text-white' />}
                    </button>
                )
            })}
        </div>
    );
};

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [nextId, setNextId] = useState(1);
  const [activeCombatantId, setActiveCombatantId] = useState<number | null>(null);
  const [newCombatant, setNewCombatant] = useState<{name: string, reactionModifier: number, isPlayer: boolean, colorHue: number}>({ name: '', reactionModifier: 0, isPlayer: false, colorHue: bookColors[0] });
  const [combatStarted, setCombatStarted] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [nextLogId, setNextLogId] = useState(1);
  const [actionTrails, setActionTrails] = useState<ActionTrail[]>([]);
  const [turnCount, setTurnCount] = useState(0);

 const addLogEntry = (message: string, combatant?: Combatant) => {
    const newEntry: LogEntry = {
        id: nextLogId,
        message,
        timestamp: new Date().toLocaleTimeString(),
        colorHue: combatant?.colorHue,
        isPlayer: combatant?.isPlayer,
    };
    setLog(prevLog => [newEntry, ...prevLog]);
    setNextLogId(prevId => prevId + 1);
};
  
  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => a.ap - b.ap);
  }, [combatants]);

  const rosterOrder = useMemo(() => {
    return [...combatants].sort((a,b) => a.name.localeCompare(b.name));
  }, [combatants]);

  useEffect(() => {
    if (combatStarted && sortedCombatants.length > 0) {
      setActiveCombatantId(sortedCombatants[0].id);
    } else {
      setActiveCombatantId(null);
    }
  }, [combatStarted, sortedCombatants]);

  const addCombatant = () => {
    const name = newCombatant.name.trim() || hueToNameMap[newCombatant.colorHue] || `Combatente ${nextId}`;
    
    let initialAp = 0;
    if (combatStarted) {
      const minAp = combatants.length > 0 ? Math.min(...combatants.map(c => c.ap)) : 0;
      initialAp = minAp;
      addLogEntry(`${name} entrou no combate com AP ${initialAp}.`);
    } else {
      addLogEntry(`${name} foi adicionado ao encontro.`);
    }

    const combatant: Combatant = {
      id: nextId,
      name,
      ap: initialAp,
      isPlayer: newCombatant.isPlayer,
      reactionModifier: newCombatant.reactionModifier,
      colorHue: newCombatant.colorHue,
    };
    setCombatants([...combatants, combatant]);
    setNextId(nextId + 1);
    setNewCombatant({ name: '', reactionModifier: 0, isPlayer: false, colorHue: bookColors[Math.floor(Math.random() * bookColors.length)] });
  };
  
  const startCombat = () => {
    if (combatants.length === 0) return;
    
    setTurnCount(1);
    
    const initiativeLogs: LogEntry[] = [];
    let currentLogId = nextLogId;

    const combatStartEntry: LogEntry = {
      id: currentLogId++,
      message: "O combate começou! A rolar iniciativa...",
      timestamp: new Date().toLocaleTimeString(),
    };
    initiativeLogs.push(combatStartEntry);
    
    const updatedCombatants = combatants.map(c => {
      const reactionRoll = Math.floor(Math.random() * 10) + 1;
      const totalReaction = reactionRoll + c.reactionModifier;
      const startAp = 20 - totalReaction;
      const finalAp = startAp < 0 ? 0 : startAp;
      
      const newCombatant = { ...c, ap: finalAp };
      
      const initiativeEntry: LogEntry = {
        id: currentLogId++,
        message: `${c.name} rolou ${reactionRoll} + ${c.reactionModifier} (total: ${totalReaction}). Inicia no AP ${finalAp}.`,
        timestamp: new Date().toLocaleTimeString(),
        colorHue: newCombatant.colorHue,
        isPlayer: newCombatant.isPlayer,
      };
      initiativeLogs.push(initiativeEntry);
      
      return newCombatant;
    });

    setCombatants(updatedCombatants);
    setLog(prevLog => [...initiativeLogs.reverse(), ...prevLog]);
    setNextLogId(currentLogId);
    setActionTrails([]);
    setCombatStarted(true);
  };

  const resetCombat = () => {
    setCombatStarted(false);
    setActiveCombatantId(null);
    setCombatants(combatants.map(c => ({...c, ap: 0})));
    setActionTrails([]);
    setTurnCount(0);
    setLog([{
      id: 1,
      message: "O combate foi resetado.",
      timestamp: new Date().toLocaleTimeString()
    }]);
    setNextLogId(2);
  };

  const removeCombatant = (id: number) => {
    const combatant = combatants.find(c => c.id === id);
    if(combatant) addLogEntry(`${combatant.name} foi removido do encontro.`);
    setCombatants(combatants.filter(c => c.id !== id));
    setActionTrails(actionTrails.filter(t => t.combatantId !== id));
  };
  
  const confirmAction = (cost: number) => {
    if (activeCombatantId === null) return;
    
    const actor = combatants.find(c => c.id === activeCombatantId);
    if (!actor) return;

    addLogEntry(`[AP ${actor.ap}] ${actor.name} realiza uma ação com custo ${cost}.`, actor);
    
    const newAp = actor.ap + cost;
    
    const newTrail: ActionTrail = {
        combatantId: activeCombatantId,
        fromAp: actor.ap,
        toAp: newAp,
        colorHue: actor.colorHue,
        turn: turnCount,
    };
    setActionTrails(prevTrails => [...prevTrails, newTrail]);
    
    setTurnCount(prev => prev + 1);

    setCombatants(combatants.map(c => 
      c.id === activeCombatantId ? { ...c, ap: newAp } : c
    ));
  };

  const timelineMarkers = Array.from({ length: MAX_AP_ON_TIMELINE / 5 + 1 }, (_, i) => i * 5);
  const activeCombatant = useMemo(() => sortedCombatants.find(c => c.id === activeCombatantId), [sortedCombatants, activeCombatantId]);
  
  
  const ActionTrailDots = ({ combatantId, isPlayer }: { combatantId: number, isPlayer: boolean }) => {
    const allTrailsForCombatant = actionTrails
        .filter(t => t.combatantId === combatantId)
        .sort((a, b) => b.turn - a.turn);
    
    const lastThreeUniqueTurns = Array.from(new Set(allTrailsForCombatant.map(t => t.turn))).slice(0, 3);

    return (
      <>
        {allTrailsForCombatant.map((trail, index) => {
            const distance = trail.toAp - trail.fromAp;
            if (distance <= 0) return null;
        
            const turnIndex = lastThreeUniqueTurns.indexOf(trail.turn);
            let opacity = 0;
            if (turnIndex === 0) opacity = 1;
            else if (turnIndex === 1) opacity = 0.5;
            else if (turnIndex === 2) opacity = 0.1;
            else return null;

            const DotComponent = isPlayer ? Circle : Square;
            const dotSize = 4;

            return (
              <div key={`${trail.combatantId}-${trail.turn}-${index}`} className="absolute h-full top-0 left-0 right-0">
                {Array.from({length: distance}).map((_, i) => {
                    const apStep = trail.fromAp + i;
                    const leftPercent = (apStep / MAX_AP_ON_TIMELINE) * 100;
                    return (
                        <DotComponent 
                            key={i} 
                            className="absolute"
                            style={{
                                color: `hsl(${trail.colorHue}, 90%, 70%)`,
                                fill: `hsl(${trail.colorHue}, 90%, 70%)`,
                                height: `${dotSize}px`,
                                width: `${dotSize}px`,
                                left: `calc(${leftPercent}% + ${dotSize/2}px)`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                opacity: opacity,
                            }}
                        />
                    );
                })}
              </div>
            );
        })}
      </>
    );
  };


  return (
    <div className="flex flex-col gap-6">
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Linha do Tempo de Ação (Turno: {turnCount})</span>
                     {combatStarted ? (
                        <Button onClick={resetCombat} variant="destructive">
                            <RefreshCw className="mr-2" />
                            Resetar Combate
                        </Button>
                    ) : (
                        <Button onClick={startCombat} disabled={combatants.length === 0}>
                            <Play className="mr-2" />
                            Iniciar Combate
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="relative w-full rounded-lg p-2 overflow-x-auto">
                     <div className="relative h-4 mb-2">
                        {timelineMarkers.map(marker => (
                            <div key={marker} className="absolute h-full flex flex-col items-center" style={{ left: `${(marker / MAX_AP_ON_TIMELINE) * 100}%` }}>
                                <span className='text-xs text-muted-foreground -translate-x-1/2'>{marker}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="relative space-y-2" style={{minHeight: `${rosterOrder.length * 3.5}rem`}}>
                        <div className="absolute top-0 bottom-0 left-0 right-0">
                            {timelineMarkers.map(marker => (
                                <div key={marker} className="absolute h-full w-px bg-border" style={{ left: `${(marker / MAX_AP_ON_TIMELINE) * 100}%`, top: 0, bottom: 0 }}></div>
                            ))}
                        </div>

                        {rosterOrder.map((c, index) => {
                            const leftPercentage = Math.min(100, (c.ap / MAX_AP_ON_TIMELINE) * 100);
                            const isActive = c.id === activeCombatantId;
                            const topPosition = `${index * 3.5}rem`;

                            return (
                                <div key={c.id} className="absolute w-full" style={{ top: topPosition, height: '3rem' }}>
                                    {combatStarted && <ActionTrailDots combatantId={c.id} isPlayer={c.isPlayer} />}

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="absolute -translate-y-1/2 transition-all duration-500 ease-out z-10"
                                                    style={{ left: `calc(${leftPercentage}% - 8px)`, top: '50%' }}
                                                >
                                                     <Avatar 
                                                        className={cn(
                                                            "h-4 w-4 transition-all border-2",
                                                            isActive ? 'border-white' : 'border-transparent',
                                                            c.isPlayer ? 'rounded-full' : '',
                                                        )}
                                                     >
                                                      <AvatarFallback 
                                                        className={cn(
                                                          'h-full w-full p-0',
                                                          c.isPlayer ? 'rounded-full' : 'rounded-none'
                                                          )}
                                                        style={{ backgroundColor: `hsl(${c.colorHue}, 90%, 70%)` }}
                                                      >
                                                      </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-bold">{c.name}</p>
                                                <p>AP: {c.ap}</p>
                                                <p>Mod. Reação: {c.reactionModifier}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className={cn("lg:col-span-1", !combatStarted && "opacity-50 grayscale")}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Crown /> 
                    {activeCombatant ? `Turno Ativo: ${activeCombatant.name}` : "Turno Ativo"}
                </CardTitle>
                <CardDescription>
                    {activeCombatant ? `AP Atual: ${activeCombatant.ap}` : "Aguardando início do combate"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <div className="flex-grow space-y-2">
                   <Label>Custo da Ação (AP)</Label>
                    <div className='grid grid-cols-5 gap-2'>
                        {Array.from({length: 15}, (_, i) => i + 1).map(cost => (
                            <Button 
                                key={cost} 
                                onClick={() => confirmAction(cost)} 
                                variant="outline" 
                                size="sm" 
                                className="font-mono"
                                disabled={!combatStarted}
                            >
                                {cost}
                            </Button>
                        ))}
                   </div>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Registro de Combate</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow max-h-96 overflow-y-auto space-y-2 pr-2">
                {log.length > 0 ? log.map(entry => (
                    <div key={entry.id} className="text-sm p-2 rounded-md bg-muted relative flex items-center gap-3">
                        {entry.colorHue !== undefined && (
                            entry.isPlayer ? (
                            <Circle className="h-3 w-3" style={{ color: `hsl(${entry.colorHue}, 90%, 70%)`}} fill={`hsl(${entry.colorHue}, 90%, 70%)`} />
                            ) : (
                            <Square className="h-3 w-3" style={{ color: `hsl(${entry.colorHue}, 90%, 70%)`}} fill={`hsl(${entry.colorHue}, 90%, 70%)`} />
                            )
                        )}
                        <div>
                        <span className="font-mono text-xs text-muted-foreground mr-2">{entry.timestamp}</span>
                        <span>{entry.message}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-muted-foreground py-8">O registro está vazio.</p>
                )}
            </CardContent>
        </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Lista do Encontro</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-[30rem] overflow-y-auto">
                    {rosterOrder.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum combatente adicionado.</p>
                    ) : (
                        rosterOrder.map(c => (
                            <div key={c.id} className="flex items-center gap-4 p-2 bg-muted/50 rounded-md">
                                <Avatar className={cn('h-9 w-9', c.isPlayer ? 'rounded-full' : 'rounded-none')}>
                                    <AvatarFallback
                                        className={cn(c.isPlayer ? 'rounded-full' : 'rounded-none')}
                                        style={{ backgroundColor: `hsl(${c.colorHue}, 90%, 70%)`, color: `hsl(${c.colorHue}, 10%, 15%)`}}
                                    >
                                        {c.name.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="flex-grow font-semibold">{c.name}</span>
                                <div className='text-xs text-muted-foreground font-mono'>
                                    <p>AP: {c.ap}</p>
                                    <p>Mod. Reação: {c.reactionModifier}</p>
                                </div>
                                {combatStarted ? (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-orange-500 h-8 w-8"><X className="h-4 w-4"/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Isso removerá permanentemente {c.name} do encontro.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeCombatant(c.id)} >Remover</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-orange-500 h-8 w-8" onClick={() => removeCombatant(c.id)}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus /> Adicionar Combatente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Ex: Goblin, Herói" value={newCombatant.name} onChange={e => setNewCombatant({ ...newCombatant, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reaction">Mod. Reação</Label>
                            <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => setNewCombatant(prev => ({...prev, reactionModifier: prev.reactionModifier - 1}))}><ChevronLeft/></Button>
                            <Input id="reaction" type="number" value={newCombatant.reactionModifier} onChange={(e) => setNewCombatant(prev => ({...prev, reactionModifier: parseInt(e.target.value) || 0}))} className="w-16 text-center font-bold text-lg hide-number-arrows"/>
                            <Button size="icon" variant="outline" onClick={() => setNewCombatant(prev => ({...prev, reactionModifier: prev.reactionModifier + 1}))}><ChevronRight/></Button>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Cor</Label>
                    <ColorSelector selectedHue={newCombatant.colorHue} onSelect={hue => setNewCombatant({ ...newCombatant, colorHue: hue })} />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="is-player" checked={newCombatant.isPlayer} onCheckedChange={checked => setNewCombatant({ ...newCombatant, isPlayer: !!checked })} />
                    <Label htmlFor="is-player" className='cursor-pointer'>Personagem de Jogador</Label>
                </div>
                <Button 
                    onClick={addCombatant} 
                    className="w-full font-bold" 
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar ao Encontro
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
