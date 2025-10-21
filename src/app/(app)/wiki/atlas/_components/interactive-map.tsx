'use client';
import { useState, useRef, useEffect } from 'react';
import type { fabric as FabricType } from 'fabric';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { pointsOfInterest } from '@/lib/wiki-data';
import { ZoomIn, ZoomOut, Maximize, MousePointer, Pen, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const mapImage = PlaceHolderImages.find(p => p.id === 'world-map')!;

type AtlasTool = 'pan' | 'draw';

const UNIT_NAME = 'km';
const PIXELS_PER_KM = 0.5;

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
    const fabricRef = useRef<FabricType.Canvas | null>(null);

    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);
    const [activeTool, setActiveTool] = useState<AtlasTool>('pan');
    const [displayDistance, setDisplayDistance] = useState(0);

    const totalDistanceRef = useRef(0);
    const pathStartLengthRef = useRef(0);

    useEffect(() => {
        const initFabric = async () => {
            const { fabric } = await import('fabric');
            
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: canvasRef.current?.parentElement?.clientWidth,
                height: canvasRef.current?.parentElement?.clientHeight,
                selection: false,
            });
            fabricRef.current = canvas;

            fabric.Image.fromURL(mapImage.imageUrl, (img: FabricType.Image) => {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                });
                centerAndReset();

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
                        selectable: false,
                        evented: true,
                        // @ts-ignore - custom property
                        poiData: poi, 
                    });
                    canvas.add(pin);
                });
                
                canvas.on('object:scaling', (e) => {
                    const obj = e.target;
                    if (!obj || !(obj instanceof fabric.Circle)) return;
                    const zoom = canvas.getZoom();
                    obj.set({
                        radius: 10 / zoom,
                        strokeWidth: 2 / zoom,
                    });
                });

                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
            
            canvas.freeDrawingBrush.color = '#ef4444';
            canvas.freeDrawingBrush.width = 5;
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: 10,
                color: '#ef4444',
                offsetX: 0,
                offsetY: 0
            });
            
            // --- Event Listeners ---
            canvas.on('mouse:down', (opt) => {
                 if (canvas.isDrawingMode) {
                    pathStartLengthRef.current = 0;
                 } else {
                    // @ts-ignore
                    if (opt.target && opt.target.poiData) {
                         // @ts-ignore
                        setActivePoi(opt.target.poiData);
                    } else {
                        setActivePoi(null);
                    }
                }
            });

            canvas.on('path:created', (opt) => {
                // @ts-ignore
                const path = opt.path;
                if (!path || !path.path) return;
                
                // @ts-ignore
                const currentLength = path.pathLength || 0;
                const pathGrowth = currentLength - pathStartLengthRef.current;
                
                const distanceInKm = (pathGrowth / canvas.getZoom()) / PIXELS_PER_KM;
                
                setDisplayDistance(totalDistanceRef.current + distanceInKm);
            });
            
            canvas.on('mouse:up', () => {
                 if(canvas.isDrawingMode) {
                    totalDistanceRef.current = displayDistance;
                 }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        let isDragging = false;
        let lastPosX: number, lastPosY: number;
    
        const onPanMouseDown = (opt: FabricType.IEvent) => {
            const e = opt.e;
             // @ts-ignore
            if (opt.target && opt.target.poiData) return;
            isDragging = true;
            canvas.setCursor('grabbing');
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        };

        const onPanMouseMove = (opt: FabricType.IEvent) => {
            if (isDragging) {
                const e = opt.e;
                const vpt = canvas.viewportTransform;
                if (vpt) {
                    vpt[4] += e.clientX - lastPosX;
                    vpt[5] += e.clientY - lastPosY;
                    canvas.requestRenderAll();
                }
                lastPosX = e.clientX;
                lastPosY = e.clientY;
            }
        };

        const onPanMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                canvas.setCursor('grab');
            }
        };

        if (activeTool === 'pan') {
            canvas.isDrawingMode = false;
            canvas.defaultCursor = 'grab';
            canvas.setCursor('grab');
            canvas.selection = false;
            canvas.getObjects().forEach(o => {
                // @ts-ignore
                o.set('evented', o.poiData !== undefined)
            });
            
            canvas.on('mouse:down', onPanMouseDown);
            canvas.on('mouse:move', onPanMouseMove);
            canvas.on('mouse:up', onPanMouseUp);

        } else if (activeTool === 'draw') {
            canvas.off('mouse:down', onPanMouseDown);
            canvas.off('mouse:move', onPanMouseMove);
            canvas.off('mouse:up', onPanMouseUp);

            canvas.isDrawingMode = true;
            canvas.defaultCursor = 'crosshair';
            canvas.setCursor('crosshair');
            canvas.getObjects().forEach(o => o.set('evented', false));
        }

        return () => {
            if (canvas) {
                canvas.off('mouse:down', onPanMouseDown);
                canvas.off('mouse:move', onPanMouseMove);
                canvas.off('mouse:up', onPanMouseUp);
            }
        };
    }, [activeTool]);

    const handleZoom = (direction: 'in' | 'out') => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const zoom = canvas.getZoom();
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        const center = canvas.getCenter();
        canvas.zoomToPoint({ x: center.left, y: center.top }, Math.max(0.2, Math.min(5, newZoom)));
    };
    
    const centerAndReset = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        // @ts-ignore
        const bgImage = canvas.backgroundImage;
        // @ts-ignore
        if (bgImage && bgImage.width && canvas.width) {
             // @ts-ignore
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height || 0;
             // @ts-ignore
            const imgWidth = bgImage.width;
             // @ts-ignore
            const imgHeight = bgImage.height;

            const zoomX = canvasWidth / imgWidth;
            const zoomY = canvasHeight / imgHeight;
            const newZoom = Math.min(zoomX, zoomY, 1);
            
            canvas.setZoom(newZoom);
            canvas.absolutePan({ x: 0, y: 0});

        } else {
             canvas.setZoom(0.5);
             canvas.absolutePan({ x: 0, y: 0});
        }
    };
    
    const clearDrawing = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects('path');
        objects.forEach(obj => canvas.remove(obj));
        
        totalDistanceRef.current = 0;
        pathStartLengthRef.current = 0;
        setDisplayDistance(0);
        
        canvas.renderAll();
    };
    
    const toggleTool = (tool: AtlasTool) => {
        if(tool) setActiveTool(tool);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-900">
            <canvas ref={canvasRef} />

            <div className="absolute top-4 left-4 z-40">
                <ToggleGroup type="single" value={activeTool} onValueChange={toggleTool} className="bg-card/80 backdrop-blur-sm rounded-lg p-1 border">
                    <ToggleGroupItem value="pan" aria-label="Mover Mapa"><MousePointer /></ToggleGroupItem>
                    <ToggleGroupItem value="draw" aria-label="Desenhar Rota"><Pen /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
                <Button size="icon" onClick={() => handleZoom('in')} variant="outline"><ZoomIn /></Button>
                <Button size="icon" onClick={() => handleZoom('out')} variant="outline"><ZoomOut /></Button>
                <Button size="icon" onClick={centerAndReset} variant="outline"><Maximize /></Button>
            </div>

            <AnimatePresence>
            {activePoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
                    transition={{ duration: 0.2 }}
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
            </AnimatePresence>
            
            <AnimatePresence>
                {activeTool === 'draw' && (
                    <DrawingToolbar onClear={clearDrawing} distance={displayDistance} />
                )}
            </AnimatePresence>
        </div>
    );
}