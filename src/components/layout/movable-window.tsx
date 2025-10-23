'use client';

import React, { useRef, useEffect } from 'react';
import { useMovableWindow } from '@/context/movable-window-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Minimize2, Maximize2, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SubWindow = ({ item }: { item: { id: string; title: string; content: React.ReactNode } }) => {
    const { closeItem } = useMovableWindow();
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between p-2 pl-3 bg-muted rounded-t-lg'>
                <CardTitle className='font-semibold text-sm'>{item.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => closeItem(item.id)}>
                    <X className="h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent className='p-3'>
                {item.content}
            </CardContent>
        </Card>
    )
}


export function MovableWindowManager() {
  const { 
    isManagerOpen, 
    isManagerMinimized,
    activeItems, 
    position, 
    setPosition, 
    closeManager,
    minimizeManager,
    restoreManager,
  } = useMovableWindow();

  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !cardRef.current || isManagerMinimized) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.classList.remove('no-select-cursor');
      }
    };

    if (isManagerOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isManagerOpen, isManagerMinimized, setPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isManagerMinimized) return;
    // Prevent drag from starting if a button was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    isDragging.current = true;
    const rect = cardRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.classList.add('no-select-cursor');
  };

  if (!isManagerOpen) {
    return null;
  }

  return (
    <>
      <style>{`.no-select-cursor { user-select: none; cursor: move !important; }`}</style>
      <AnimatePresence>
        {isManagerMinimized ? (
            <motion.div
                className="fixed bottom-4 right-4 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
            >
                <Button size="icon" className="w-14 h-14 rounded-full shadow-2xl" onClick={restoreManager}>
                    <Maximize2 />
                </Button>
            </motion.div>
        ) : (
            <motion.div
                ref={cardRef}
                className="fixed z-50"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Card className="w-96 shadow-2xl border-primary">
                <CardHeader
                  className="flex flex-row items-center justify-between p-2 pl-3 bg-muted rounded-t-lg"
                  onMouseDown={handleMouseDown}
                  style={{ cursor: 'move' }}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><BookOpen/> Equipamentos</CardTitle>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={minimizeManager}>
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeManager}>
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 max-h-[70vh] overflow-y-auto space-y-3">
                    {activeItems.length > 0 ? (
                        activeItems.map((item) => <SubWindow key={item.id} item={item} />)
                    ) : (
                        <p className='text-center text-sm text-muted-foreground py-4'>Nenhum item aberto. Clique em um item equipado para vê-lo aqui.</p>
                    )}
                </CardContent>
              </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}