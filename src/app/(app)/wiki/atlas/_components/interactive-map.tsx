'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { fabric } from 'fabric';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { pointsOfInterest } from '@/lib/wiki-data';
import { MapPin, ZoomIn, ZoomOut, Maximize, MousePointer, Pen, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const mapImage = PlaceHolderImages.find(p => p.id === 'world-map')!;

type AtlasTool = 'pan' | 'draw';

const PIXELS_PER_UNIT = 50; 
const UNIT_NAME = 'km';
const UNIT_CONVERSION = 10; 

const DrawingToolbar = ({ onClear, distance }: { onClear: () => void, distance: number }) => {
    return (
        <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
        >
            <Card className="glassmorphic-card flex items-center gap-4 p-2">
                <Button onClick={onClear} variant="destructive" size="icon">
                    <Eraser />
                </Button>
                <div className='flex items-baseline gap-2'>
                    <span className='text-muted-foreground text-sm'>Distância:</span>
                    <span className='font-bold font-mono text-lg'>{distance.toFixed(0)}{UNIT_NAME}</span>
                </div>
            </Card>
        </motion.div>
    );
}

export function InteractiveMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);
    const [activeTool, setActiveTool] = useState<AtlasTool>('pan');
    const [drawingDistance, setDrawingDistance] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const currentPathRef = useRef<fabric.Path | null>(null);

    const toggleTool = (tool: AtlasTool) => {
        setActiveTool(tool);
        const canvas = fabricRef.current;
        if (!canvas) return;

        if (tool === 'draw') {
            canvas.isDrawingMode = true;
            canvas.selection = false;
             canvas.forEachObject(obj => {
                obj.selectable = false;
                obj.evented = false;
            });
        } else {
            canvas.isDrawingMode = false;
            canvas.selection = true;
             canvas.forEachObject(obj => {
                // In pan mode, only POIs should be clickable.
                if (obj.type === 'circle' && 'poiData' in obj) {
                     obj.selectable = true;
                     obj.evented = true;
                } else {
                     obj.selectable = false;
                     obj.evented = false;
                }
            });
        }
        canvas.renderAll();
    }
    
    const handleZoom = (direction: 'in' | 'out') => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const zoom = canvas.getZoom();
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        canvas.setZoom(Math.max(0.2, Math.min(5, newZoom)));
    };
    
    const centerAndReset = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.setZoom(0.5);
    }
    
    const clearDrawing = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects('path');
        objects.forEach(obj => canvas.remove(obj));
        setDrawingDistance(0);
        setIsDrawing(false);
        currentPathRef.current = null;
        canvas.renderAll();
    }
    
    const calculatePathDistance = (path: fabric.Path) => {
        if (!path || !path.path) return 0;
    
        let totalLength = 0;
        const pathCommands = path.path;
    
        for (let i = 0; i < pathCommands.length; i++) {
            const command = pathCommands[i];
            const commandType = command[0].toUpperCase();
    
            if (i > 0) {
                const prevCommand = pathCommands[i - 1];
                let x1: number, y1: number, x2: number, y2: number;
    
                if (prevCommand[0].toUpperCase() === 'C') { 
                    x1 = prevCommand[5];
                    y1 = prevCommand[6];
                } else if (prevCommand[0].toUpperCase() === 'Q') { 
                    x1 = prevCommand[3];
                    y1 = prevCommand[4];
                } else { 
                    x1 = prevCommand[prevCommand.length - 2];
                    y1 = prevCommand[prevCommand.length - 1];
                }
    
                if (commandType === 'C') {
                    x2 = command[5];
                    y2 = command[6];
                } else if (commandType === 'Q') {
                    x2 = command[3];
                    y2 = command[4];
                } else { 
                    x2 = command[1];
                    y2 = command[2];
                }
    
                if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
                    totalLength += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                }
            }
        }
        
        const baseMapZoom = 0.5; // The zoom level at which the map is initially rendered
        return (totalLength / PIXELS_PER_UNIT) * (UNIT_CONVERSION / baseMapZoom);
    }

    useEffect(() => {
        const initFabric = async () => {
            const { fabric } = await import('fabric');
            
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: canvasRef.current?.parentElement?.clientWidth,
                height: canvasRef.current?.parentElement?.clientHeight,
                selection: false,
                backgroundColor: '#000',
            });
            fabricRef.current = canvas;

            fabric.Image.fromURL(mapImage.imageUrl, (img) => {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    selectable: false,
                    evented: false,
                });
                canvas.setZoom(0.5);

                pointsOfInterest.forEach(poi => {
                    const pin = new fabric.Circle({
                        radius: 10,
                        fill: 'hsl(0, 70%, 60%)',
                        stroke: 'white',
                        strokeWidth: 2,
                        left: (img.width || 2000) * (poi.position.x / 100),
                        top: (img.height || 1500) * (poi.position.y / 100),
                        originX: 'center',
                        originY: 'center',
                        hasControls: false,
                        hasBorders: false,
                        // @ts-ignore - custom property
                        poiData: poi, 
                    });
        
                    canvas.add(pin);
                });

                toggleTool('pan');
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });

            let isDragging = false;
            let lastPosX: number, lastPosY: number;

            canvas.on('mouse:down', (opt) => {
                const e = opt.e;
                if (activeTool === 'pan') {
                    if (opt.target && 'poiData' in opt.target) {
                        // @ts-ignore
                        setActivePoi(opt.target.poiData);
                        isDragging = false;
                    } else {
                         setActivePoi(null);
                         isDragging = true;
                         lastPosX = e.clientX;
                         lastPosY = e.clientY;
                    }
                } else if (activeTool === 'draw') {
                    setIsDrawing(true);
                    currentPathRef.current = null;
                }
            });
            
            canvas.on('path:created', (opt) => {
                // @ts-ignore
                const path = opt.path as fabric.Path;
                path.selectable = false;
                path.evented = false;
                currentPathRef.current = path;
                const finalDistance = calculatePathDistance(path);
                setDrawingDistance(finalDistance);
                setIsDrawing(false);
            });

            canvas.on('mouse:move', function(opt) {
                if (activeTool === 'pan' && isDragging) {
                    const e = opt.e;
                    const vpt = canvas.viewportTransform;
                    if (vpt) {
                        vpt[4] += e.clientX - lastPosX;
                        vpt[5] += e.clientY - lastPosY;
                        canvas.requestRenderAll();
                    }
                    lastPosX = e.clientX;
                    lastPosY = e.clientY;
                } else if (activeTool === 'draw' && isDrawing && currentPathRef.current) {
                     const currentDistance = calculatePathDistance(currentPathRef.current);
                     setDrawingDistance(currentDistance);
                }
            });

            canvas.on('mouse:up', () => {
                 if (activeTool === 'pan') {
                    isDragging = false;
                 }
                 if(activeTool === 'draw') {
                     setIsDrawing(false);
                 }
            })
            
            canvas.freeDrawingBrush.color = '#ef4444';
            canvas.freeDrawingBrush.width = 5;
            // @ts-ignore
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: 10,
                color: '#ef4444',
                offsetX: 0,
                offsetY: 0
            });

            const handleResize = () => {
                canvas.setWidth(canvasRef.current?.parentElement?.clientWidth || 0);
                canvas.setHeight(canvasRef.current?.parentElement?.clientHeight || 0);
                canvas.renderAll();
            };

            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                canvas.dispose();
            };
        };
        
        initFabric();

    }, []);


    return (
        <div className="w-full h-full relative overflow-hidden">
            <canvas ref={canvasRef} />

            <div className="absolute top-4 left-4 z-40">
                <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && toggleTool(value as AtlasTool)} className="bg-card/80 backdrop-blur-sm rounded-lg p-1 border">
                    <ToggleGroupItem value="pan" aria-label="Mover Mapa"><MousePointer /></ToggleGroupItem>
                    <ToggleGroupItem value="draw" aria-label="Desenhar Rota"><Pen /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
                <Button size="icon" onClick={() => handleZoom('in')} variant="outline"><ZoomIn /></Button>
                <Button size="icon" onClick={() => handleZoom('out')} variant="outline"><ZoomOut /></Button>
                <Button size="icon" onClick={centerAndReset} variant="outline"><Maximize /></Button>
            </div>

            {activePoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
                >
                    <Card className="w-80 glassmorphic-card">
                        <CardHeader><CardTitle className="text-xl font-headline">{activePoi.name}</CardTitle></CardHeader>
                        <CardContent>
                            <Button asChild className="w-full font-bold">
                                <Link href={`/wiki/${activePoi.portalId}`}>Ver na Wiki</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {(isDrawing || drawingDistance > 0) && activeTool === 'draw' && (
                <DrawingToolbar onClear={clearDrawing} distance={drawingDistance} />
            )}
        </div>
    );
}
