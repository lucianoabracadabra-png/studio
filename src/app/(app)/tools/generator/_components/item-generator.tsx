'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateItemLootAction } from '@/app/actions';
import type { GenerateItemLootOutput } from '@/ai/flows/generate-item-loot';
import { WandSparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const itemSchema = z.object({
  itemType: z.string().min(1, 'O tipo de item é obrigatório.'),
  rarity: z.string().min(1, 'A raridade é obrigatória.'),
  setting: z.string().min(1, 'O cenário é obrigatório.'),
  additionalDetails: z.string().optional(),
});

export function ItemGenerator() {
  const [result, setResult] = useState<GenerateItemLootOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemType: 'Arma',
      rarity: 'Incomum',
      setting: 'Forgotten Realms',
      additionalDetails: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof itemSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateItemLootAction(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Gerar Item',
        description: 'Houve um problema com a geração da IA. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerador de Itens & Tesouros</CardTitle>
        <CardDescription>Crie itens e tesouros únicos para suas campanhas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Item</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione um tipo de item" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weapon">Arma</SelectItem>
                        <SelectItem value="Armor">Armadura</SelectItem>
                        <SelectItem value="Potion">Poção</SelectItem>
                        <SelectItem value="Scroll">Pergaminho</SelectItem>
                        <SelectItem value="Wondrous Item">Item Maravilhoso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raridade</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione a raridade" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Common">Comum</SelectItem>
                        <SelectItem value="Uncommon">Incomum</SelectItem>
                        <SelectItem value="Rare">Raro</SelectItem>
                        <SelectItem value="Very Rare">Muito Raro</SelectItem>
                        <SelectItem value="Legendary">Lendário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cenário de Jogo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Forgotten Realms, Eberron" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes Adicionais</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: feito de escama de dragão, pulsa com uma luz fraca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full font-bold">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Gerando...' : 'Gerar Item'}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg border bg-muted/50 p-4 space-y-4 min-h-[300px]">
            <h3 className="font-semibold text-lg text-center">Item Gerado</h3>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-1/4 mx-auto" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            )}
            {result && (
              <div className="text-center space-y-2 animate-in fade-in-50">
                <h4 className="text-2xl font-bold text-primary">{result.itemName}</h4>
                <p className="text-sm text-accent font-bold">{result.itemValue}</p>
                <p className="text-left text-foreground/80 whitespace-pre-wrap pt-2">{result.itemDescription}</p>
              </div>
            )}
            {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <WandSparkles className="h-12 w-12 mb-4 text-accent" />
                    <p>Seu item mágico aparecerá aqui.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
