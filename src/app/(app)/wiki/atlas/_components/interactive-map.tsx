'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { pointsOfInterest } from '@/lib/wiki-data';
import { MapPin, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';


const mapImage = PlaceHolderImages.find(p => p.id === 'world-map')!;

export function InteractiveMap() {
    const [zoom, setZoom] = useState(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);

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
        // If the click is on the map itself (not a child like a POI marker button), close the active POI.
        if (e.target === e.currentTarget) {
            setActivePoi(null);
        }
    }

    return (
        <div ref={mapContainerRef} className="w-full h-full rounded-lg border overflow-hidden relative bg-black">
            <motion.div
                className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                style={{ x, y, scale: zoom, width: '2000px', height: '1500px' }}
                drag
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
                                    <button onClick={() => setActivePoi(poi)} className='focus:outline-none' style={{ transform: `scale(${1 / zoom}) translate(-50%, -100%)` }}>
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

            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" onClick={() => handleZoom('in')} variant="outline"><ZoomIn /></Button>
                <Button size="icon" onClick={() => handleZoom('out')} variant="outline"><ZoomOut /></Button>
                <Button size="icon" onClick={centerAndReset} variant="outline"><Maximize /></Button>
            </div>

            {activePoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
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
        </div>
    );
}
