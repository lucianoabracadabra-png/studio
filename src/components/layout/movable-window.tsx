'use client';

import React, { useRef, useEffect } from 'react';
import { useMovableWindow } from '@/context/movable-window-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MovableWindow() {
  const { isOpen, content, title, position, setPosition, closeWindow } = useMovableWindow();
  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !cardRef.current) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.classList.remove('no-select');
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen, setPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    isDragging.current = true;
    const rect = cardRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.classList.add('no-select');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-${offset.current.x}px, -${offset.current.y}px)`, // Adjust for initial click position
      }}
    >
      <style>{`.no-select { user-select: none; }`}</style>
      <Card className="glassmorphic-card w-80 shadow-2xl shadow-primary/30 border-primary/50">
        <CardHeader
          className="flex flex-row items-center justify-between p-2 pl-3 bg-muted/50 rounded-t-lg"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'move' }}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold truncate">{title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeWindow}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
            {content}
        </CardContent>
      </Card>
    </div>
  );
}
