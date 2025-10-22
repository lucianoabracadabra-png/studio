'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Eye, Brush } from 'lucide-react';

export function FogPanel() {
    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Névoa de Guerra</h3>
            <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Ferramentas de Névoa</p>
                <div className='grid grid-cols-2 gap-2'>
                    <Button variant='outline' className='h-20 flex-col gap-1'>
                        <Eye className='w-6 h-6' />
                        <span className='text-xs'>Revelar Área</span>
                    </Button>
                    <Button variant='outline' className='h-20 flex-col gap-1'>
                        <Brush className='w-6 h-6' />
                        <span className='text-xs'>Pintar Névoa</span>
                    </Button>
                </div>
                <Button variant='destructive' className='w-full'>
                    <Eraser className='mr-2' />
                    Limpar toda a névoa
                </Button>
                 <p className='text-xs text-center text-muted-foreground pt-8'>Funcionalidade em desenvolvimento.</p>
            </div>
        </div>
    );
}
