'use client';

import React, { useState } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import type { PanInfo } from 'framer-motion';

export type TokenShape = 'circle' | 'square';
export type TokenType = 'hero' | 'enemy';
export type VttTool = 'select' | 'measure' | 'fog' | 'draw' | 'ping';
export type Point = { x: number, y: number };

export interface Token {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  position: Point;
  shape: TokenShape;
  type: TokenType;
}

export interface VttState {
  map: {
    url: string;
    zoom: number;
    position: Point;
    dimensions: { width: number; height: number };
  };
  tokens: Token[];
  layers: {
    isFogOfWarActive: boolean;
    isLightLayerActive: boolean;
    isGridVisible: boolean;
  };
  combat: {
    turnOrder: number[];
    activeTurnIndex: number;
  };
  ui: {
    activeTool: VttTool;
  };
  drawing: {
    points: Point[];
    distance: number;
  }
}

const initialVttState: VttState = {
  map: {
    url: '',
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
  },
  drawing: {
    points: [],
    distance: 0,
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

  const setDrawingPoints = (updater: React.SetStateAction<Point[]>) => {
    setVttState(prev => ({...prev, drawing: { ...prev.drawing, points: typeof updater === 'function' ? updater(prev.drawing.points) : updater }}));
  };

  const setDrawingDistance = (updater: React.SetStateAction<number>) => {
    setVttState(prev => ({...prev, drawing: { ...prev.drawing, distance: typeof updater === 'function' ? updater(prev.drawing.distance) : updater }}));
  };
  
  const setActiveTool = (tool: VttTool) => {
      setVttState(prev => ({ ...prev, ui: { ...prev.ui, activeTool: tool }}));
  }

  const handleTokenDragEnd = (id: number, info: PanInfo) => {
    setTokens(currentTokens => {
      const tokenIndex = currentTokens.findIndex(t => t.id === id);
      if (tokenIndex === -1) return currentTokens;

      const updatedToken = {
        ...currentTokens[tokenIndex],
        position: {
          x: currentTokens[tokenIndex].position.x + info.offset.x / vttState.map.zoom,
          y: currentTokens[tokenIndex].position.y + info.offset.y / vttState.map.zoom,
        },
      };
      
      const newTokens = [...currentTokens];
      newTokens[tokenIndex] = updatedToken;
      return newTokens;
    });
  };

  return (
    <div className="w-full h-full grid grid-cols-[1fr_auto] bg-black">
      <div className="flex-grow h-full relative">
        <MapCanvas 
          tokens={vttState.tokens}
          activeTokenId={vttState.combat.turnOrder[vttState.combat.activeTurnIndex]}
          onTokenDragEnd={handleTokenDragEnd}
          mapState={vttState.map}
          setMapState={setMapState}
          activeTool={vttState.ui.activeTool}
          layers={vttState.layers}
          drawingPoints={vttState.drawing.points}
          setDrawingPoints={setDrawingPoints}
          drawingDistance={vttState.drawing.distance}
          setDrawingDistance={setDrawingDistance}
        />
      </div>
      <VttSidebar
        vttState={vttState}
        setTokens={setTokens}
        setMapState={setMapState}
        setLayers={setLayers}
        setCombat={setCombat}
        onToolSelect={setActiveTool}
        onZoomIn={() => handleZoom(vttState.map.zoom * 1.2)}
        onZoomOut={() => handleZoom(vttState.map.zoom / 1.2)}
        onCenter={centerMap}
      />
    </div>
  );
}
