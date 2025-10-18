'use client';

import React, { useState, useMemo } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import { VttToolbar, type VttTool } from './vtt-toolbar';
import { PanInfo } from 'framer-motion';

export type TokenShape = 'circle' | 'square';
export type TokenType = 'hero' | 'enemy';

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
    url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f5de?q=80&w=2560&h=1440&fit=crop',
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

  const combatants = useMemo(() => 
    vttState.combat.turnOrder.map(id => vttState.tokens.find(t => t.id === id)).filter(Boolean) as Token[],
    [vttState.combat.turnOrder, vttState.tokens]
  );
  
  const activeCombatantId = combatants[vttState.combat.activeTurnIndex]?.id;

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
    setVttState(prev => {
        const newTokens = typeof updater === 'function' ? updater(prev.tokens) : updater;
        const allNewTokenIds = newTokens.map(t => t.id);
        
        return {
            ...prev,
            tokens: newTokens,
            combat: {
                ...prev.combat,
                turnOrder: prev.combat.turnOrder.filter(id => allNewTokenIds.includes(id)),
            }
        };
    });
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
    setVttState(prev => {
        const newCombat = typeof updater === 'function' ? updater(prev.combat) : updater;
        // Ensure activeTurnIndex is valid
        if (newCombat.turnOrder.length === 0) {
            newCombat.activeTurnIndex = -1;
        } else if (newCombat.activeTurnIndex >= newCombat.turnOrder.length) {
            newCombat.activeTurnIndex = 0;
        } else if (newCombat.activeTurnIndex < 0) {
            newCombat.activeTurnIndex = 0;
        }
        return { ...prev, combat: newCombat };
    });
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
    <div className="w-full h-full flex bg-black">
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
          activeTokenId={activeCombatantId}
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
        combatants={combatants}
      />
    </div>
  );
}
