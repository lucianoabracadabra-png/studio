'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export function CombatPanel() {
    return (
        <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Rastreador de Combate</h3>
            <p className='text-sm text-center text-white/50 py-8'>O rastreador de combate está em desenvolvimento.</p>
            <div className='flex gap-2 justify-center'>
                 <Button variant='outline'><Play /></Button>
                 <Button variant='outline'><SkipForward /></Button>
                 <Button variant='destructive' className='text-white'><RotateCcw /></Button>
            </div>
        </div>
    );
}
