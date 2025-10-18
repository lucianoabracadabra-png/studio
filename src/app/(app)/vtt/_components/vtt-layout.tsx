'use client';

import React, { useState } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import { VttToolbar } from './vtt-toolbar';

export type TokenShape = 'circle' | 'square';

export interface Token {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  position: { x: number; y: number };
  shape: TokenShape;
}

export interface VttState {
  map: {
    url: string;
    zoom: number;
    position: { x: number, y: number };
    dimensions: { width: number; height: number };
  };
  tokens: {
    heroes: Token[];
    enemies: Token[];
  };
  layers: {
    isFogOfWarActive: boolean;
    isLightLayerActive: boolean;
  }
}

const initialVttState: VttState = {
  map: {
    url: 'https://images.unsplash.com/photo-1593369687981-b01c3a611916?q=80&w=2560&h=1440&fit=crop',
    zoom: 0.5,
    position: { x: 0, y: 0 },
    dimensions: { width: 2560, height: 1440 }
  },
  tokens: {
    heroes: [],
    enemies: [],
  },
  layers: {
    isFogOfWarActive: false,
    isLightLayerActive: false,
  }
};

export function VttLayout() {
  const [vttState, setVttState] = useState<VttState>(initialVttState);

  const handleZoom = (newZoom: number) => {
    setVttState(prev => ({ ...prev, map: {...prev.map, zoom: Math.max(0.1, Math.min(3, newZoom))} }));
  };

  const centerMap = () => {
    setVttState(prev => ({
        ...prev,
        map: {
            ...prev.map,
            position: {x: 0, y: 0 },
            zoom: 0.5
        }
    }))
  };

  const setTokens = (updater: React.SetStateAction<VttState['tokens']>) => {
    setVttState(prev => ({
      ...prev,
      tokens: typeof updater === 'function' ? updater(prev.tokens) : updater,
    }));
  }

  const setMapState = (updater: React.SetStateAction<VttState['map']>) => {
     setVttState(prev => ({
      ...prev,
      map: typeof updater === 'function' ? updater(prev.map) : updater,
    }));
  }

  const setLayers = (updater: React.SetStateAction<VttState['layers']>) => {
    setVttState(prev => ({
      ...prev,
      layers: typeof updater === 'function' ? updater(prev.layers) : updater,
    }));
  }

  const allTokens = [...vttState.tokens.heroes, ...vttState.tokens.enemies];

  const handleTokenDragEnd = (id: number, newPosition: { x: number; y: number }) => {
    setTokens(prevTokens => {
      return {
        heroes: prevTokens.heroes.map(token =>
          token.id === id ? { ...token, position: newPosition } : token
        ),
        enemies: prevTokens.enemies.map(token =>
          token.id === id ? { ...token, position: newPosition } : token
        ),
      }
    });
  };

  return (
    <div className="w-full h-full flex bg-black">
      <div className="flex-grow h-full relative">
        <MapCanvas 
          tokens={allTokens}
          onTokenDragEnd={handleTokenDragEnd}
          mapState={vttState.map}
          setMapState={setMapState}
        />
        <VttToolbar 
          onZoomIn={() => handleZoom(vttState.map.zoom * 1.2)}
          onZoomOut={() => handleZoom(vttState.map.zoom / 1.2)}
          onCenter={centerMap}
          zoomLevel={vttState.map.zoom}
        />
      </div>
      <VttSidebar
        vttState={vttState}
        setTokens={setTokens}
        setMapState={setMapState}
        setLayers={setLayers}
      />
    </div>
  );
}
