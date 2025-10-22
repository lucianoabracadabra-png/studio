'use client';
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Mesh, Vector3 } from 'three';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

const modelPaths: Record<DiceType, string> = {
    d4: '/models/d4.glb',
    d6: '/models/d6.glb',
    d8: '/models/d8.glb',
    d10: '/models/d10.glb',
    d12: '/models/d12.glb',
    d20: '/models/d20.glb',
};

interface Die3DModelProps {
    type: DiceType;
    hue: number;
    position: Vector3;
    onRoll: (notation: string) => void;
}

export function Die3DModel({ type, hue, position, onRoll }: Die3DModelProps) {
  const ref = useRef<Mesh>(null!);
  const { nodes } = useGLTF(modelPaths[type]);
  const geometry = (Object.values(nodes)[0] as Mesh).geometry;

  const [isRolling, setIsRolling] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState({ x: 0, y: 0, z: 0 });

  useFrame((_, delta) => {
    if (isRolling) {
      ref.current.rotation.x += rotationSpeed.x * delta;
      ref.current.rotation.y += rotationSpeed.y * delta;
      ref.current.rotation.z += rotationSpeed.z * delta;

      // Dampen rotation
      setRotationSpeed(prev => ({
        x: prev.x * 0.98,
        y: prev.y * 0.98,
        z: prev.z * 0.98,
      }));

      if (Math.abs(rotationSpeed.x) + Math.abs(rotationSpeed.y) + Math.abs(rotationSpeed.z) < 0.1) {
        setIsRolling(false);
      }
    }
  });

  const handleClick = () => {
    if (isRolling) return;

    onRoll(`1${type}`);
    setIsRolling(true);
    setRotationSpeed({
      x: Math.random() * 20 + 10,
      y: Math.random() * 20 + 10,
      z: Math.random() * 20 + 10,
    });
  };

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      onClick={handleClick}
      scale={type === 'd10' ? 0.012 : 0.015}
    >
      <meshStandardMaterial color={`hsl(${hue}, 80%, 60%)`} metalness={0.2} roughness={0.5} />
    </mesh>
  );
}

// Preload models
Object.values(modelPaths).forEach(useGLTF.preload);
