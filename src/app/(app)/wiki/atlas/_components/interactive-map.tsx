'use client';
import { useState, useRef, useEffect } from 'react';
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
    setPoints, 
    mapZoom, 
    activeTool,
    setDistance
}: { 
    points: Point[], 
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>, 
    mapZoom: number,
    activeTool: AtlasTool,
    setDistance: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const PIXELS_PER_UNIT = 50;
    const UNIT_NAME = 'km';
    const UNIT_CONVERSION = 10; // 50px = 10km

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (activeTool !== 'draw') return;
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const newPoint = {
            x: (e.clientX - rect.left) / mapZoom,
            y: (e.clientY - rect.top) / mapZoom,
        };
        setPoints([newPoint]);
        setDistance(0);
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawing || activeTool !== 'draw') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const newPoint = {
            x: (e.clientX - rect.left) / mapZoom,
            y: (e.clientY - rect.top) / mapZoom,
        };
        setPoints(prev => [...prev, newPoint]);
    };
    
    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

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
    
    useEffect(() => {
        let totalLength = 0;
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i-1];
            const p2 = points[i];
            totalLength += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
        const calculatedDistance = (totalLength / PIXELS_PER_UNIT) * UNIT_CONVERSION;
        setDistance(calculatedDistance);
    }, [points, setDistance]);

    return (
        <svg 
            className="absolute top-0 left-0 w-full h-full"
            style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <g>
                <path d={pathData} strokeWidth={3 / mapZoom} stroke="hsl(var(--accent))" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px hsl(var(--accent)))`}} />
                {ticks.map((tick, i) => (
                    <line key={i} x1={tick.x - 5/mapZoom} y1={tick.y} x2={tick.x + 5/mapZoom} y2={tick.y} stroke="hsl(var(--accent))" strokeWidth={4/mapZoom} transform={`rotate(90 ${tick.x} ${tick.y})`} />
                ))}
            </g>
        </svg>
    );
};

const DrawingToolbar = ({ onClear, distance, unit = 'km' }: { onClear: () => void, distance: number, unit?: string }) => {
    return (
        <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
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
    
    const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
    const [drawingDistance, setDrawingDistance] = useState(0);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    
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
        if (activeTool === 'pan' && e.target === e.currentTarget) {
            setActivePoi(null);
        }
    }
    
    useEffect(() => {
        if(activeTool !== 'draw') {
            setDrawingPoints([]);
        }
    }, [activeTool])

    return (
        <div ref={mapContainerRef} className="w-full h-full rounded-lg border overflow-hidden relative bg-black">
            <motion.div
                className={cn("absolute top-0 left-0", activeTool === 'pan' && "cursor-grab active:cursor-grabbing")}
                style={{ x, y, scale: zoom, width: '2000px', height: '1500px' }}
                drag={activeTool === 'pan'}
                dragMomentum={false}
                onClick={handleMapClick}
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

                <motion.g style={{ transform: `scale(${1 / zoom})` }}>
                  <DrawingLayer points={drawingPoints} setPoints={setDrawingPoints} mapZoom={1} activeTool={activeTool} setDistance={setDrawingDistance} />
                </motion.g>

                {pointsOfInterest.map(poi => (
                    <motion.div
                        key={poi.id}
                        className="absolute"
                        style={{ 
                            left: `${poi.position.x}%`, 
                            top: `${poi.position.y}%`,
                        }}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 / zoom }}
                    >
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button 
                                        onClick={() => activeTool === 'pan' && setActivePoi(poi)} 
                                        className='focus:outline-none' 
                                        style={{ transform: `scale(${1 / zoom}) translate(-50%, -100%)`, cursor: activeTool === 'pan' ? 'pointer' : 'default' }}
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

            <div className="absolute top-4 left-4 z-10">
                <ToggleGroup type="single" value={activeTool} onValueChange={(value) => setActiveTool(value as AtlasTool || 'pan')} className="bg-card/80 backdrop-blur-sm rounded-lg p-1 border">
                    <ToggleGroupItem value="pan" aria-label="Mover Mapa">
                        <MousePointer />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="draw" aria-label="Desenhar Rota">
                        <Pen />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <Button size="icon" onClick={() => handleZoom('in')} variant="outline"><ZoomIn /></Button>
                <Button size="icon" onClick={() => handleZoom('out')} variant="outline"><ZoomOut /></Button>
                <Button size="icon" onClick={centerAndReset} variant="outline"><Maximize /></Button>
            </div>

            {activePoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
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
                <DrawingToolbar onClear={() => setDrawingPoints([])} distance={drawingDistance} />
            )}
        </div>
    );
}
