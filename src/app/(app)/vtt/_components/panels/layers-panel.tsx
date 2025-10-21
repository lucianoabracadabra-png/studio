'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function LayersPanel() {
    return (
        <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Camadas do Mapa</h3>
            <div className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor="map-url" className='text-white/70'>URL do Fundo do Mapa</Label>
                    <Input id="map-url" placeholder="https://exemplo.com/mapa.jpg" />
                </div>
                 <div className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                    <Label htmlFor="grid-layer" className="font-medium">
                        Camada da Grelha
                    </Label>
                    <Switch id="grid-layer" defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                    <Label htmlFor="drawing-layer" className="font-medium">
                        Camada de Desenho
                    </Label>
                    <Switch id="drawing-layer" defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                    <Label htmlFor="token-layer" className="font-medium">
                        Camada de Tokens
                    </Label>
                    <Switch id="token-layer" defaultChecked />
                </div>
            </div>
        </div>
    )
}
