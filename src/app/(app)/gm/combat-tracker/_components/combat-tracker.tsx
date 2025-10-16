'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Trash2, ChevronUp, ChevronDown, UserPlus, Shield, Swords, ChevronsUpDown, Crown } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

type Combatant = {
  id: number;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
};

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [nextId, setNextId] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [newCombatant, setNewCombatant] = useState({ name: '', initiative: '', hp: '', isPlayer: false });

  useEffect(() => {
    // Reset turn if all combatants are removed
    if (combatants.length === 0) {
      setCurrentTurn(0);
      setRound(1);
    }
  }, [combatants]);

  const addCombatant = () => {
    if (!newCombatant.name || !newCombatant.initiative || !newCombatant.hp) return;

    const combatant: Combatant = {
      id: nextId,
      name: newCombatant.name,
      initiative: parseInt(newCombatant.initiative, 10),
      hp: parseInt(newCombatant.hp, 10),
      maxHp: parseInt(newCombatant.hp, 10),
      isPlayer: newCombatant.isPlayer
    };
    setCombatants([...combatants, combatant]);
    setNextId(nextId + 1);
    setNewCombatant({ name: '', initiative: '', hp: '', isPlayer: false });
  };

  const removeCombatant = (id: number) => {
    setCombatants(combatants.filter(c => c.id !== id));
  };

  const updateHp = (id: number, amount: number) => {
    setCombatants(combatants.map(c => 
      c.id === id ? { ...c, hp: Math.max(0, c.hp + amount) } : c
    ));
  };

  const sortByInitiative = () => {
    const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);
    setCombatants(sorted);
  };

  const nextTurn = () => {
    if (combatants.length === 0) return;
    const newTurn = (currentTurn + 1);
    if (newTurn >= combatants.length) {
      setRound(round + 1);
      setCurrentTurn(0);
    } else {
      setCurrentTurn(newTurn);
    }
  };
  
  const prevTurn = () => {
    if (combatants.length === 0) return;
    const newTurn = (currentTurn - 1);
     if (newTurn < 0) {
        if (round > 1) {
            setRound(round - 1);
            setCurrentTurn(combatants.length - 1);
        }
     } else {
         setCurrentTurn(newTurn);
     }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><UserPlus /> Add Combatant</CardTitle>
          <CardDescription>Add a new player or monster to the encounter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g., Goblin, Player Hero" value={newCombatant.name} onChange={e => setNewCombatant({...newCombatant, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="initiative">Initiative</Label>
                    <Input id="initiative" type="number" placeholder="15" value={newCombatant.initiative} onChange={e => setNewCombatant({...newCombatant, initiative: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hp">HP</Label>
                    <Input id="hp" type="number" placeholder="10" value={newCombatant.hp} onChange={e => setNewCombatant({...newCombatant, hp: e.target.value})} />
                </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="is-player" checked={newCombatant.isPlayer} onCheckedChange={checked => setNewCombatant({...newCombatant, isPlayer: checked})} />
              <Label htmlFor="is-player">Player Character</Label>
            </div>
            <Button onClick={addCombatant} className="w-full font-bold">
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Combat
            </Button>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2"><Swords /> Combat Tracker</CardTitle>
                    <CardDescription>Manage the turn order and status of all combatants.</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">Round: {round}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
                <Button onClick={sortByInitiative} variant="outline" className="w-full"><ChevronsUpDown className="mr-2"/> Sort by Initiative</Button>
                <Button onClick={prevTurn} variant="outline" className="w-full"><ChevronUp className="mr-2"/> Prev Turn</Button>
                <Button onClick={nextTurn} className="w-full font-bold"><ChevronDown className="mr-2"/> Next Turn</Button>
            </div>
            <Separator />
            <div className="space-y-2 mt-4">
            {combatants.length === 0 ? (
                 <div className="text-center text-muted-foreground py-12">
                    <Swords className="mx-auto h-12 w-12 mb-4" />
                    <p>No combatants yet. Add some to get started!</p>
                </div>
            ) : (
                combatants.map((c, index) => (
                <div key={c.id} className={
                    `flex items-center gap-4 p-3 rounded-lg transition-all ${
                    index === currentTurn ? 'bg-accent/30 border-accent border' : 'bg-muted/30'
                    } ${c.hp === 0 ? 'opacity-50' : ''}`
                }>
                    {index === currentTurn && <Crown className="h-6 w-6 text-accent flex-shrink-0" />}
                    <div className={`text-2xl font-bold w-12 text-center flex-shrink-0 ${c.isPlayer ? 'text-primary' : ''}`}>
                        {c.initiative}
                    </div>
                    <div className="flex-grow">
                        <p className="font-bold text-lg">{c.name} {c.hp === 0 && "(Down)"}</p>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">HP: {c.hp} / {c.maxHp}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button size="icon" variant="outline" onClick={() => updateHp(c.id, -1)} disabled={c.hp === 0}>-</Button>
                        <Input type="number" value={c.hp} onChange={(e) => setCombatants(combatants.map(cb => cb.id === c.id ? {...cb, hp: parseInt(e.target.value) || 0} : cb))} className="w-16 text-center" />
                        <Button size="icon" variant="outline" onClick={() => updateHp(c.id, 1)}>+</Button>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>
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
                          <AlertDialogAction onClick={() => removeCombatant(c.id)} className={
                            buttonVariants({ variant: "destructive" })
                          }>Remove</AlertDialogAction>
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
  );
}

// Helper for destructive button variant in AlertDialog
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
  }
);
import { cva } from "class-variance-authority"
