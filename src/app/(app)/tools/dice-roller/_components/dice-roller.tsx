
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
import { Dices, History, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCharacter } from '@/context/character-context';
import { useToast } from '@/hooks/use-toast';
import type { Stat } from '@/lib/character-data';

type RollResult = {
  notation: string;
  rolls: number[];
  total: number;
  timestamp: string;
};

const attributeDice = ['d10']; // Only d10 for attribute tests now
const skillDiceCounts = Array.from({ length: 10 }, (_, i) => i + 1);

const SuccessToast = ({ roll, successfulAttributes }: { roll: number, successfulAttributes: Stat[] }) => (
    <div className='w-full'>
        <div className="flex items-center gap-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <div>
                <p className="text-2xl font-bold">Rolagem: {roll}</p>
                <p className="text-sm text-muted-foreground">Sucesso! (Resultado ≤ Atributo)</p>
            </div>
        </div>
        <Separator className='my-2' />
        <p className='font-bold mb-1 text-sm'>Atributos bem-sucedidos:</p>
        {successfulAttributes.length > 0 ? (
            <ul className='text-xs list-disc list-inside'>
                {successfulAttributes.map(attr => <li key={attr.name}>{attr.name} ({attr.value})</li>)}
            </ul>
        ) : (
            <p className='text-xs text-muted-foreground'>Nenhum atributo foi baixo o suficiente.</p>
        )}
    </div>
);

const FailureToast = ({ roll, successfulAttributes }: { roll: number, successfulAttributes: Stat[] }) => (
     <div className='w-full'>
        <div className="flex items-center gap-4">
            <XCircle className="h-10 w-10 text-destructive" />
            <div>
                <p className="text-2xl font-bold">Rolagem: {roll}</p>
                <p className="text-sm text-muted-foreground">Falha Crítica! (Rolagem de 10)</p>
            </div>
        </div>
        {successfulAttributes.length > 0 && (
            <>
                <Separator className='my-2' />
                <p className='font-bold mb-1 text-sm'>Atributos que teriam sucesso:</p>
                <ul className='text-xs list-disc list-inside'>
                    {successfulAttributes.map(attr => <li key={attr.name}>{attr.name} ({attr.value})</li>)}
                </ul>
            </>
        )}
    </div>
)


export function DiceRoller() {
  const [results, setResults] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const { activeCharacter } = useCharacter();
  const { toast } = useToast();

  const handleAttributeRoll = (notation: string) => {
    const [countStr, dieStr] = notation.toLowerCase().split('d');
    const count = parseInt(countStr);
    const die = parseInt(dieStr);

    if(count !== 1 || die !== 10) {
      handleGenericRoll(notation);
      return;
    }

    const roll = Math.floor(Math.random() * 10) + 1;

    const newRoll: RollResult = {
      notation: `1d10`,
      rolls: [roll],
      total: roll,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLastRoll(newRoll);
    setResults([newRoll, ...results].slice(0, 10));

    const allAttributes: Stat[] = [
        ...activeCharacter.focus.physical.attributes,
        ...activeCharacter.focus.mental.attributes,
        ...activeCharacter.focus.social.attributes,
    ];
    
    const successfulAttributes = allAttributes.filter(attr => attr.value >= roll);
    const isSuccess = roll < 10; // Success if roll is 1-9. 10 is critical fail.

    toast({
        title: isSuccess ? "Teste de Atributo" : "Falha Crítica no Teste!",
        description: isSuccess 
            ? <SuccessToast roll={roll} successfulAttributes={successfulAttributes} /> 
            : <FailureToast roll={roll} successfulAttributes={successfulAttributes} />,
        duration: 5000,
    });
  }

  const handleGenericRoll = (notation: string) => {
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
    <Card className='border-0 shadow-none'>
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
               <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Atributo</CardTitle>
                  <CardDescription>Clique no d10 para rolar um teste de atributo (menor ou igual).</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {attributeDice.map(die => (
                    <Button key={die} onClick={() => handleAttributeRoll(`1${die}`)} className="h-20 text-xl font-bold">
                      {die.toUpperCase()}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skill" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Teste de Perícia</CardTitle>
                  <CardDescription>Role uma quantidade de d10 para sucessos.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-5 gap-2">
                    {skillDiceCounts.map(count => (
                        <Button key={count} onClick={() => handleGenericRoll(`${count}d10`)} className="font-bold">
                        {count}d10
                        </Button>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-4 min-h-[300px]">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">Última Rolagem</p>
                <p className="text-7xl font-bold text-[var(--page-accent-color)]">
                    {lastRoll ? lastRoll.total : '...'}
                </p>
                {lastRoll && (
                    <div className="text-muted-foreground font-mono">
                        <span className="font-bold text-[var(--page-accent-color)]">{lastRoll.notation}</span>
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
                      <span className="font-mono text-[var(--page-accent-color)]">{r.notation}</span>
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
