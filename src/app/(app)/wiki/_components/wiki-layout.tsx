
'use client';

import { useState } from 'react';
import { type WikiPage, type Portal } from '@/lib/wiki-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WikiLayout({ portal }: { portal: Portal }) {
    const [activePage, setActivePage] = useState<WikiPage>(portal.pages[0]);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6 h-full">
             <header className="animate-in fade-in-down">
                <h1 className="text-4xl font-headline magical-glow">{portal.title}</h1>
                <p className="text-lg text-muted-foreground mt-1">{portal.subtitle}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start animate-in fade-in-up flex-grow">
                <aside className="md:col-span-1 sticky top-6">
                    <nav className="flex flex-col gap-1">
                        {portal.pages.map(page => (
                            <Button
                                key={page.id}
                                variant="ghost"
                                onClick={() => setActivePage(page)}
                                className={cn(
                                    'justify-start text-left h-auto py-2',
                                    activePage.id === page.id ? 'bg-muted/80 text-foreground font-bold' : 'text-muted-foreground'
                                )}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </nav>
                </aside>

                <main className="md:col-span-3">
                    <Card className="glassmorphic-card">
                        <CardHeader>
                            <CardTitle className='font-headline text-2xl'>{activePage.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="font-semibold text-accent">{activePage.summary}</p>
                            <div className="text-foreground/80 space-y-2 whitespace-pre-wrap">
                                <p>{activePage.content}</p>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
