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
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mainLinks, gmToolsLinks, profileLink } from '@/components/layout/sidebar-nav';
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
  turn: number; // The turn number this trail was created on
};


type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
  colorHue?: number;
  isPlayer?: boolean;
}

const MAX_AP_ON_TIMELINE = 50;

const allLinks = [...mainLinks, ...gmToolsLinks, ...profileLink];
const bookColors = allLinks.filter(l => l.colorHue > 0).map(link => link.colorHue);
const hueToNameMap = allLinks.reduce((acc, link) => {
    if (link.colorHue > 0) {
        acc[link.colorHue] = link.label;
    }
    return acc;
}, {} as Record<number, string>);


const ColorSelector = ({ selectedHue, onSelect, disabled }: { selectedHue: number, onSelect: (hue: number) => void, disabled?: boolean }) => {
    return (
        <div className={cn('flex flex-wrap gap-2', disabled && 'opacity-50')}>
            {bookColors.map(hue => {
                const isSelected = selectedHue === hue;
                const glowStyle = isSelected ? {
                    boxShadow: `
                        0 0 25px hsla(${hue}, 90%, 70%, 1),
                        0 0 12px hsla(${hue}, 90%, 70%, 0.7),
                        0 0 5px hsl(${hue}, 90%, 70%)`
                } : {};

                return (
                    <button
                        key={hue}
                        type="button"
                        onClick={() => !disabled && onSelect(hue)}
                        disabled={disabled}
                        className={cn(
                            'w-8 h-8 rounded-full transition-all flex items-center justify-center',
                            isSelected ? 'scale-110' : 'hover:scale-105',
                            disabled ? 'cursor-not-allowed' : ''
                        )}
                        style={{ 
                            backgroundColor: `hsl(${hue}, 90%, 70%)`,
                            ...glowStyle 
                        }}
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
    setLog(prev => [newEntry, ...prev]);
    setNextLogId(prev => prev + 1);
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
    const name = newCombatant.name.trim() || hueToNameMap[newCombatant.colorHue] || `Combatant ${nextId}`;
    
    const combatant: Combatant = {
      id: nextId,
      name,
      ap: 0,
      isPlayer: newCombatant.isPlayer,
      reactionModifier: newCombatant.reactionModifier,
      colorHue: newCombatant.colorHue,
    };
    setCombatants([...combatants, combatant]);
    setNextId(nextId + 1);
    setNewCombatant({ name: '', reactionModifier: 0, isPlayer: false, colorHue: bookColors[Math.floor(Math.random() * bookColors.length)] });
    addLogEntry(`${combatant.name} has been added to the encounter.`);
  };
  
  const startCombat = () => {
    if (combatants.length === 0) return;
    setTurnCount(1);
    const updatedCombatants = combatants.map(c => {
      const reactionRoll = Math.floor(Math.random() * 10) + 1;
      const startAp = 20 - (reactionRoll + c.reactionModifier);
      return { ...c, ap: startAp < 0 ? 0 : startAp };
    });
    setCombatants(updatedCombatants);
    
    setActionTrails([]); // Clear previous trails
    setCombatStarted(true);
    addLogEntry("Combat has started! Reaction tests rolled.");
  };

  const resetCombat = () => {
    setCombatStarted(false);
    setActiveCombatantId(null);
    setCombatants(combatants.map(c => ({...c, ap: 0})));
    setActionTrails([]);
    setLog([]);
    setTurnCount(0);
    addLogEntry("Combat has been reset.");
  }

  const removeCombatant = (id: number) => {
    const combatant = combatants.find(c => c.id === id);
    if(combatant) addLogEntry(`${combatant.name} has been removed from the encounter.`);
    setCombatants(combatants.filter(c => c.id !== id));
    setActionTrails(actionTrails.filter(t => t.combatantId !== id));
  };
  
  const confirmAction = (cost: number) => {
    if (activeCombatantId === null) return;
    
    const actor = combatants.find(c => c.id === activeCombatantId);
    if (!actor) return;

    addLogEntry(`[AP ${actor.ap}] ${actor.name} performs an action with cost ${cost}.`, actor);
    
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
            if (turnIndex === 0) opacity = 1;      // Current turn action
            else if (turnIndex === 1) opacity = 0.5; // Last turn
            else if (turnIndex === 2) opacity = 0.1; // 2 turns ago
            else return null;

            const DotComponent = isPlayer ? Circle : Square;
            const dotSize = 4; // size in pixels

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
        <Card className="glassmorphic-card w-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">
                    <span className="magical-glow">Action Point Timeline</span>
                     {combatStarted ? (
                        <Button onClick={resetCombat} variant="destructive">
                            <RefreshCw className="mr-2" />
                            Reset Combat
                        </Button>
                    ) : (
                        <Button onClick={startCombat} disabled={combatants.length === 0}>
                            <Play className="mr-2" />
                            Start Combat
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
                                <div key={marker} className="absolute h-full w-px bg-white/10" style={{ left: `${(marker / MAX_AP_ON_TIMELINE) * 100}%`, top: 0, bottom: 0 }}></div>
                            ))}
                        </div>

                        {rosterOrder.map((c, index) => {
                            const leftPercentage = Math.min(100, (c.ap / MAX_AP_ON_TIMELINE) * 100);
                            const isActive = c.id === activeCombatantId;
                            const topPosition = `${index * 3.5}rem`;

                            const glowStyle = isActive ? {
                                boxShadow: `0 0 12px hsl(${c.colorHue}, 90%, 70%), 0 0 5px hsl(${c.colorHue}, 90%, 70%)`
                            } : {};
                            
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
                                                            "h-4 w-4 transition-all",
                                                            c.isPlayer ? 'rounded-full' : '',
                                                        )}
                                                        style={isActive ? glowStyle : {}}
                                                     >
                                                      <AvatarFallback 
                                                        className={cn(
                                                          'h-full w-full p-0',
                                                          c.isPlayer ? 'rounded-full' : 'rounded-none',
                                                          isActive ? 'bg-transparent' : ''
                                                          )}
                                                        style={{ backgroundColor: !isActive ? `hsl(${c.colorHue}, 90%, 70%)` : undefined }}
                                                      >
                                                      </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-bold">{c.name}</p>
                                                <p>AP: {c.ap}</p>
                                                <p>React Mod: {c.reactionModifier}</p>
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

        {combatStarted && activeCombatant ? (
            <Card className="glassmorphic-card">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Crown /> Active Turn: {activeCombatant.name}</CardTitle>
                    <CardDescription>Current AP: {activeCombatant.ap}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     <div className="flex-grow space-y-2">
                       <Label>Action Cost (AP)</Label>
                        <div className='flex flex-wrap gap-2'>
                            {Array.from({length: 10}, (_, i) => i + 1).map(cost => (
                                <Button key={cost} onClick={() => confirmAction(cost)} variant="outline" size="sm" className="font-mono">
                                    {cost}
                                </Button>
                            ))}
                       </div>
                    </div>
                </CardContent>
            </Card>
        ) : null }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="glassmorphic-card">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><UserPlus /> Add Combatant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="e.g., Goblin, Player Hero" value={newCombatant.name} onChange={e => setNewCombatant({ ...newCombatant, name: e.target.value })} disabled={combatStarted}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reaction">Reaction Mod</Label>
                             <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" onClick={() => setNewCombatant(prev => ({...prev, reactionModifier: prev.reactionModifier - 1}))} disabled={combatStarted}><ChevronLeft/></Button>
                                <Input id="reaction" type="number" value={newCombatant.reactionModifier} onChange={(e) => setNewCombatant(prev => ({...prev, reactionModifier: parseInt(e.target.value) || 0}))} className="text-center font-bold text-lg w-full hide-number-arrows" disabled={combatStarted}/>
                                <Button size="icon" variant="outline" onClick={() => setNewCombatant(prev => ({...prev, reactionModifier: prev.reactionModifier + 1}))} disabled={combatStarted}><ChevronRight/></Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label>Color</Label>
                        <ColorSelector selectedHue={newCombatant.colorHue} onSelect={hue => setNewCombatant({ ...newCombatant, colorHue: hue })} disabled={combatStarted}/>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <Label htmlFor="is-player" className='flex-grow'>Player Character</Label>
                        <Switch id="is-player" checked={newCombatant.isPlayer} onCheckedChange={checked => setNewCombatant({ ...newCombatant, isPlayer: checked })} disabled={combatStarted}/>
                    </div>
                    <Button 
                        onClick={addCombatant} 
                        className="w-full font-bold transition-all" 
                        disabled={combatStarted}
                        style={{
                            backgroundColor: `hsl(${newCombatant.colorHue}, 90%, 70%)`,
                            color: `hsl(${newCombatant.colorHue}, 10%, 15%)`,
                            boxShadow: `0 0 15px hsla(${newCombatant.colorHue}, 90%, 70%, 0.6)`
                        }}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add to Encounter
                    </Button>
                </CardContent>
            </Card>

            <Card className="glassmorphic-card flex-grow">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><History /> Combat Log</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {log.length > 0 ? log.map(entry => (
                        <div key={entry.id} className="text-sm p-2 rounded-md bg-muted/50 relative flex items-center gap-3">
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
                        <p className="text-center text-muted-foreground py-8">Log is empty.</p>
                    )}
                </CardContent>
            </Card>
        </div>


        <Card className="lg:col-span-2 glassmorphic-card">
            <CardHeader>
                <CardTitle className='font-headline'>Encounter Roster</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-[30rem] overflow-y-auto">
                    {rosterOrder.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No combatants added.</p>
                    ) : (
                        rosterOrder.map(c => (
                            <div key={c.id} className="flex items-center gap-4 p-2 bg-muted/30 rounded-md">
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
                                    <p>React Mod: {c.reactionModifier}</p>
                                </div>
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8" disabled={combatStarted}><X className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove {c.name} from the encounter.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeCombatant(c.id)} >Remove</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
