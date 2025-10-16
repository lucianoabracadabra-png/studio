
'use client';

import { useState } from 'react';
import { type WikiPage } from '@/lib/wiki-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WikiLayout({ pages }: { pages: WikiPage[] }) {
    const [activePage, setActivePage] = useState<WikiPage>(pages[0]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start animate-in fade-in-up">
            <aside className="md:col-span-1 sticky top-6">
                <nav className="flex flex-col gap-1">
                    {pages.map(page => (
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
    );
}
