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
import { Dices, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type RollResult = {
  notation: string;
  rolls: number[];
  total: number;
  timestamp: string;
};

const attributeDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const skillDiceCounts = Array.from({ length: 10 }, (_, i) => i + 1);

export function DiceRoller() {
  const [results, setResults] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  const handleRoll = (notation: string) => {
    const [countStr, dieStr] = notation.toLowerCase().split('d');
    const count = parseInt(countStr);
    const die = parseInt(dieStr);

    let rolls: number[] = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * die) + 1;
      rolls.push(roll);
      total += roll;
    }

    const newRoll: RollResult = {
      notation: `${count}d${die}`,
      rolls,
      total,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLastRoll(newRoll);
    setResults([newRoll, ...results].slice(0, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-6 w-6" />
          Rolador de Dados
        </CardTitle>
        <CardDescription>
          Role dados para testes de Atributo ou Perícia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Tabs defaultValue="attribute" className="md:col-span-1 space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attribute">Atributos</TabsTrigger>
              <TabsTrigger value="skill">Perícias</TabsTrigger>
            </TabsList>
            <TabsContent value="attribute" className="space-y-4">
               <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Atributo</CardTitle>
                  <CardDescription>Clique em um dado para rolar.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {attributeDice.map(die => (
                    <Button key={die} onClick={() => handleRoll(`1${die}`)} className="h-20 text-xl font-bold">
                      {die.toUpperCase()}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skill" className="space-y-4">
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Perícia</CardTitle>
                  <CardDescription>Role uma quantidade de d10.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-5 gap-2">
                    {skillDiceCounts.map(count => (
                        <Button key={count} onClick={() => handleRoll(`${count}d10`)} className="font-bold">
                        {count}d10
                        </Button>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-4 min-h-[300px]">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">Resultado</p>
                <p className="text-7xl font-bold text-primary">
                    {lastRoll ? lastRoll.total : '...'}
                </p>
                {lastRoll && (
                    <div className="text-muted-foreground font-mono">
                        <span className="font-bold text-accent">{lastRoll.notation}</span>
                        {lastRoll.rolls.length > 1 && (
                            <span className="text-xs"> = ({lastRoll.rolls.join(' + ')})</span>
                        )}
                    </div>
                )}
            </div>

            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg flex items-center gap-2 text-muted-foreground"><History className="h-5 w-5" /> Histórico de Rolagens</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {results.length > 0 ? results.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-background/50">
                    <div className='font-mono'>
                      <span className="font-mono text-accent">{r.notation}</span>
                      {r.rolls.length > 1 && (
                         <span className="text-muted-foreground ml-2 text-xs">
                            ({r.rolls.join(', ')})
                         </span>
                      )}
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
