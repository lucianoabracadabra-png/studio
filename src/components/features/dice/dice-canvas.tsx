'use client';
import { Canvas } from '@react-three/fiber';
import { Die3DModel, type DiceType } from './die-3d-model';
import { Stage, OrbitControls, Environment } from '@react-three/drei';
import { Vector3 } from 'three';

interface DiceCanvasProps {
  dice: { type: DiceType, hue: number }[];
  onRoll: (notation: string) => void;
}

export const DiceCanvas = ({ dice, onRoll }: DiceCanvasProps) => {
  const getPosition = (index: number) => {
    const positions = [
      new Vector3(-0.8, 1, 0),
      new Vector3(0.8, 1, 0),
      new Vector3(-0.8, -0.2, 0),
      new Vector3(0.8, -0.2, 0),
      new Vector3(-0.8, -1.4, 0),
      new Vector3(0.8, -1.4, 0),
    ];
    return positions[index] || new Vector3(0, 0, 0);
  }

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 25 }} shadows={false}>
      <Stage environment="city" intensity={0.5} adjustCamera={false}>
        {dice.map((die, index) => (
          <Die3DModel
            key={die.type}
            type={die.type}
            hue={die.hue}
            position={getPosition(index)}
            onRoll={onRoll}
          />
        ))}
      </Stage>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
      <Environment preset="city" />
    </Canvas>
  );
};
