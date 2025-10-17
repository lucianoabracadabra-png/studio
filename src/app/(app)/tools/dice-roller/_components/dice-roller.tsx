'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dices, Plus, Minus, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;
type RollResult = {
  notation: string;
  rolls: number[];
  modifier: number;
  total: number;
  timestamp: string;
};

const diceTypes: DiceType[] = [4, 6, 8, 10, 12, 20, 100];

export function DiceRoller() {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  const rollDice = (die: DiceType) => {
    let rolls: number[] = [];
    let total = 0;
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(Math.random() * die) + 1;
      rolls.push(roll);
      total += roll;
    }
    total += modifier;

    const newRoll: RollResult = {
      notation: `${diceCount}d${die}${modifier > 0 ? `+${modifier}` : modifier < 0 ? modifier : ''}`,
      rolls,
      modifier,
      total,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLastRoll(newRoll);
    setResults([newRoll, ...results].slice(0, 10)); // Keep last 10 results
  };

  const handleDiceCountChange = (amount: number) => {
    setDiceCount(prev => Math.max(1, prev + amount));
  };

  const handleModifierChange = (amount: number) => {
    setModifier(prev => prev + amount);
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Dices className="h-6 w-6" />
          Rolador de Dados
        </CardTitle>
        <CardDescription>
          Role dados virtuais para o seu jogo. Selecione o número de dados, um modificador e o tipo de dado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Número de Dados</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleDiceCountChange(-1)}><Minus/></Button>
                <Input type="number" value={diceCount} onChange={(e) => setDiceCount(parseInt(e.target.value) || 1)} className="text-center font-mono" />
                 <Button variant="outline" size="icon" onClick={() => handleDiceCountChange(1)}><Plus/></Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Modificador</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleModifierChange(-1)}><Minus/></Button>
                <Input type="number" value={modifier} onChange={(e) => setModifier(parseInt(e.target.value) || 0)} className="text-center font-mono" />
                <Button variant="outline" size="icon" onClick={() => handleModifierChange(1)}><Plus/></Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {diceTypes.map(die => (
                <Button key={die} onClick={() => rollDice(die)} className="font-bold">
                  d{die}
                </Button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-lg border border-white/10 bg-background/30 p-4 space-y-4 min-h-[300px]">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">Resultado</p>
                <p className="font-headline text-7xl font-bold magical-glow">
                    {lastRoll ? lastRoll.total : '...'}
                </p>
                {lastRoll && (
                    <div className="text-muted-foreground font-mono">
                        <span className="font-bold text-accent">{lastRoll.notation}</span> = (
                        {lastRoll.rolls.join(' + ')}) {lastRoll.modifier > 0 ? `+ ${lastRoll.modifier}` : lastRoll.modifier < 0 ? `- ${Math.abs(lastRoll.modifier)}` : ''}
                    </div>
                )}
            </div>

            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-headline text-lg flex items-center gap-2 text-muted-foreground"><History className="h-5 w-5" /> Histórico de Rolagens</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {results.length > 0 ? results.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                    <div className='font-mono'>
                      <span className="font-mono text-accent">{r.notation}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        = ({r.rolls.join(', ')}) {r.modifier !== 0 && (r.modifier > 0 ? `+${r.modifier}`: r.modifier)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-mono">{r.total}</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center pt-4">Seu histórico de rolagens aparecerá aqui.</p>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
