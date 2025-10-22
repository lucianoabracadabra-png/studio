'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { VttState } from '../vtt-layout';

interface LayersPanelProps {
    vttState: VttState;
    setVttState: React.Dispatch<React.SetStateAction<VttState>>;
}

export function LayersPanel({ vttState, setVttState }: LayersPanelProps) {

    const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVttState(prev => ({
            ...prev,
            map: { ...prev.map, url: e.target.value }
        }));
    };
    
    const handleGridToggle = (isGridVisible: boolean) => {
        setVttState(prev => ({
            ...prev,
            layers: { ...prev.layers, isGridVisible }
        }));
    };

    return (
        <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-4">Camadas do Mapa</h3>
            <div className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor="map-url" className='text-white/70'>URL do Fundo do Mapa</Label>
                    <Input 
                        id="map-url" 
                        placeholder="https://exemplo.com/mapa.jpg" 
                        value={vttState.map.url}
                        onChange={handleMapUrlChange}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                    <Label htmlFor="grid-layer" className="font-medium">
                        Camada da Grelha
                    </Label>
                    <Switch id="grid-layer" checked={vttState.layers.isGridVisible} onCheckedChange={handleGridToggle} />
                </div>
                 <p className='text-xs text-center text-white/50 pt-8'>Mais funcionalidades em desenvolvimento.</p>
            </div>
        </div>
    );
}
