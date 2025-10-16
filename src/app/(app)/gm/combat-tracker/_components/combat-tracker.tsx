'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { PlusCircle, Trash2, UserPlus, Shield, Swords, ChevronsUpDown, Crown, Play, History } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Combatant = {
  id: number;
  name: string;
  ap: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
  reactionModifier: number; // Vigilância + Raciocínio
};

type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
}

const MAX_AP_ON_TIMELINE = 50;

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [nextId, setNextId] = useState(1);
  const [activeCombatantId, setActiveCombatantId] = useState<number | null>(null);
  const [newCombatant, setNewCombatant] = useState({ name: '', hp: '', reactionModifier: '0', isPlayer: false });
  const [actionCost, setActionCost] = useState('5');
  const [combatStarted, setCombatStarted] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [nextLogId, setNextLogId] = useState(1);

  const addLogEntry = (message: string) => {
    const newEntry: LogEntry = {
      id: nextLogId,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLog(prev => [newEntry, ...prev]);
    setNextLogId(prev => prev + 1);
  };
  
  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => a.ap - b.ap);
  }, [combatants]);

  useEffect(() => {
    if (combatStarted && sortedCombatants.length > 0) {
      setActiveCombatantId(sortedCombatants[0].id);
    } else {
      setActiveCombatantId(null);
    }
  }, [combatStarted, sortedCombatants]);

  const addCombatant = () => {
    if (!newCombatant.name || !newCombatant.hp) return;

    const combatant: Combatant = {
      id: nextId,
      name: newCombatant.name,
      ap: 0,
      hp: parseInt(newCombatant.hp, 10),
      maxHp: parseInt(newCombatant.hp, 10),
      isPlayer: newCombatant.isPlayer,
      reactionModifier: parseInt(newCombatant.reactionModifier, 10)
    };
    setCombatants([...combatants, combatant]);
    setNextId(nextId + 1);
    setNewCombatant({ name: '', hp: '', reactionModifier: '0', isPlayer: false });
    addLogEntry(`${combatant.name} has been added to the encounter.`);
  };
  
  const startCombat = () => {
    if (combatants.length === 0) return;
    setCombatants(combatants.map(c => {
      const reactionRoll = Math.floor(Math.random() * 10) + 1;
      const startAp = 20 - (reactionRoll + c.reactionModifier);
      return { ...c, ap: startAp };
    }));
    setCombatStarted(true);
    addLogEntry("Combat has started! Reaction tests rolled.");
  };

  const removeCombatant = (id: number) => {
    const combatant = combatants.find(c => c.id === id);
    if(combatant) addLogEntry(`${combatant.name} has been removed from combat.`);
    setCombatants(combatants.filter(c => c.id !== id));
  };
  
  const confirmAction = () => {
    if (activeCombatantId === null) return;
    
    const cost = parseInt(actionCost) || 0;
    const actor = combatants.find(c => c.id === activeCombatantId);

    if (actor) {
      addLogEntry(`[AP ${actor.ap}] ${actor.name} performs an action with cost ${cost}.`);
      setCombatants(combatants.map(c => 
        c.id === activeCombatantId ? { ...c, ap: c.ap + cost } : c
      ));
    }
  };

  const timelineMarkers = Array.from({ length: MAX_AP_ON_TIMELINE / 5 + 1 }, (_, i) => i * 5);
  const activeCombatant = useMemo(() => sortedCombatants.find(c => c.id === activeCombatantId), [sortedCombatants, activeCombatantId]);

  return (
    <div className="flex flex-col gap-6">
        {/* TIMELINE VIEW */}
        <Card className="glassmorphic-card w-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">
                    <span>Action Point Timeline</span>
                    {!combatStarted && (
                        <Button onClick={startCombat} disabled={combatants.length === 0}>
                            <Play className="mr-2" />
                            Start Combat
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative h-24 w-full bg-background/30 rounded-lg p-2 overflow-x-auto">
                    {/* Markers */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                        {timelineMarkers.map(marker => (
                            <div key={marker} className="flex flex-col items-center text-xs text-muted-foreground">
                                <span>{marker}</span>
                                <div className="h-2 w-px bg-border"></div>
                            </div>
                        ))}
                    </div>
                    {/* Timeline Track */}
                    <div className="relative h-full pt-4">
                        {sortedCombatants.map(c => {
                            const leftPercentage = (c.ap / MAX_AP_ON_TIMELINE) * 100;
                            const isActive = c.id === activeCombatantId;
                            return (
                                <TooltipProvider key={c.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                                                style={{ left: `calc(${leftPercentage}% - 16px)`}}
                                            >
                                                <Avatar className={`h-10 w-10 border-2 transition-all ${isActive ? 'border-accent shadow-lg scale-110 shadow-accent/50' : 'border-muted-foreground'}`}>
                                                    <AvatarImage src={`https://picsum.photos/seed/${c.id}/40/40`} />
                                                    <AvatarFallback>{c.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                {isActive && <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping"></div>}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-bold">{c.name}</p>
                                            <p>AP: {c.ap}</p>
                                            <p>HP: {c.hp}/{c.maxHp}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ADD/MANAGE COMBATANT */}
        <Card className="lg:col-span-1 glassmorphic-card">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><UserPlus /> Manage Combatants</CardTitle>
            <CardDescription>Add new combatants before starting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g., Goblin, Player Hero" value={newCombatant.name} onChange={e => setNewCombatant({ ...newCombatant, name: e.target.value })} disabled={combatStarted}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hp">HP</Label>
                <Input id="hp" type="number" placeholder="10" value={newCombatant.hp} onChange={e => setNewCombatant({ ...newCombatant, hp: e.target.value })} disabled={combatStarted}/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="reaction">Reaction Test</Label>
                  <Input id="reaction" type="number" placeholder="5" value={newCombatant.reactionModifier} onChange={e => setNewCombatant({ ...newCombatant, reactionModifier: e.target.value })} disabled={combatStarted}/>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="is-player" checked={newCombatant.isPlayer} onCheckedChange={checked => setNewCombatant({ ...newCombatant, isPlayer: checked })} disabled={combatStarted}/>
              <Label htmlFor="is-player">Player Character</Label>
            </div>
            <Button onClick={addCombatant} className="w-full font-bold" disabled={combatStarted}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Encounter
            </Button>
            <Separator />
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {combatants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No combatants added.</p>
                ) : (
                    [...combatants].sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                        <div key={c.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://picsum.photos/seed/${c.id}/32/32`} />
                                <AvatarFallback>{c.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="flex-grow font-semibold">{c.name}</span>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8" disabled={combatStarted}><Trash2 className="h-4 w-4"/></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove {c.name} from the combat tracker.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeCombatant(c.id)} className={buttonVariants({ variant: "destructive" })}>Remove</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE CHARACTER & LOG */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {activeCombatant ? (
                <Card className="glassmorphic-card">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Crown /> Active Turn: {activeCombatant.name}</CardTitle>
                        <CardDescription>AP: {activeCombatant.ap} | HP: {activeCombatant.hp}/{activeCombatant.maxHp}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-end gap-4">
                        <div className="flex-grow space-y-2">
                           <Label htmlFor="action-cost">Action Cost (AP)</Label>
                           <Input id="action-cost" type="number" value={actionCost} onChange={e => setActionCost(e.target.value)} />
                        </div>
                        <Button onClick={confirmAction} className="font-bold">Confirm Action</Button>
                    </CardContent>
                </Card>
            ) : (
                 <Card className="glassmorphic-card">
                     <CardContent className="py-12 text-center text-muted-foreground">
                        <p>{combatStarted ? "No one is in combat." : "Start combat to see the active character."}</p>
                     </CardContent>
                 </Card>
            )}

            <Card className="glassmorphic-card flex-grow">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><History /> Combat Log</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {log.length > 0 ? log.map(entry => (
                        <div key={entry.id} className="text-sm p-2 rounded-md bg-muted/50">
                            <span className="font-mono text-xs text-muted-foreground mr-2">{entry.timestamp}</span>
                            <span>{entry.message}</span>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">Log is empty.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    