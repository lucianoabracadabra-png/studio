'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { Point, DrawingToolType, DrawingOptions } from './vtt-layout';

// Represents a completed shape on the canvas
export interface Shape {
    id: string;
    tool: DrawingToolType;
    points: Point[]; // For freehand, ruler
    center?: Point; // For circle, square
    radius?: number; // For circle
    width?: number; // For square
    height?: number; // For square
    options: DrawingOptions;
}

// A shape that has not yet been given an ID and saved.
export type DraftShape = Omit<Shape, 'id'>;

interface DrawingLayerProps {
    width: number;
    height: number;
    activeDrawingTool: DrawingToolType | null;
    drawingOptions: DrawingOptions;
    onShapeAdd: (shape: DraftShape) => void; // Callback to save shape
}

export function DrawingLayer({ 
    width, 
    height, 
    activeDrawingTool, 
    drawingOptions,
    onShapeAdd
}: DrawingLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

    // Effect to draw on the canvas when points change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas for re-drawing
        ctx.clearRect(0, 0, width, height);

        // Draw the current, in-progress shape
        if (isDrawing && startPoint && currentPoint && activeDrawingTool) {
            ctx.strokeStyle = drawingOptions.color;
            ctx.lineWidth = drawingOptions.strokeWidth;
            ctx.fillStyle = drawingOptions.color.replace('ff', '33'); // Example fill
            
            drawTemporaryShape(ctx, activeDrawingTool, startPoint, currentPoint, drawingOptions.fill);
        }

    }, [isDrawing, startPoint, currentPoint, activeDrawingTool, drawingOptions, width, height]);

    const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { 
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!activeDrawingTool) return;
        setIsDrawing(true);
        const pos = getMousePosition(e);
        setStartPoint(pos);
        setCurrentPoint(pos);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setCurrentPoint(getMousePosition(e));
    };

    const handleMouseUp = () => {
        if (!isDrawing || !startPoint || !currentPoint || !activeDrawingTool) return;
        
        const newShape: DraftShape = {
            tool: activeDrawingTool,
            points: [startPoint, currentPoint],
            options: drawingOptions,
        };

        // For now, we don't save shapes, just draw temporarily
        // onShapeAdd(newShape);

        setIsDrawing(false);
        setStartPoint(null);
        setCurrentPoint(null);
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // End drawing if mouse leaves canvas
            className="absolute top-0 left-0"
            style={{ pointerEvents: activeDrawingTool ? 'auto' : 'none' }} // Only capture mouse when a tool is active
        />
    );
}

// Helper function to draw the temporary shape while dragging
function drawTemporaryShape(ctx: CanvasRenderingContext2D, tool: DrawingToolType, start: Point, end: Point, fill: boolean) {
    ctx.beginPath();
    switch(tool) {
        case 'ruler':
        case 'freehand': // For now, freehand is just a line
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
            fill ? ctx.fill() : ctx.stroke();
            break;
        case 'square':
            const width = end.x - start.x;
            const height = end.y - start.y;
            ctx.rect(start.x, start.y, width, height);
            fill ? ctx.fill() : ctx.stroke();
            break;
    }
}
