'use client';

import React, { useState } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import { VttToolbar } from './vtt-toolbar';
import { PanInfo } from 'framer-motion';

export type TokenShape = 'circle' | 'square';
export type TokenType = 'hero' | 'enemy';
export type VttTool = 'select' | 'measure' | 'fog' | 'draw' | 'ping';

export interface Token {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  position: { x: number; y: number };
  shape: TokenShape;
  type: TokenType;
}

export interface VttState {
  map: {
    url: string;
    zoom: number;
    position: { x: number, y: number };
    dimensions: { width: number; height: number };
  };
  tokens: Token[];
  layers: {
    isFogOfWarActive: boolean;
    isLightLayerActive: boolean;
    isGridVisible: boolean;
  };
  combat: {
    turnOrder: number[]; // Array of token ids
    activeTurnIndex: number;
  },
  ui: {
    activeTool: VttTool;
  }
}

const initialVttState: VttState = {
  map: {
    url: '', // Empty to use the CSS texture by default
    zoom: 0.5,
    position: { x: 0, y: 0 },
    dimensions: { width: 2560, height: 1440 }
  },
  tokens: [],
  layers: {
    isFogOfWarActive: false,
    isLightLayerActive: false,
    isGridVisible: true,
  },
  combat: {
    turnOrder: [],
    activeTurnIndex: -1,
  },
  ui: {
    activeTool: 'select',
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
    setVttState(prev => ({ ...prev, tokens: typeof updater === 'function' ? updater(prev.tokens) : updater }));
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
  
  const setCombat = (updater: React.SetStateAction<VttState['combat']>) => {
    setVttState(prev => ({ ...prev, combat: typeof updater === 'function' ? updater(prev.combat) : updater }));
  }
  
  const setActiveTool = (tool: VttTool) => {
      setVttState(prev => ({ ...prev, ui: { ...prev.ui, activeTool: tool }}));
  }

  const handleTokenDragEnd = (id: number, info: PanInfo, initialPosition: { x: number; y: number }) => {
    const mapZoom = vttState.map.zoom;
    const newX = initialPosition.x + info.offset.x / mapZoom;
    const newY = initialPosition.y + info.offset.y / mapZoom;

    setTokens(prevTokens => {
      return prevTokens.map(token =>
          token.id === id ? { ...token, position: { x: newX, y: newY } } : token
        )
    });
  };

  return (
    <div className="w-full h-full grid grid-cols-[auto_1fr_auto] bg-black">
      <VttToolbar 
        activeTool={vttState.ui.activeTool}
        onToolSelect={setActiveTool}
        onZoomIn={() => handleZoom(vttState.map.zoom * 1.2)}
        onZoomOut={() => handleZoom(vttState.map.zoom / 1.2)}
        onCenter={centerMap}
        zoomLevel={vttState.map.zoom}
      />
      <div className="flex-grow h-full relative">
        <MapCanvas 
          tokens={vttState.tokens}
          activeTokenId={vttState.combat.turnOrder[vttState.combat.activeTurnIndex]}
          onTokenDragEnd={handleTokenDragEnd}
          mapState={vttState.map}
          setMapState={setMapState}
          activeTool={vttState.ui.activeTool}
          layers={vttState.layers}
        />
      </div>
      <VttSidebar
        vttState={vttState}
        setTokens={setTokens}
        setMapState={setMapState}
        setLayers={setLayers}
        setCombat={setCombat}
        isCollapsed={false} // This can be managed by a state if needed
        activeTool={vttState.ui.activeTool}
        onToolSelect={setActiveTool}
        onZoomIn={() => handleZoom(vttState.map.zoom * 1.2)}
        onZoomOut={() => handleZoom(vttState.map.zoom / 1.2)}
        onCenter={centerMap}
        zoomLevel={vttState.map.zoom}
      />
    </div>
  );
}
