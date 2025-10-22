'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus, X, Asterisk, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Character, BodyPartHealth, HealthState } from '@/lib/character-data';

const healthStateOrder: HealthState[] = ['clean', 'simple', 'lethal', 'aggravated'];

const getNextHealthState = (currentState: HealthState): HealthState => {
    const currentIndex = healthStateOrder.indexOf(currentState);
    if (currentIndex === -1) return 'simple'; // Default to simple if state is unknown
    if (currentIndex === healthStateOrder.length - 1) return 'clean'; // Cycle back to clean
    return healthStateOrder[currentIndex + 1];
};


const BodyPartIcon = ({ part }: { part: 'head' | 'torso' | 'arm' | 'leg' | string }) => {
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

const HealthGrid = ({ part, partId, onHealthChange }: { part: BodyPartHealth, partId: keyof Character['health']['bodyParts'], onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void }) => {
    
    const handleClick = (boxIndex: number) => {
        const currentState = part.states[boxIndex];
        const newState = getNextHealthState(currentState);
        onHealthChange(partId, boxIndex, newState);
    };

    const stateStyles = {
        clean: 'bg-green-500/50 border-green-500/80',
        simple: 'bg-blue-500/80 border-blue-400',
        lethal: 'bg-yellow-500/80 border-yellow-400',
        aggravated: 'bg-red-500/80 border-red-400',
    };
    
    const stateIcons = {
        simple: <div className="w-full h-1/3 bg-black/50" />,
        lethal: <X className="w-2/3 h-2/3 text-black/80" strokeWidth={5} />,
        aggravated: <Asterisk className="w-2/3 h-2/3 text-black/80" strokeWidth={4}/>
    }

    return (
        <div className="health-grid" style={{ '--grid-cols': 3 } as React.CSSProperties}>
            {part.states.map((state, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "health-box",
                        stateStyles[state],
                    )}
                    onClick={() => handleClick(i)}
                >
                    <div className={cn("health-box-inner flex items-center justify-center")}>
                        {state !== 'clean' && stateIcons[state as keyof typeof stateIcons]}
                    </div>
                </div>
            ))}
        </div>
    );
};


const BodyPartDisplay = ({ part, onHealthChange, partId }: { part: BodyPartHealth, onHealthChange: (partId: any, boxIndex: number, newState: HealthState) => void, partId: keyof Character['health']['bodyParts'] }) => {
    return (
        <div className={cn("body-part-container", `body-part-${partId}`)}>
             <div className="icon-container">
                <BodyPartIcon part={partId} />
             </div>
             <HealthGrid part={part} partId={partId} onHealthChange={onHealthChange} />
             {partId === 'head' && (
                <div className="head-wounds">
                    <div className="head-wound-box blue"></div>
                    <div className="head-wound-box yellow"></div>
                    <div className="head-wound-box red"></div>
                </div>
            )}
        </div>
    );
}

type HealthPanelProps = {
    healthData: Character['health'];
    onHealthChange: (partId: keyof Character['health']['bodyParts'], boxIndex: number, newState: HealthState) => void;
};

export function HealthPanel({ healthData, onHealthChange }: HealthPanelProps) {

    return (
        <Card className="glassmorphic-card">
            <CardContent className="p-4 bg-gray-300 dark:bg-gray-700/50 rounded-lg">
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
