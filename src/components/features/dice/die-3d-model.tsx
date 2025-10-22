'use client';
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

interface Die3DModelProps {
  type: DiceType;
  hue: number;
  position: THREE.Vector3;
  onRoll: (notation: string) => void;
}

const modelPaths = {
  d4: '/models/d4.glb',
  d6: '/models/d6.glb',
  d8: '/models/d8.glb',
  d10: '/models/d10.glb',
  d12: '/models/d12.glb',
  d20: '/models/d20.glb',
};

export const Die3DModel = ({ type, hue, position, onRoll }: Die3DModelProps) => {
  const { scene } = useGLTF(modelPaths[type]);
  const groupRef = useRef<THREE.Group>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(new THREE.Vector3(0,0,0));

  // Clone scene to avoid sharing materials between instances
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const newMaterial = (child.material as THREE.MeshStandardMaterial).clone();
      const color = new THREE.Color();
      color.setHSL(hue / 360, 0.8, 0.6);
      newMaterial.color = color;
      newMaterial.emissive = color;
      newMaterial.emissiveIntensity = 0.2;
      child.material = newMaterial;
    }
  });

  const handleClick = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRotationSpeed(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
    ));
    setTimeout(() => {
        setIsRolling(false);
        onRoll(`1${type}`);
    }, 1200);
  };
  
  useFrame((_, delta) => {
    if (groupRef.current) {
        if (isRolling) {
            groupRef.current.rotation.x += rotationSpeed.x * delta;
            groupRef.current.rotation.y += rotationSpeed.y * delta;
            groupRef.current.rotation.z += rotationSpeed.z * delta;

            // Dampen rotation
            setRotationSpeed(prev => prev.multiplyScalar(1 - 2 * delta));
        }
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      <primitive object={clonedScene} scale={type === 'd10' ? 0.9 : 1} />
    </group>
  );
};

// Preload models
Object.values(modelPaths).forEach(useGLTF.preload);
