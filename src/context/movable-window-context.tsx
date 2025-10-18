'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Item = {
  id: string;
  title: string;
  content: ReactNode;
};

type MovableWindowState = {
  isManagerOpen: boolean;
  activeItems: Item[];
  position: { x: number; y: number };
};

type MovableWindowContextType = {
  openItem: (item: Item) => void;
  closeItem: (itemId: string) => void;
  openAllEquipped: (items: Item[]) => void;
  isItemOpen: (itemId: string) => boolean;
  closeManager: () => void;
  setPosition: (position: { x: number; y: number }) => void;
} & MovableWindowState;

const MovableWindowContext = createContext<MovableWindowContextType | undefined>(undefined);

export const MovableWindowProvider = ({ children }: { children: ReactNode }) => {
  const [windowState, setWindowState] = useState<MovableWindowState>({
    isManagerOpen: false,
    activeItems: [],
    position: { x: 300, y: 100 },
  });

  const setPosition = (position: { x: number; y: number }) => {
    setWindowState(prev => ({ ...prev, position }));
  };

  const openItem = (item: Item) => {
    setWindowState(prev => {
      const itemExists = prev.activeItems.some(i => i.id === item.id);
      if (itemExists) {
        // If item is already open, maybe close it or just bring to front (not implemented)
        return { ...prev, isManagerOpen: true };
      }
      return {
        ...prev,
        isManagerOpen: true,
        activeItems: [...prev.activeItems, item],
      };
    });
  };

  const closeItem = (itemId: string) => {
    setWindowState(prev => {
      const updatedItems = prev.activeItems.filter(i => i.id !== itemId);
      return {
        ...prev,
        activeItems: updatedItems,
        isManagerOpen: updatedItems.length > 0, // Close manager if no items are left
      };
    });
  };

  const openAllEquipped = (items: Item[]) => {
     setWindowState(prev => ({
        ...prev,
        isManagerOpen: true,
        activeItems: items,
     }));
  };

  const closeManager = () => {
    setWindowState(prev => ({...prev, isManagerOpen: false, activeItems: [] }));
  };

  const isItemOpen = (itemId: string): boolean => {
    return windowState.activeItems.some(i => i.id === itemId);
  };


  return (
    <MovableWindowContext.Provider value={{ 
        ...windowState, 
        openItem, 
        closeItem,
        openAllEquipped,
        isItemOpen,
        closeManager,
        setPosition 
    }}>
      {children}
    </MovableWindowContext.Provider>
  );
};

export const useMovableWindow = () => {
  const context = useContext(MovableWindowContext);
  if (context === undefined) {
    throw new Error('useMovableWindow must be used within a MovableWindowProvider');
  }
  return context;
};
