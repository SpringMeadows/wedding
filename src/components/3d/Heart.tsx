import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface HeartProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  distort?: number;
  onClick?: () => void;
  pulseSpeed?: number;
}

const Heart: React.FC<HeartProps> = ({
  position,
  scale = 1,
  color = '#ef7c8e',
  speed = 1,
  distort = 0.3,
  onClick,
  pulseSpeed = 1
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  // Create heart shape - memoized for performance
  const heartGeometry = useMemo(() => {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.6, x - 0.15, y + 0.8, x, y + 0.95);
    heartShape.bezierCurveTo(x + 0.15, y + 0.8, x + 0.3, y + 0.6, x + 0.3, y + 0.35);
    heartShape.bezierCurveTo(x + 0.3, y + 0.35, x + 0.3, y, x, y);
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    
    return new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  }, []);

  // Animation loop - optimized
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Gentle floating motion
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
    
    // Gentle rotation
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1;
    mesh.current.rotation.x = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.1;
    
    // Pulsing effect
    const pulse = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1;
    mesh.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={onClick}
      frustumCulled={true}
    >
      <primitive object={heartGeometry} attach="geometry" />
      <MeshDistortMaterial 
        color={color} 
        speed={0.5} 
        distort={distort} 
        metalness={0.3}
        roughness={0.5}
      />
    </mesh>
  );
};

export default Heart; 