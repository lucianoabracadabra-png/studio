'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type MovableWindowState = {
  isOpen: boolean;
  content: ReactNode | null;
  title: string;
  position: { x: number; y: number };
};

type MovableWindowContextType = {
  openWindow: (title: string, content: ReactNode) => void;
  closeWindow: () => void;
  setPosition: (position: { x: number; y: number }) => void;
} & MovableWindowState;

const MovableWindowContext = createContext<MovableWindowContextType | undefined>(undefined);

export const MovableWindowProvider = ({ children }: { children: ReactNode }) => {
  const [windowState, setWindowState] = useState<MovableWindowState>({
    isOpen: false,
    content: null,
    title: '',
    position: { x: 300, y: 100 }, // Initial position
  });

  const openWindow = (title: string, content: ReactNode) => {
    setWindowState(prev => ({
      ...prev,
      isOpen: true,
      title,
      content,
    }));
  };

  const closeWindow = () => {
    setWindowState(prev => ({ ...prev, isOpen: false, content: null, title: '' }));
  };

  const setPosition = (position: { x: number; y: number }) => {
    setWindowState(prev => ({ ...prev, position }));
  };

  return (
    <MovableWindowContext.Provider value={{ ...windowState, openWindow, closeWindow, setPosition }}>
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
