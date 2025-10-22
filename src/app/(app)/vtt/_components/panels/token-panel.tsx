'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function TokenPanel() {
    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Tokens</h3>
            <p className='text-sm text-muted-foreground mb-4'>Arraste e solte tokens no mapa ou adicione novos.</p>
            <Button className='w-full'>
                <PlusCircle className='mr-2' />
                Adicionar Token
            </Button>
            <div className='text-center py-8 text-muted-foreground text-sm'>
                <p>Biblioteca de tokens em desenvolvimento.</p>
            </div>
        </div>
    );
}
