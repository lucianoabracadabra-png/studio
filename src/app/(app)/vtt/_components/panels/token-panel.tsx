'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function TokenPanel() {
    return (
        <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Tokens</h3>
            <p className='text-sm text-white/70 mb-4'>Arraste e solte tokens no mapa ou adicione novos.</p>
            <Button className='w-full'>
                <PlusCircle className='mr-2' />
                Adicionar Token
            </Button>
        </div>
    );
}

export default TokenPanel;
