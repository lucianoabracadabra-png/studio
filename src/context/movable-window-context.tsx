'use client';

import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';

type Item = {
  id: string;
  title: string;
  content: ReactNode;
};

type MovableWindowState = {
  isManagerOpen: boolean;
  isMinimized: boolean;
  activeItems: Item[];
  position: { x: number; y: number };
};

type MovableWindowContextType = {
  openItem: (item: Item) => void;
  closeItem: (itemId: string) => void;
  openAllEquipped: (items: Item[]) => void;
  isItemOpen: (itemId: string) => boolean;
  closeManager: () => void;
  minimizeManager: () => void;
  restoreManager: () => void;
  setPosition: (position: { x: number; y: number }) => void;
} & Omit<MovableWindowState, 'isMinimized'> & { isManagerMinimized: boolean };


const MovableWindowContext = createContext<MovableWindowContextType | undefined>(undefined);

export const MovableWindowProvider = ({ children }: { children: ReactNode }) => {
  const [windowState, setWindowState] = useState<MovableWindowState>({
    isManagerOpen: false,
    isMinimized: false,
    activeItems: [],
    position: { x: 0, y: 0 },
  });
  
  const lastPosition = useRef({ x: 0, y: 0 });

  // Set initial position only on the client
  useEffect(() => {
    const initialPos = { x: window.innerWidth - 420, y: 100 };
    setWindowState(prev => ({
      ...prev,
      position: initialPos,
    }));
    lastPosition.current = initialPos;
  }, []);


  const setPosition = (position: { x: number; y: number }) => {
    setWindowState(prev => {
        if (!prev.isMinimized) {
            lastPosition.current = position;
        }
        return { ...prev, position };
    });
  };

  const openItem = (item: Item) => {
    setWindowState(prev => {
      const itemExists = prev.activeItems.some(i => i.id === item.id);
      if (itemExists) {
        return { ...prev, isManagerOpen: true, isMinimized: false };
      }
      return {
        ...prev,
        isManagerOpen: true,
        isMinimized: false,
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
        isManagerOpen: updatedItems.length > 0,
        isMinimized: updatedItems.length > 0 ? prev.isMinimized : false,
      };
    });
  };

  const openAllEquipped = (items: Item[]) => {
     setWindowState(prev => ({
        ...prev,
        isManagerOpen: true,
        isMinimized: false,
        activeItems: items,
     }));
  };

  const closeManager = () => {
    setWindowState(prev => ({...prev, isManagerOpen: false, isMinimized: false, activeItems: [] }));
  };

  const minimizeManager = () => {
    setWindowState(prev => {
        if (!prev.isMinimized) {
            lastPosition.current = prev.position;
        }
        return {...prev, isMinimized: true }
    });
  };

  const restoreManager = () => {
    setWindowState(prev => ({...prev, isMinimized: false, position: lastPosition.current }));
  };

  const isItemOpen = (itemId: string): boolean => {
    return windowState.activeItems.some(i => i.id === itemId);
  };


  return (
    <MovableWindowContext.Provider value={{ 
        isManagerOpen: windowState.isManagerOpen,
        isManagerMinimized: windowState.isMinimized,
        activeItems: windowState.activeItems,
        position: windowState.position,
        openItem, 
        closeItem,
        openAllEquipped,
        isItemOpen,
        closeManager,
        minimizeManager,
        restoreManager,
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
