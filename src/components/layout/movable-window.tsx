'use client';

import React, { useRef, useEffect } from 'react';
import { useMovableWindow } from '@/context/movable-window-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { Separator } from '../ui/separator';

const SubWindow = ({ item }: { item: { id: string; title: string; content: React.ReactNode } }) => {
    const { closeItem } = useMovableWindow();
    return (
        <div className='bg-card/50 rounded-lg border border-border'>
            <div className='flex items-center justify-between p-2 pl-3 bg-muted/30 rounded-t-lg'>
                <h4 className='font-semibold text-sm'>{item.title}</h4>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => closeItem(item.id)}>
                    <X className="h-3 w-3" />
                </Button>
            </div>
            <div className='p-3'>
                {item.content}
            </div>
        </div>
    )
}


export function MovableWindowManager() {
  const { 
    isManagerOpen, 
    activeItems, 
    position, 
    setPosition, 
    closeManager 
  } = useMovableWindow();

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

    if (isManagerOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isManagerOpen, setPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    // Prevent dragging if the click is on a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    isDragging.current = true;
    const rect = cardRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.classList.add('no-select');
  };

  if (!isManagerOpen) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <style>{`.no-select { user-select: none; }`}</style>
      <Card className="glassmorphic-card w-96 shadow-2xl shadow-primary/30 border-primary/50">
        <CardHeader
          className="flex flex-row items-center justify-between p-2 pl-3 bg-muted/50 rounded-t-lg"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'move' }}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Equipamentos</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeManager}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 max-h-[70vh] overflow-y-auto space-y-3">
            {activeItems.length > 0 ? (
                 activeItems.map((item) => <SubWindow key={item.id} item={item} />)
            ) : (
                <p className='text-center text-sm text-muted-foreground py-4'>Nenhum item aberto. Clique em um item equipado para vê-lo aqui.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
