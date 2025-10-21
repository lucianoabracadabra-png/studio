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

const calculatePathDistance = (path: FabricType.Path, canvas: FabricType.Canvas) => {
    if (!path || !path.path) return 0;
    let distance = 0;
    for (let i = 1; i < path.path.length; i++) {
        const p1 = path.path[i-1];
        const p2 = path.path[i];
        // p1 and p2 are arrays like ['M', x, y] or ['L', x, y]
        const dx = p2[1] - p1[1];
        const dy = p2[2] - p1[2];
        distance += Math.sqrt(dx*dx + dy*dy);
    }
    // Divide by pixel-per-unit ratio
    return (distance / PIXELS_PER_UNIT) * UNIT_CONVERSION;
};


export function InteractiveMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<FabricType.Canvas | null>(null);
    const currentPathRef = useRef<FabricType.Path | null>(null);
    
    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);
    const [activeTool, setActiveTool] = useState<AtlasTool>('pan');
    const [drawingDistance, setDrawingDistance] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);

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
                        selectable: true,
                        evented: true,
                        // @ts-ignore - custom property
                        poiData: poi, 
                    });
                    canvas.add(pin);
                });
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });

            // --- Event Listeners ---
            canvas.on('mouse:down', (opt) => {
                const e = opt.e;
                if (canvas.isDrawingMode) {
                    setIsDrawing(true);
                    currentPathRef.current = null; // Reset path on new drawing
                    return;
                }
                
                // @ts-ignore
                if (opt.target && opt.target.poiData) {
                    // @ts-ignore
                    setActivePoi(opt.target.poiData);
                    return;
                }
                setActivePoi(null);
            });

            canvas.on('mouse:move', () => {
                if (canvas.isDrawingMode && isDrawing && currentPathRef.current) {
                    const distance = calculatePathDistance(currentPathRef.current, canvas);
                    setDrawingDistance(distance);
                }
            });
            
            canvas.on('mouse:up', () => {
                 if (isDrawing) {
                    setIsDrawing(false);
                 }
            });

            canvas.on('before:path:created', (opt: { path: FabricType.Path }) => {
                currentPathRef.current = opt.path;
            });
            
            canvas.on('path:created', () => {
                currentPathRef.current = null;
            })

            canvas.freeDrawingBrush.color = '#ef4444';
            canvas.freeDrawingBrush.width = 10; // Thicker line
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle tool switching
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        if (activeTool === 'draw') {
            canvas.isDrawingMode = true;
            // Disable panning
            canvas.on('mouse:down', function (this: FabricType.Canvas, opt) {
                if (this.isDrawingMode) return;
                const evt = opt.e;
                this.set('isDragging', true);
                this.set('selection', false);
                this.set('lastPosX', evt.clientX);
                this.set('lastPosY', evt.clientY);
            });
            canvas.on('mouse:move', function (this: FabricType.Canvas, opt) {
                if (this.isDrawingMode) return;
                if (this.get('isDragging')) {
                    const e = opt.e;
                    const vpt = this.viewportTransform;
                    if(vpt) {
                        vpt[4] += e.clientX - (this.get('lastPosX') || 0);
                        vpt[5] += e.clientY - (this.get('lastPosY') || 0);
                        this.requestRenderAll();
                    }
                    this.set('lastPosX', e.clientX);
                    this.set('lastPosY', e.clientY);
                }
            });
            canvas.on('mouse:up', function (this: FabricType.Canvas) {
                if (this.isDrawingMode) return;
                this.set('isDragging', false);
                this.set('selection', true);
            });


        } else { // pan tool
            canvas.isDrawingMode = false;
            // Enable panning
            canvas.on('mouse:down', function (this: FabricType.Canvas, opt) {
                const evt = opt.e;
                if (opt.target) return;
                this.set('isDragging', true);
                this.set('selection', false);
                this.set('lastPosX', evt.clientX);
                this.set('lastPosY', evt.clientY);
            });
            canvas.on('mouse:move', function (this: FabricType.Canvas, opt) {
                if (this.get('isDragging')) {
                    const e = opt.e;
                    const vpt = this.viewportTransform;
                    if(vpt) {
                        vpt[4] += e.clientX - (this.get('lastPosX') || 0);
                        vpt[5] += e.clientY - (this.get('lastPosY') || 0);
                        this.requestRenderAll();
                    }
                    this.set('lastPosX', e.clientX);
                    this.set('lastPosY', e.clientY);
                }
            });
            canvas.on('mouse:up', function (this: FabricType.Canvas) {
                this.set('isDragging', false);
                this.set('selection', true);
            });
        }
    }, [activeTool]);

    const handleZoom = (direction: 'in' | 'out') => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const zoom = canvas.getZoom();
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, Math.max(0.2, Math.min(5, newZoom)));
    };
    
    const centerAndReset = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const bgImage = canvas.getBackgroundImage();
        if (bgImage && bgImage.width) {
            const zoomX = canvas.width / bgImage.width;
            const zoomY = canvas.height / bgImage.height;
            const newZoom = Math.min(zoomX, zoomY, 0.5);
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
        setDrawingDistance(0);
        setIsDrawing(false);
        currentPathRef.current = null;
        canvas.renderAll();
    };

    const showDrawingToolbar = isDrawing || drawingDistance > 0;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-900">
            <canvas ref={canvasRef} />

            <div className="absolute top-4 left-4 z-40">
                <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && setActiveTool(value as AtlasTool)} className="bg-card/80 backdrop-blur-sm rounded-lg p-1 border">
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
                {showDrawingToolbar && (
                    <DrawingToolbar onClear={clearDrawing} distance={drawingDistance} />
                )}
            </AnimatePresence>
        </div>
    );
}
