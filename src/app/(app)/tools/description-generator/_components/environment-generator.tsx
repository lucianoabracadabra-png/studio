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
import { generateEnvironmentDescriptionAction } from '@/app/actions';
import type { GenerateEnvironmentDescriptionOutput } from '@/ai/flows/generate-environment-description';
import { WandSparkles, Mountain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const environmentSchema = z.object({
  environmentType: z.string().min(1, 'O tipo de ambiente é obrigatório.'),
  style: z.string().optional(),
  additionalDetails: z.string().optional(),
});

export function EnvironmentGenerator() {
  const [result, setResult] = useState<GenerateEnvironmentDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof environmentSchema>>({
    resolver: zodResolver(environmentSchema),
    defaultValues: {
      environmentType: 'Floresta',
      style: 'Mística e antiga',
      additionalDetails: 'Durante a lua cheia.',
    },
  });

  const onSubmit = async (values: z.infer<typeof environmentSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateEnvironmentDescriptionAction(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Gerar Descrição',
        description: 'Houve um problema com a geração da IA. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Descritor de Ambientes</CardTitle>
        <CardDescription>Gere descrições ricas e atmosféricas para o seu mundo de jogo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="environmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ambiente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Masmorra, Cidade, Floresta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Arruinado, Cyberpunk, Místico" {...field} />
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
                      <Textarea placeholder="Ex: Coberto de neve, durante um festival" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full font-bold">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Descrevendo...' : 'Descrever Cena'}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg border bg-muted/50 p-4 space-y-4 min-h-[300px]">
            <h3 className="font-semibold text-lg text-center">Descrição Gerada</h3>
            {isLoading && (
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {result && (
              <div className="animate-in fade-in-50">
                <p className="text-foreground/80 whitespace-pre-wrap">{result.description}</p>
              </div>
            )}
            {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <Mountain className="h-12 w-12 mb-4 text-accent" />
                    <p>Sua descrição gerada aparecerá aqui.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
