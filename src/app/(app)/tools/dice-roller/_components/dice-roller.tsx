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
import { mainLinks, gmToolsLinks } from '@/components/layout/sidebar-nav';
import { DiceSvg, type DiceType } from '@/components/features/dice/dice-svg';

type RollResult = {
  notation: string;
  rolls: number[];
  total: number;
  timestamp: string;
};

const attributeDice: { type: DiceType, hue: number }[] = [
    { type: 'd4', hue: mainLinks[0].colorHue },
    { type: 'd6', hue: mainLinks[1].colorHue },
    { type: 'd8', hue: mainLinks[2].colorHue },
    { type: 'd10', hue: mainLinks[3].colorHue },
    { type: 'd12', hue: gmToolsLinks[0].colorHue },
    { type: 'd20', hue: gmToolsLinks[1].colorHue },
];
const skillDiceCounts = Array.from({ length: 10 }, (_, i) => i + 1);

export function DiceRoller() {
  const [results, setResults] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [rollingDie, setRollingDie] = useState<DiceType | null>(null);

  const rollDice = (count: number, dieType: DiceType | 'd10') => {
    const die = parseInt(dieType.substring(1));
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
    setResults([newRoll, ...results].slice(0, 10)); // Manter os últimos 10 resultados
  };
  
  const handleAttributeRoll = (die: DiceType) => {
    rollDice(1, die);
    setRollingDie(die);
    setTimeout(() => setRollingDie(null), 300); // Duração da animação
  };

  const handleSkillRoll = (count: number) => {
    rollDice(count, 'd10');
  }

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
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
               <Card className='bg-background/30 border-white/10'>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Atributo</CardTitle>
                  <CardDescription>Clique em um dado para rolar.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4 justify-items-center pt-8 h-auto">
                  {attributeDice.map(({ type, hue }) => (
                     <DiceSvg
                        key={type}
                        type={type}
                        colorHue={hue}
                        isRolling={rollingDie === type}
                        onClick={() => handleAttributeRoll(type)}
                     />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skill" className="space-y-4">
              <Card className='bg-background/30 border-white/10'>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Perícia</CardTitle>
                  <CardDescription>Role uma quantidade de d10.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-5 gap-2">
                    {skillDiceCounts.map(count => (
                        <Button key={count} onClick={() => handleSkillRoll(count)} className="font-bold">
                        {count}d10
                        </Button>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="rounded-lg border border-white/10 bg-background/30 p-4 space-y-4 min-h-[300px]">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">Resultado</p>
                <p className="font-headline text-7xl font-bold magical-glow">
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
              <h3 className="font-headline text-lg flex items-center gap-2 text-muted-foreground"><History className="h-5 w-5" /> Histórico de Rolagens</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {results.length > 0 ? results.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
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
