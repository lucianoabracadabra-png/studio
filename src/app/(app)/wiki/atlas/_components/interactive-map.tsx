'use client';
import { useState, useRef, useEffect, MouseEvent } from 'react';
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

const DrawingLayer = ({ 
    points, 
    mapZoom, 
}: { 
    points: Point[], 
    mapZoom: number, 
}) => {
    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');
    
    const PIXELS_PER_UNIT = 50;
    const ticks = [];
    let accumulatedLength = 0;
    for (let i = 1; i < points.length; i++) {
        const p1 = points[i-1];
        const p2 = points[i];
        const segmentLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

        let currentPos = accumulatedLength;
        while(currentPos + PIXELS_PER_UNIT < accumulatedLength + segmentLength) {
            const ratio = (currentPos + PIXELS_PER_UNIT - accumulatedLength) / segmentLength;
            const tickX = p1.x + (p2.x - p1.x) * ratio;
            const tickY = p1.y + (p2.y - p1.y) * ratio;
            ticks.push({x: tickX, y: tickY});
            currentPos += PIXELS_PER_UNIT;
        }
        accumulatedLength += segmentLength;
    }

    return (
        <g>
            <path d={pathData} strokeWidth={3 / mapZoom} stroke="hsl(var(--accent))" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px hsl(var(--accent)))`}} />
            {ticks.map((tick, i) => (
                <line key={i} x1={tick.x - 5/mapZoom} y1={tick.y} x2={tick.x + 5/mapZoom} y2={tick.y} stroke="hsl(var(--accent))" strokeWidth={4/mapZoom} transform={`rotate(90 ${tick.x} ${tick.y})`} />
            ))}
        </g>
    );
};

const DrawingToolbar = ({ onClear, distance, unit = 'km' }: { onClear: () => void, distance: number, unit?: string }) => {
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
                    <span className='font-bold font-mono text-lg'>{distance.toFixed(0)}{unit}</span>
                </div>
            </Card>
        </motion.div>
    )
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
    
    const PIXELS_PER_UNIT = 50;
    const UNIT_NAME = 'km';
    const UNIT_CONVERSION = 10;

    const handleZoom = (direction: 'in' | 'out') => {
        const newZoom = direction === 'in' ? zoom * 1.2 : zoom / 1.2;
        const clampedZoom = Math.max(0.5, Math.min(5, newZoom));
        setZoom(clampedZoom);
    };
    
    const centerAndReset = () => {
        setZoom(1);
        x.set(0);
        y.set(0);
    }
    
    const handleMapClick = (e: React.MouseEvent) => {
        if (activeTool === 'pan' && (e.target as HTMLElement).closest('.map-image-container')) {
            setActivePoi(null);
        }
    }
    
    useEffect(() => {
        if(activeTool !== 'draw') {
            setDrawingPoints([]);
            setDrawingDistance(0);
        }
    }, [activeTool]);

    useEffect(() => {
        let totalLength = 0;
        for (let i = 1; i < drawingPoints.length; i++) {
            const p1 = drawingPoints[i-1];
            const p2 = drawingPoints[i];
            totalLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
        const calculatedDistance = (totalLength / PIXELS_PER_UNIT) * UNIT_CONVERSION;
        setDrawingDistance(calculatedDistance);
    }, [drawingPoints]);

    const getPointFromEvent = (e: MouseEvent<HTMLDivElement>): Point => {
        const containerRect = mapContainerRef.current!.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        
        const mapX = (clientX - containerRect.left - x.get()) / zoom;
        const mapY = (clientY - containerRect.top - y.get()) / zoom;
        
        return { x: mapX, y: mapY };
    }

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (activeTool !== 'draw') return;
        // Check if the click is on the map background, not on a UI element
        if ((e.target as HTMLElement).closest('.map-ui-element')) return;
        e.preventDefault();
        setIsDrawing(true);
        const newPoint = getPointFromEvent(e);
        setDrawingPoints([newPoint]);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || activeTool !== 'draw') return;
        e.preventDefault();
        const newPoint = getPointFromEvent(e);
        setDrawingPoints(prev => [...prev, newPoint]);
    };
    
    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
        if (activeTool !== 'draw') return;
        e.preventDefault();
        setIsDrawing(false);
    };

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-lg border overflow-hidden relative bg-black"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
            onClick={handleMapClick}
        >
            <motion.div
                className={cn(
                    "absolute top-0 left-0 map-image-container",
                    activeTool === 'pan' && "cursor-grab active:cursor-grabbing"
                )}
                style={{ x, y, scale: zoom, width: '2000px', height: '1500px' }}
                drag={activeTool === 'pan'}
                dragMomentum={false}
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

                {/* SVG for drawing, correctly scaled with the map */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                    <DrawingLayer points={drawingPoints} mapZoom={zoom} />
                </svg>

                {pointsOfInterest.map(poi => (
                    <motion.div
                        key={poi.id}
                        className="absolute z-30"
                        style={{ 
                            left: `${poi.position.x}%`, 
                            top: `${poi.position.y}%`,
                        }}
                        initial={{ scale: 1/zoom }}
                        animate={{ scale: 1/zoom }}
                        whileHover={{ scale: 1.2 / zoom }}
                    >
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button 
                                        onClick={() => activeTool === 'pan' && setActivePoi(poi)} 
                                        className='focus:outline-none -translate-x-1/2 -translate-y-full' 
                                        style={{ cursor: activeTool === 'pan' ? 'pointer' : 'default' }}
                                    >
                                        <MapPin className={cn(
                                            'h-8 w-8 text-destructive drop-shadow-lg transition-all duration-300 hover:text-accent',
                                            activePoi?.id === poi.id && 'text-accent'
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
            </motion.div>

            {/* UI Elements - Should have highest z-index */}
            <div className="absolute top-4 left-4 z-40 map-ui-element">
                <ToggleGroup type="single" value={activeTool} onValueChange={(value) => setActiveTool(value as AtlasTool || 'pan')} className="bg-card/80 backdrop-blur-sm rounded-lg p-1 border">
                    <ToggleGroupItem value="pan" aria-label="Mover Mapa">
                        <MousePointer />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="draw" aria-label="Desenhar Rota">
                        <Pen />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-40 map-ui-element">
                <Button size="icon" onClick={() => handleZoom('in')} variant="outline"><ZoomIn /></Button>
                <Button size="icon" onClick={() => handleZoom('out')} variant="outline"><ZoomOut /></Button>
                <Button size="icon" onClick={centerAndReset} variant="outline"><Maximize /></Button>
            </div>

            {activePoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 map-ui-element"
                >
                    <Card className="w-80 glassmorphic-card">
                        <CardHeader>
                            <CardTitle className="text-xl font-headline">{activePoi.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full font-bold">
                                <Link href={`/wiki/${activePoi.portalId}`}>Ver na Wiki</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            
            {drawingPoints.length > 0 && activeTool === 'draw' && (
                <DrawingToolbar onClear={() => { setDrawingPoints([]); setDrawingDistance(0); }} distance={drawingDistance} />
            )}
        </div>
    );
}
