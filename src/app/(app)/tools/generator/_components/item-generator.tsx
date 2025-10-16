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
  itemType: z.string().min(1, 'Item type is required.'),
  rarity: z.string().min(1, 'Rarity is required.'),
  setting: z.string().min(1, 'Setting is required.'),
  additionalDetails: z.string().optional(),
});

export function ItemGenerator() {
  const [result, setResult] = useState<GenerateItemLootOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemType: 'Weapon',
      rarity: 'Uncommon',
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
        title: 'Error Generating Item',
        description: 'There was a problem with the AI generation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="font-headline">Item & Loot Generator</CardTitle>
        <CardDescription>Create unique items and loot for your campaigns.</CardDescription>
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
                    <FormLabel>Item Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an item type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weapon">Weapon</SelectItem>
                        <SelectItem value="Armor">Armor</SelectItem>
                        <SelectItem value="Potion">Potion</SelectItem>
                        <SelectItem value="Scroll">Scroll</SelectItem>
                        <SelectItem value="Wondrous Item">Wondrous Item</SelectItem>
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
                    <FormLabel>Rarity</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select rarity" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Common">Common</SelectItem>
                        <SelectItem value="Uncommon">Uncommon</SelectItem>
                        <SelectItem value="Rare">Rare</SelectItem>
                        <SelectItem value="Very Rare">Very Rare</SelectItem>
                        <SelectItem value="Legendary">Legendary</SelectItem>
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
                    <FormLabel>Game Setting</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Forgotten Realms, Eberron" {...field} />
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
                      <Textarea placeholder="e.g., made of dragonscale, pulses with faint light" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full font-bold">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Item'}
              </Button>
            </form>
          </Form>
          <div className="rounded-lg border border-white/10 bg-background/30 p-4 space-y-4 min-h-[300px]">
            <h3 className="font-headline text-xl text-center">Generated Item</h3>
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
                <h4 className="text-2xl font-headline text-primary">{result.itemName}</h4>
                <p className="text-sm text-accent font-bold">{result.itemValue}</p>
                <p className="text-left text-foreground/80 whitespace-pre-wrap pt-2">{result.itemDescription}</p>
              </div>
            )}
            {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <WandSparkles className="h-12 w-12 mb-4 text-accent" />
                    <p>Your magical item will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
