'use client';

import React, { useState } from 'react';
import { MapCanvas } from './map-canvas';
import { VttToolbar, VttTool } from './vtt-toolbar';
import { ToolPanelContainer } from './tool-panel-container';
import type { PanInfo } from 'framer-motion';
import type { Shape, DraftShape } from './drawing-layer';

// Core Types
export type Point = { x: number, y: number };

// Token Types
export type TokenShape = 'circle' | 'square';
export type TokenType = 'hero' | 'enemy';
export interface Token {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  position: Point;
  shape: TokenShape;
  type: TokenType;
}

// Drawing Types
export type DrawingToolType = 'circle' | 'square' | 'cone' | 'freehand' | 'ruler';
export interface DrawingOptions {
    color: string;
    fill: boolean;
    strokeWidth: number;
}

// VTT State
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
  drawing: {
    activeTool: DrawingToolType | null;
    options: DrawingOptions;
    shapes: Shape[];
  };
}

const initialVttState: VttState = {
  map: {
    url: '',
    zoom: 0.5,
    position: { x: 0, y: 0 },
    dimensions: { width: 2560, height: 1440 }
  },
  tokens: [
      { id: 1, name: 'Player 1', imageUrl: '/tokens/token-1.png', color: '#3b82f6', position: { x: 600, y: 800 }, shape: 'circle', type: 'hero' },
      { id: 2, name: 'Goblin A', imageUrl: '/tokens/token-2.png', color: '#ef4444', position: { x: 800, y: 750 }, shape: 'square', type: 'enemy' },
  ],
  layers: {
    isFogOfWarActive: false,
    isLightLayerActive: false,
    isGridVisible: true,
  },
  combat: {
    turnOrder: [],
    activeTurnIndex: -1,
  },
  drawing: {
    activeTool: null,
    options: {
        color: '#ff0000',
        fill: false,
        strokeWidth: 3,
    },
    shapes: [],
  }
};

export function VttLayout() {
  const [vttState, setVttState] = useState<VttState>(initialVttState);
  const [activeTool, setActiveTool] = useState<VttTool | null>('select'); // Default to select

  const handleToolToggle = (tool: VttTool) => {
    setActiveTool(prev => prev === tool ? null : tool);
    if (tool !== 'drawing') {
      setDrawing(prev => ({ ...prev, activeTool: null }));
    }
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

  const setDrawing = (updater: React.SetStateAction<VttState['drawing']>) => {
    setVttState(prev => ({ ...prev, drawing: typeof updater === 'function' ? updater(prev.drawing) : updater }));
  }
  
  const handleAddShape = (draftShape: DraftShape) => {
    const { zoom } = vttState.map;
    const completeShape: Shape = {
      ...draftShape,
      id: Date.now().toString(),
      points: draftShape.points.map(p => ({ x: p.x / zoom, y: p.y / zoom })),
    };
    setDrawing(prev => ({ ...prev, shapes: [...prev.shapes, completeShape]}));
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
    <div className="w-full h-full bg-black relative">
      <VttToolbar activeTool={activeTool} onToolToggle={handleToolToggle} />
      <ToolPanelContainer 
        activeTool={activeTool} 
        drawingState={vttState.drawing}
        setDrawingState={setDrawing}
      />
      <MapCanvas 
        tokens={vttState.tokens}
        activeTokenId={vttState.combat.turnOrder[vttState.combat.activeTurnIndex]}
        onTokenDragEnd={handleTokenDragEnd}
        mapState={vttState.map}
        setMapState={setMapState}
        layers={vttState.layers}
        drawingState={vttState.drawing}
        onAddShape={handleAddShape}
        activeTool={activeTool}
      />
    </div>
  );
}
