'use client';
import { useState, useRef, useEffect } from 'react';
import { fabric as FabricType } from 'fabric';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { pointsOfInterest } from '@/lib/wiki-data';
import { ZoomIn, ZoomOut, Maximize, MousePointer, Pen, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const mapImage = PlaceHolderImages.find(p => p.id === 'world-map');

type AtlasTool = 'pan' | 'draw';

const PIXELS_PER_KM = 2;

const DrawingToolbar = ({ onClear, distance }: { onClear: () => void; distance: number }) => {
    return (
        <AnimatePresence>
            {(distance > 0) && (
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
                            <span className='font-bold font-mono text-lg'>{distance.toFixed(0)}km</span>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export function InteractiveMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<FabricType.Canvas | null>(null);

    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);
    const [activeTool, setActiveTool] = useState<AtlasTool>('pan');
    const [displayDistance, setDisplayDistance] = useState(0);
    
    const isDrawingRef = useRef(false);
    const totalDistanceRef = useRef(0);
    const lastPointRef = useRef<{ x: number, y: number } | null>(null);

    const clearDrawing = () => {
        const canvas = fabricRef.current;
        if (canvas) {
             const objects = canvas.getObjects();
            for (let i = objects.length - 1; i >= 0; i--) {
                const obj = objects[i];
                if (obj.isType('path')) {
                    canvas.remove(obj);
                }
            }
            canvas.renderAll();
        }
        totalDistanceRef.current = 0;
        setDisplayDistance(0);
    };

    const centerAndReset = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const bgImage = canvas.backgroundImage;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        if (bgImage && bgImage.width && bgImage.height) {
            const imgWidth = bgImage.width;
            const imgHeight = bgImage.height;
            const zoomX = canvasWidth / imgWidth;
            const zoomY = canvasHeight / imgHeight;
            const newZoom = Math.min(zoomX, zoomY, 1);
            
            canvas.setZoom(newZoom);
        } else {
            canvas.setZoom(0.5);
        }
        canvas.absolutePan({ x: 0, y: 0 });
    };

    useEffect(() => {
        let canvas: FabricType.Canvas | null = null;
        let resizeObserver: ResizeObserver | null = null;

        const initFabric = async () => {
            const { fabric } = await import('fabric');
            
            if (!canvasRef.current) return;

            canvas = new fabric.Canvas(canvasRef.current, {
                width: canvasRef.current.parentElement?.clientWidth,
                height: canvasRef.current.parentElement?.clientHeight,
                selection: false,
            });
            fabricRef.current = canvas;
            
            if (!mapImage) {
                console.error("Map image not found in placeholder data.");
                return;
            }

            try {
                const img = await fabric.Image.fromURL(mapImage.imageUrl, undefined, { crossOrigin: 'anonymous' });
                
                if (img) {
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
                            // @ts-ignore - Custom property to identify POIs
                            poiData: poi,
                        });
                        canvas?.add(pin);
                    });
                }

            } catch (error) {
                console.error("Error loading map image:", error);
            }

            if (canvasRef.current.parentElement) {
                resizeObserver = new ResizeObserver(entries => {
                    const { width, height } = entries[0].contentRect;
                    canvas?.setDimensions({ width, height });
                });
                resizeObserver.observe(canvasRef.current.parentElement);
            }
        };

        initFabric();

        return () => {
            if (resizeObserver && canvasRef.current?.parentElement) {
                resizeObserver.unobserve(canvasRef.current.parentElement);
            }
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        let isPanning = false;
        let lastPosX: number, lastPosY: number;
    
        const onPanMouseDown = (opt: FabricType.IEvent) => {
            const e = opt.e;
            if (opt.target && 'poiData' in opt.target) return;
            isPanning = true;
            canvas.setCursor('grabbing');
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        };

        const onPanMouseMove = (opt: FabricType.IEvent) => {
            if (isPanning) {
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
            isPanning = false;
            canvas.setCursor('grab');
        };

        const onPinClick = (opt: FabricType.IEvent) => {
            if (opt.target && 'poiData' in opt.target) {
                setActivePoi(opt.target.poiData as (typeof pointsOfInterest)[0]);
            } else if (!isDrawingRef.current) {
                setActivePoi(null);
            }
        };

        const onDrawMouseDown = (opt: FabricType.IEvent<MouseEvent>) => {
            isDrawingRef.current = true;
            const pointer = canvas.getPointer(opt.e);
            lastPointRef.current = { x: pointer.x, y: pointer.y };
            setActivePoi(null);
        };

        const onDrawMouseMove = (opt: FabricType.IEvent<MouseEvent>) => {
            if (!isDrawingRef.current || !lastPointRef.current) return;
            const pointer = canvas.getPointer(opt.e);
            
            const dx = pointer.x - lastPointRef.current.x;
            const dy = pointer.y - lastPointRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            totalDistanceRef.current += distance / canvas.getZoom() / PIXELS_PER_KM;
            setDisplayDistance(totalDistanceRef.current);

            lastPointRef.current = { x: pointer.x, y: pointer.y };
        };
        
        const onDrawMouseUp = () => {
            isDrawingRef.current = false;
            lastPointRef.current = null;
        };

        canvas.off();
        
        if (activeTool === 'pan') {
            canvas.isDrawingMode = false;
            canvas.defaultCursor = 'grab';
            canvas.selection = false;
            canvas.forEachObject(o => o.set('evented', true));
            
            canvas.on('mouse:down', onPanMouseDown);
            canvas.on('mouse:move', onPanMouseMove);
            canvas.on('mouse:up', onPanMouseUp);
            canvas.on('mouse:down', onPinClick);

        } else if (activeTool === 'draw') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = '#ef4444';
            canvas.freeDrawingBrush.width = 5 / canvas.getZoom();
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: 10 / canvas.getZoom(),
                color: '#ef4444',
                offsetX: 0,
                offsetY: 0
            });
            
            canvas.defaultCursor = 'crosshair';
            canvas.selection = false;
            canvas.forEachObject(o => o.set('evented', false));

            canvas.on('mouse:down', onDrawMouseDown);
            canvas.on('mouse:move', onDrawMouseMove);
            canvas.on('mouse:up', onDrawMouseUp);
        }
        canvas.setCursor(canvas.defaultCursor!);

        return () => {
            if (canvas) {
                canvas.off();
            }
        }

    }, [activeTool]);

    const handleZoom = (direction: 'in' | 'out') => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const zoom = canvas.getZoom();
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        const center = canvas.getCenter();
        canvas.zoomToPoint({ x: center.left, y: center.top }, Math.max(0.2, Math.min(5, newZoom)));
    };
    
    const toggleTool = (tool: AtlasTool) => {
        if(tool) setActiveTool(tool);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-900 rounded-lg border">
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
                {activePoi && activeTool === 'pan' && (
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

    
