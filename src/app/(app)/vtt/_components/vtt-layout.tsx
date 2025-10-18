'use client';

import React, { useState } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import { VttToolbar } from './vtt-toolbar';

export interface Token {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  position: { x: number; y: number };
}

export interface VttState {
  map: {
    url: string;
    zoom: number;
    position: { x: number, y: number };
    dimensions: { width: number; height: number };
  };
  tokens: Token[];
}

const initialMapState = {
  url: 'https://images.unsplash.com/photo-1593369687981-b01c3a611916?q=80&w=2560&h=1440&fit=crop',
  zoom: 0.5,
  position: { x: 0, y: 0 },
  dimensions: { width: 2560, height: 1440 }
}

export function VttLayout() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [mapState, setMapState] = useState(initialMapState);

  const handleZoom = (newZoom: number) => {
    setMapState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(3, newZoom)) }));
  };

  const centerMap = () => {
    setMapState(prev => ({
        ...prev,
        position: {x: 0, y: 0 },
        zoom: 0.5
    }))
  };

  return (
    <div className="w-full h-full flex bg-black">
      <div className="flex-grow h-full relative">
        <MapCanvas 
          tokens={tokens}
          setTokens={setTokens}
          mapState={mapState}
          setMapState={setMapState}
        />
        <VttToolbar 
          onZoomIn={() => handleZoom(mapState.zoom * 1.2)}
          onZoomOut={() => handleZoom(mapState.zoom / 1.2)}
          onCenter={centerMap}
          zoomLevel={mapState.zoom}
        />
      </div>
      <VttSidebar
        tokens={tokens}
        setTokens={setTokens}
      />
    </div>
  );
}
