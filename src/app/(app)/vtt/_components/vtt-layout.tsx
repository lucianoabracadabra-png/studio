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
    activeCombatantId: number | null;
  };
  drawing: {
    activeTool: DrawingToolType | null;
    options: DrawingOptions;
    shapes: Shape[];
  };
}

const initialVttState: VttState = {
  map: {
    url: '/maps/fantasy-map-1.jpg',
    zoom: 0.5,
    position: { x: 0, y: 0 },
    dimensions: { width: 2560, height: 1440 }
  },
  tokens: [
      { id: 1, name: 'Player 1', imageUrl: '/tokens/token-1.png', color: '#3b82f6', position: { x: 600, y: 800 }, shape: 'circle', type: 'hero' },
      { id: 2, name: 'Goblin A', imageUrl: '/tokens/token-2.png', color: '#ef4444', position: { x: 800, y: 750 }, shape: 'square', type: 'enemy' },
      { id: 3, name: 'Orc Leader', imageUrl: '/tokens/token-3.png', color: '#eab308', position: { x: 700, y: 650 }, shape: 'square', type: 'enemy' },
  ],
  layers: {
    isFogOfWarActive: false,
    isLightLayerActive: false,
    isGridVisible: true,
  },
  combat: {
    turnOrder: [],
    activeCombatantId: null,
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
  const [activeToolbar, setActiveToolbar] = useState<VttTool | null>(null);

  const handleToolToggle = (tool: VttTool) => {
    setActiveToolbar(prev => {
        const newTool = prev === tool ? null : tool;
        // Se o novo painel NÃO for o de desenho, desativamos qualquer ferramenta de desenho ativa.
        if (newTool !== 'drawing') {
            setVttState(s => ({ ...s, drawing: { ...s.drawing, activeTool: null } }));
        }
        return newTool;
    });
  };

  const setVttPart = <K extends keyof VttState>(key: K, updater: React.SetStateAction<VttState[K]>) => {
    setVttState(prev => ({
      ...prev,
      [key]: typeof updater === 'function' ? (updater as (prevState: VttState[K]) => VttState[K])(prev[key]) : updater,
    }));
  }

  const handleAddShape = (draftShape: DraftShape) => {
    const completeShape: Shape = {
      ...draftShape,
      id: Date.now().toString(),
    };
    setVttPart('drawing', prev => ({ ...prev, shapes: [...prev.shapes, completeShape]}));
  }

  const handleTokenDragEnd = (id: number, info: PanInfo) => {
    setVttPart('tokens', currentTokens => {
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
  
  const isMapInteractionEnabled = activeToolbar === null || (activeToolbar === 'drawing' && vttState.drawing.activeTool === null);

  return (
    <div className="w-full h-full bg-black relative">
      <VttToolbar activeTool={activeToolbar} onToolToggle={handleToolToggle} />
      
      <ToolPanelContainer 
        activeTool={activeToolbar} 
        vttState={vttState}
        setVttState={setVttState}
      />

      <MapCanvas 
        tokens={vttState.tokens}
        activeTokenId={vttState.combat.activeCombatantId}
        onTokenDragEnd={handleTokenDragEnd}
        mapState={vttState.map}
        setMapState={(updater) => setVttPart('map', updater)}
        layers={vttState.layers}
        drawingState={vttState.drawing}
        onAddShape={handleAddShape}
        isPanEnabled={isMapInteractionEnabled}
        isTokenInteractionEnabled={isMapInteractionEnabled}
      />
    </div>
  );
}
