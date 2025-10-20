'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
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
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activePoi, setActivePoi] = useState<(typeof pointsOfInterest)[0] | null>(null);

    const mapContainerRef = useRef<HTMLDivElement>(null);

    const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setPosition(prev => ({
            x: prev.x + info.delta.x,
            y: prev.y + info.delta.y
        }));
    };

    const handleZoom = (direction: 'in' | 'out') => {
        setZoom(prevZoom => {
            const newZoom = direction === 'in' ? prevZoom * 1.2 : prevZoom / 1.2;
            return Math.max(0.5, Math.min(5, newZoom));
        });
    };
    
    const centerAndReset = () => {
        setZoom(1);
        setPosition({x: 0, y: 0});
    }

    return (
        <div ref={mapContainerRef} className="w-full h-full rounded-lg border overflow-hidden relative bg-black">
            <motion.div
                className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                style={{ x: position.x, y: position.y, scale: zoom }}
                drag
                dragMomentum={false}
                onDrag={handlePan}
            >
                <div className="relative" style={{ width: '2000px', height: '1500px' }}>
                    <Image
                        src={mapImage.imageUrl}
                        alt={mapImage.description}
                        layout="fill"
                        objectFit="cover"
                        priority
                        className='select-none'
                        data-ai-hint={mapImage.imageHint}
                    />

                    {pointsOfInterest.map(poi => (
                        <div
                            key={poi.id}
                            className="absolute"
                            style={{ 
                                left: `${poi.position.x}%`, 
                                top: `${poi.position.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={() => setActivePoi(poi)} className='focus:outline-none'>
                                            <MapPin className={cn(
                                                'h-8 w-8 text-destructive drop-shadow-lg transition-all duration-300 hover:scale-125 hover:text-accent',
                                                activePoi?.id === poi.id && 'text-accent scale-125'
                                            )} style={{ filter: 'drop-shadow(0 0 5px hsl(var(--accent)))' }} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{poi.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                </div>
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
