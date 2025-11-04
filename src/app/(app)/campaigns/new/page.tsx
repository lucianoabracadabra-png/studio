'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { WandSparkles, Loader2, Upload } from 'lucide-react';
import { processSessionAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

const createCampaignSchema = z.object({
  transcript: z.string().min(100, { message: "A transcrição deve ter pelo menos 100 caracteres." }),
});

export default function CreateCampaignPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof createCampaignSchema>>({
        resolver: zodResolver(createCampaignSchema),
        defaultValues: {
            transcript: "",
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                form.setValue('transcript', text);
            };
            reader.readAsText(file);
        } else {
            toast({
                variant: 'destructive',
                title: 'Ficheiro Inválido',
                description: 'Por favor, selecione um ficheiro .txt',
            });
        }
    };
    
    const onSubmit = async (values: z.infer<typeof createCampaignSchema>) => {
        setIsLoading(true);
        toast({
            title: 'Processando Sessão...',
            description: 'A IA está a forjar a sua campanha. Isto pode demorar um momento.',
        });

        try {
            const result = await processSessionAction(values);
            
            // Em um app real, aqui você salvaria o resultado (incluindo a URL da imagem)
            // em seu banco de dados e então redirecionaria.
            // Por enquanto, vamos armazenar em localStorage para demonstração.
            
            const newCampaignId = `session-${Date.now()}`;
            const newCampaignData = {
                id: newCampaignId,
                ...result,
            };

            // Idealmente, chamaríamos uma action para salvar isso no servidor.
            // console.log("Generated Campaign Data:", newCampaignData);

            toast({
                title: 'Campanha Criada com Sucesso!',
                description: `A sessão "${result.title}" foi gerada.`,
            });
            
            // Guardar no localStorage para o exemplo
            const existingSessions = JSON.parse(localStorage.getItem('generatedSessions') || '[]');
            localStorage.setItem('generatedSessions', JSON.stringify([...existingSessions, newCampaignData]));

            router.push(`/campaigns/${newCampaignId}`);

        } catch (error) {
            console.error("Erro ao processar a sessão:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Criar Campanha',
                description: 'A IA encontrou um obstáculo. Por favor, tente novamente.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold">Criar Nova Campanha</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Transcrever Sessão</CardTitle>
                    <CardDescription>
                        Envie um ficheiro .txt ou cole a transcrição da sua última sessão. A nossa IA irá criar um resumo detalhado da campanha.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                             <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="transcript-file" className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary">
                                        <Upload className="h-5 w-5" />
                                        <span>Ou carregue um ficheiro .txt</span>
                                    </Label>
                                    <Input id="transcript-file" type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="transcript"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transcrição da Sessão</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Cole aqui a transcrição completa da sua sessão de RPG..."
                                                    className="min-h-[300px] text-base"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full font-bold text-lg py-6">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        A Forjar Lendas...
                                    </>
                                ) : (
                                    <>
                                        <WandSparkles className="mr-2 h-5 w-5" />
                                        Gerar Campanha
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
