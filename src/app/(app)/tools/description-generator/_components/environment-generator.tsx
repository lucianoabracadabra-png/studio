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
  environmentType: z.string().min(1, 'Environment type is required.'),
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
      environmentType: 'Forest',
      style: 'Mystical and ancient',
      additionalDetails: 'During a full moon.',
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
        title: 'Error Generating Description',
        description: 'There was a problem with the AI generation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="font-headline">Environment Describer</CardTitle>
        <CardDescription>Generate rich, atmospheric descriptions for your game world.</CardDescription>
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
                    <FormLabel>Environment Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dungeon, City, Forest" {...field} />
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
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ruined, Cyberpunk, Mystical" {...field} />
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
                      <Textarea placeholder="e.g., Covered in snow, during a festival" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full font-bold">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Describing...' : 'Describe Scene'}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg border border-white/10 bg-background/30 p-4 space-y-4 min-h-[300px]">
            <h3 className="font-headline text-xl text-center">Generated Description</h3>
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
                    <p>Your generated description will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
