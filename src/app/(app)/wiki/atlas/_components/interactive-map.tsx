'use client';
import { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { pointsOfInterest } from '@/lib/wiki-data';
import { MapPin, ZoomIn, ZoomOut, Maximize, MousePointer, Pen, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

const mapImage = PlaceHolderImages.find(p => p.id === 'world-map')!;

type Point = { x: number, y: number };
type AtlasTool = 'pan' | 'draw';

const PIXELS_PER_UNIT = 50;
const UNIT_NAME = 'km';
const UNIT_CONVERSION = 10;

const DrawingLayer = ({ points, mapZoom }: { points: Point[], mapZoom: number }) => {
    if (points.length < 2) return null;

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <path 
            d={pathData} 
            strokeWidth={4 / mapZoom} 
            stroke="hsl(var(--accent))" 
            fill="none" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            style={{ filter: `drop-shadow(0 0 5px hsl(var(--accent)))`}} 
        />
    );
};

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
    const [zoom, setZoom] = useState(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);
    const [activeTool, setActiveTool] = useState<AtlasTool>('pan');
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
    const [drawingDistance, setDrawingDistance] = useState(0);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        let totalLength = 0;
        for (let i = 1; i < drawingPoints.length; i++) {
            const p1 = drawingPoints[i-1];
            const p2 = drawingPoints[i];
            totalLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
        setDrawingDistance((totalLength / PIXELS_PER_UNIT) * UNIT_CONVERSION);
    }, [drawingPoints]);

    const handleZoom = (direction: 'in' | 'out') => {
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        setZoom(Math.max(0.5, Math.min(5, newZoom)));
    };
    
    const centerAndReset = () => {
        setZoom(1);
        x.set(0);
        y.set(0);
    }

    const getPointFromEvent = (e: MouseEvent): Point => {
        const containerRect = mapContainerRef.current!.getBoundingClientRect();
        const mapX = (e.clientX - containerRect.left - x.get()) / zoom;
        const mapY = (e.clientY - containerRect.top - y.get()) / zoom;
        return { x: mapX, y: mapY };
    }

    const handleInteractionStart = (e: MouseEvent) => {
        if (activeTool === 'draw') {
            setIsDrawing(true);
            const newPoint = getPointFromEvent(e);
            setDrawingPoints([newPoint]);
        }
    };

    const handleInteractionMove = (e: MouseEvent) => {
        if (activeTool === 'draw' && isDrawing) {
            const newPoint = getPointFromEvent(e);
            setDrawingPoints(prev => [...prev, newPoint]);
        }
    };
    
    const handleInteractionEnd = () => {
        if (activeTool === 'draw') {
            setIsDrawing(false);
        }
    };

    const handleMapClick = (e: MouseEvent) => {
        // If pan tool is active and the click is on the background, close POI
        if (activeTool === 'pan' && e.target === e.currentTarget) {
            setActivePoi(null);
        }
    };

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-lg border overflow-hidden relative bg-black"
            style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
        >
            <motion.div
                className={cn(
                    "relative w-full h-full overflow-hidden",
                    activeTool === 'pan' && "cursor-grab active:cursor-grabbing"
                )}
                style={{ x, y, scale: zoom }}
                drag={activeTool === 'pan'}
                dragMomentum={false}
                onMouseDown={handleInteractionStart}
                onMouseMove={handleInteractionMove}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
                onTapStart={e => handleInteractionStart(e as any)}
                onTap={e => handleInteractionMove(e as any)}
                onTapCancel={handleInteractionEnd}
                onClick={handleMapClick}
            >
                <div
                    className="absolute top-0 left-0"
                    style={{ width: '2000px', height: '1500px' }}
                >
                    <Image
                        src={mapImage.imageUrl}
                        alt={mapImage.description}
                        layout="fill"
                        objectFit="cover"
                        priority
                        className='select-none pointer-events-none'
                        data-ai-hint={mapImage.imageHint}
                        draggable={false}
                    />

                    {/* POIs */}
                    {pointsOfInterest.map(poi => (
                        <motion.div
                            key={poi.id}
                            className="absolute z-10"
                            style={{ left: `${poi.position.x}%`, top: `${poi.position.y}%` }}
                            initial={{ scale: 1 / zoom }}
                            animate={{ scale: 1 / zoom }}
                        >
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            onClick={() => activeTool === 'pan' && setActivePoi(poi)} 
                                            className='-translate-x-1/2 -translate-y-full focus:outline-none'
                                            style={{ cursor: activeTool === 'pan' ? 'pointer' : 'crosshair' }}
                                        >
                                            <MapPin className={cn(
                                                'h-8 w-8 text-destructive drop-shadow-lg transition-colors duration-300',
                                                activePoi?.id === poi.id ? 'text-accent' : 'hover:text-accent/80'
                                            )} style={{ filter: 'drop-shadow(0 0 5px hsl(var(--accent)))' }} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{poi.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </motion.div>
                    ))}

                    {/* Drawing SVG Layer */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                       <DrawingLayer points={drawingPoints} mapZoom={zoom} />
                    </svg>
                </div>
            </motion.div>

            {/* UI Overlay */}
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
            
            {drawingPoints.length > 0 && activeTool === 'draw' && (
                <DrawingToolbar onClear={() => setDrawingPoints([])} distance={drawingDistance} />
            )}
        </div>
    );
}
