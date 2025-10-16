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
import { generateNpcAction } from '@/app/actions';
import type { GenerateNpcOutput } from '@/ai/flows/generate-npc';
import { WandSparkles, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const npcSchema = z.object({
  race: z.string().min(1, 'Race is required.'),
  occupation: z.string().min(1, 'Occupation is required.'),
  setting: z.string().min(1, 'Setting is required.'),
  additionalDetails: z.string().optional(),
});

export function NpcGenerator() {
  const [result, setResult] = useState<GenerateNpcOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof npcSchema>>({
    resolver: zodResolver(npcSchema),
    defaultValues: {
      race: 'Human',
      occupation: 'Blacksmith',
      setting: 'A small village in a fantasy world',
      additionalDetails: 'Has a mysterious past.',
    },
  });

  const onSubmit = async (values: z.infer<typeof npcSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateNpcAction(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating NPC',
        description: 'There was a problem with the AI generation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="font-headline">NPC Generator</CardTitle>
        <CardDescription>Create memorable Non-Player Characters for your world.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Elf, Dwarf, Orc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Merchant, Guard, Wizard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Setting</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., High-fantasy kingdom, Sci-fi metropolis" {...field} />
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
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., missing an eye, always humming a tune" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full font-bold">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate NPC'}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg border border-white/10 bg-background/30 p-4 space-y-4 min-h-[300px]">
            <h3 className="font-headline text-xl text-center">Generated NPC</h3>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4 animate-in fade-in-50">
                <h4 className="text-2xl font-headline text-primary text-center">{result.name}</h4>
                <div>
                    <h5 className="font-bold text-accent mb-1">Description</h5>
                    <p className="text-foreground/80 whitespace-pre-wrap">{result.description}</p>
                </div>
                <div>
                    <h5 className="font-bold text-accent mb-1">Backstory</h5>
                    <p className="text-foreground/80 whitespace-pre-wrap">{result.backstory}</p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <User className="h-12 w-12 mb-4 text-accent" />
                    <p>Your generated character will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
