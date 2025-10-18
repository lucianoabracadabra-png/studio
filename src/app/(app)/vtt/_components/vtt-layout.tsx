'use client';

import React, { useState, useMemo } from 'react';
import { MapCanvas } from './map-canvas';
import { VttSidebar } from './vtt-sidebar';
import { VttToolbar, type VttTool } from './vtt-toolbar';

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
  },
  combat: {
    turnOrder: [],
    activeTurnIndex: 0,
  },
  ui: {
    activeTool: 'select',
  }
};

export function VttLayout() {
  const [vttState, setVttState] = useState<VttState>(initialVttState);

  const allTokens = useMemo(() => 
    [...vttState.tokens.heroes, ...vttState.tokens.enemies], 
    [vttState.tokens.heroes, vttState.tokens.enemies]
  );
  
  const combatants = useMemo(() => 
    vttState.combat.turnOrder.map(id => allTokens.find(t => t.id === id)).filter(Boolean) as Token[],
    [vttState.combat.turnOrder, allTokens]
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
        const allNewTokenIds = [...newTokens.heroes, ...newTokens.enemies].map(t => t.id);
        
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
    setVttState(prev => ({
      ...prev,
      combat: typeof updater === 'function' ? updater(prev.combat) : updater,
    }));
  }
  
  const setActiveTool = (tool: VttTool) => {
      setVttState(prev => ({ ...prev, ui: { ...prev.ui, activeTool: tool }}));
  }

  const handleTokenDragEnd = (id: number, newPosition: { x: number; y: number }) => {
    const map = vttState.map;
    // Adjust position based on map pan and zoom to get absolute position on the canvas
    const absoluteX = (newPosition.x - map.position.x) / map.zoom;
    const absoluteY = (newPosition.y - map.position.y) / map.zoom;

    setTokens(prevTokens => {
      return {
        heroes: prevTokens.heroes.map(token =>
          token.id === id ? { ...token, position: { x: absoluteX, y: absoluteY } } : token
        ),
        enemies: prevTokens.enemies.map(token =>
          token.id === id ? { ...token, position: { x: absoluteX, y: absoluteY } } : token
        ),
      }
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
          tokens={allTokens}
          activeTokenId={activeCombatantId}
          onTokenDragEnd={handleTokenDragEnd}
          mapState={vttState.map}
          setMapState={setMapState}
          activeTool={vttState.ui.activeTool}
        />
      </div>
      <VttSidebar
        vttState={vttState}
        setTokens={setTokens}
        setMapState={setMapState}
        setLayers={setLayers}
        setCombat={setCombat}
        allTokens={allTokens}
        combatants={combatants}
      />
    </div>
  );
}
