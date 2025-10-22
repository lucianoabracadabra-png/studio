'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth } from '@/lib/character-data';

const BodyPartIcon = ({ part }: { part: 'head' | 'torso' | 'arm' | 'leg' }) => {
    const icons = {
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-5 5v2.5a2.5 2.5 0 0 0 2.5 2.5h5A2.5 2.5 0 0 0 17 9.5V7a5 5 0 0 0-5-5z" />
                <path d="M19 14c-1.5 0-2.8.5-4 1.5-1.2-1-2.5-1.5-4-1.5s-2.8.5-4 1.5" />
                <path d="M12 12v10" />
            </svg>
        ),
        torso: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 2v2"/><path d="M12 8v2"/><path d="M12 14v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="m6.34 17.66-1.41 1.41"/><path d="M2 12h2"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M20 12h2"/>
            </svg>
        ),
        arm: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12v10" />
                <path d="M16 12a4 4 0 1 0-8 0" />
            </svg>
        ),
        leg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12v10" />
                <path d="M6 12a6 6 0 0 1 12 0" />
            </svg>
        ),
    };
    // This is a simple placeholder to get a different icon.
    // In a real app you might have different icons for left/right.
    const effectivePart = part.includes('Arm') ? 'arm' : part.includes('Leg') ? 'leg' : part;

    // The user image had specific simple icons. Let's try to replicate them with inline SVGs.
    const userIcons = {
        head: <path d="M15.5 8.5a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0zM5 20v-2.5a2.5 2.5 0 0 1 2.5-2.5h9a2.5 2.5 0 0 1 2.5 2.5V20" />,
        torso: <path d="M15 4a3 3 0 0 1-6 0h6zm-2 2h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2z" />,
        arm: <path d="M19 14.2c0 2.4-1.6 4.4-3.8 4.8l-1.7-1.7c.3-.4.5-1 .5-1.6 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .6.2 1.2.5 1.6l-1.7 1.7C5.6 18.6 4 16.6 4 14.2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6.2z" />,
        leg: <path d="M10 12H8v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8h-2" />,
    }

    const simpleIcons = {
        head: <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.3 0-6 2.7-6 6v2h12v-2c0-3.3-2.7-6-6-6z" />,
        torso: <path d="M4 6h16v12H4z" />,
        arm: <path d="M7 22v-8h3v8H7zm7-10h3v10h-3v-10z" />,
        leg: <path d="M6 22V10h4v12H6zm8 0V10h4v12h-4z" />
    }
    
    // The user's image shows very abstract body parts. Let's create SVGs for them.
    const abstractIcons = {
        head: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full"><path d="M12,2A4,4 0 0,0 8,6A4,4 0 0,0 12,10A4,4 0 0,0 16,6A4,4 0 0,0 12,2M12,12C9.33,12 4,13.33 4,16V20H20V16C20,13.33 14.67,12 12,12Z" /></svg>,
        torso: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full"><path d="M17.5,2H6.5A1.5,1.5 0 0,0 5,3.5V11A1,1 0 0,0 6,12H7V21A1,1 0 0,0 8,22H16A1,1 0 0,0 17,21V12H18A1,1 0 0,0 19,11V3.5A1.5,1.5 0 0,0 17.5,2Z" /></svg>,
        leftArm: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full"><path d="M 4,8 L 8,4 L 12,8 L 12,20 L 8,24 L 4,20 Z" /></svg>,
        rightArm: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full" transform='scale(-1, 1) translate(-24, 0)'><path d="M 4,8 L 8,4 L 12,8 L 12,20 L 8,24 L 4,20 Z" /></svg>,
        leftLeg: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full"><path d="M 8,4 L 12,4 L 12,16 L 16,20 L 12,20 L 8,16 Z" /></svg>,
        rightLeg: <svg viewBox="0 0 24 24" fill="white" className="w-full h-full" transform='scale(-1, 1) translate(-24, 0)'><path d="M 8,4 L 12,4 L 12,16 L 16,20 L 12,20 L 8,16 Z" /></svg>
    }
    
    let iconToShow;
    if(part === 'head') iconToShow = abstractIcons.head;
    else if(part === 'torso') iconToShow = abstractIcons.torso;
    else if(part === 'leftArm') iconToShow = abstractIcons.leftArm;
    else if(part === 'rightArm') iconToShow = abstractIcons.rightArm;
    else if(part === 'leftLeg') iconToShow = abstractIcons.leftLeg;
    else if(part === 'rightLeg') iconToShow = abstractIcons.rightLeg;
    else iconToShow = <div />;

    return <div className="w-8 h-8 md:w-10 md:h-10 text-white">{iconToShow}</div>
}

const HealthGrid = ({ part, onHealthChange }: { part: BodyPartHealth, onHealthChange: (newHealth: number) => void }) => {
    const totalBoxes = part.max;
    const currentHealth = part.current;

    const handleClick = (boxIndex: number) => {
        const newHealth = boxIndex + 1;
        if (newHealth === currentHealth) {
            onHealthChange(newHealth - 1);
        } else {
            onHealthChange(newHealth);
        }
    };

    return (
        <div className="health-grid" style={{ '--grid-cols': 3 } as React.CSSProperties}>
            {[...Array(totalBoxes)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "health-box",
                        i < currentHealth ? 'filled' : 'empty'
                    )}
                    onClick={() => handleClick(i)}
                />
            ))}
        </div>
    );
};


const BodyPartDisplay = ({ part, onHealthChange, partId }: { part: BodyPartHealth, onHealthChange: (partId: any, newHealth: number) => void, partId: keyof Character['health']['bodyParts'] }) => {
    return (
        <div className={cn("body-part-container", `body-part-${partId}`)}>
             <div className="icon-container">
                <BodyPartIcon part={partId as any} />
             </div>
             <HealthGrid part={part} onHealthChange={(newHealth) => onHealthChange(partId, newHealth)} />
             {partId === 'head' && (
                <div className="head-wounds">
                    <div className="head-wound-box blue"></div>
                    <div className="head-wound-box orange"></div>
                    <div className="head-wound-box red"></div>
                </div>
            )}
        </div>
    );
}

type HealthPanelProps = {
    healthData: Character['health'];
    onHealthChange: (partId: keyof Character['health']['bodyParts'], newHealth: number) => void;
};

export function HealthPanel({ healthData, onHealthChange }: HealthPanelProps) {
    
    const handleValueChange = (partId: keyof Character['health']['bodyParts'], amount: number) => {
        const part = healthData.bodyParts[partId];
        const newHealth = Math.max(0, Math.min(part.max, part.current + amount));
        onHealthChange(partId, newHealth);
    }

    return (
        <Card className="glassmorphic-card">
            <CardHeader className='p-2 bg-yellow-600/10 border-b-2 border-yellow-400/50 rounded-t-lg'>
                <div className='flex items-center justify-between h-8'>
                    <Button onClick={() => handleValueChange('torso', -1) } variant='ghost' size='icon' className='text-white hover:bg-white/10'><Minus className='h-5 w-5'/></Button>
                    <div className='flex items-center gap-4'>
                        <Heart className="h-6 w-6 text-white" fill="white"/>
                        <CardTitle className="font-headline text-xl text-white tracking-widest">PONTOS DE VIDA</CardTitle>
                    </div>
                    <Button onClick={() => handleValueChange('torso', 1) } variant='ghost' size='icon' className='text-white hover:bg-white/10'><Plus className='h-5 w-5'/></Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 bg-gray-300 dark:bg-gray-700/50">
                <div className="health-diagram">
                    <BodyPartDisplay part={healthData.bodyParts.head} onHealthChange={onHealthChange} partId="head" />
                    <BodyPartDisplay part={healthData.bodyParts.torso} onHealthChange={onHealthChange} partId="torso" />
                    <BodyPartDisplay part={healthData.bodyParts.leftArm} onHealthChange={onHealthChange} partId="leftArm" />
                    <BodyPartDisplay part={healthData.bodyParts.rightArm} onHealthChange={onHealthChange} partId="rightArm" />
                    <BodyPartDisplay part={healthData.bodyParts.leftLeg} onHealthChange={onHealthChange} partId="leftLeg" />
                    <BodyPartDisplay part={healthData.bodyParts.rightLeg} onHealthChange={onHealthChange} partId="rightLeg" />
                </div>
            </CardContent>
        </Card>
    );
}
