import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

interface FlowerFieldProps {
  count?: number;
  petalCount?: number;
}

// Flower component
const Flower = ({ position, scale, rotation, color }: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}) => {
  const flowerRef = useRef<THREE.Group>(null!);
  
  // Optimize animation - use delta time for smooth animation
  useFrame((state) => {
    if (!flowerRef.current) return;
    
    // Gentle sway based on position for variation
    flowerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 10) * 0.1;
  });
  
  return (
    <group ref={flowerRef} position={position} scale={scale} rotation={rotation}>
      {/* Flower stem */}
      <Instance color="#5d8a5e" scale={[0.05, 0.5, 0.05]} position={[0, -0.25, 0]} />
      
      {/* Flower petals */}
      <Instance color={color} scale={[0.2, 0.05, 0.2]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Instance color={color} scale={[0.2, 0.05, 0.2]} position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]} />
      <Instance color={color} scale={[0.2, 0.05, 0.2]} position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Instance color={color} scale={[0.2, 0.05, 0.2]} position={[0, 0, 0]} rotation={[Math.PI / 2, 3 * Math.PI / 4, 0]} />
      
      {/* Flower center */}
      <Instance color="#f9dc5c" scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]} />
    </group>
  );
};

// Petal component for falling animation
const RosePetal = ({ position, rotation, scale, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}) => {
  const petalRef = useRef<THREE.Mesh>(null!);
  const speed = useRef(Math.random() * 0.5 + 0.2);
  const rotationSpeed = useRef({
    x: Math.random() * 0.01 - 0.005,
    y: Math.random() * 0.01 - 0.005,
    z: Math.random() * 0.01 - 0.005
  });
  
  // Animation for falling petals
  useFrame((state) => {
    if (!petalRef.current) return;
    
    // Falling animation
    petalRef.current.position.y -= speed.current * 0.01;
    
    // Sideways drift
    petalRef.current.position.x += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    
    // Rotation animation
    petalRef.current.rotation.x += rotationSpeed.current.x;
    petalRef.current.rotation.y += rotationSpeed.current.y;
    petalRef.current.rotation.z += rotationSpeed.current.z;
    
    // Reset position when petal falls below the ground
    if (petalRef.current.position.y < -10) {
      petalRef.current.position.y = Math.random() * 10 + 10; // Reset to above screen
      petalRef.current.position.x = (Math.random() - 0.5) * 20;
      petalRef.current.position.z = (Math.random() - 0.5) * 20;
    }
  });
  
  return (
    <Instance 
      ref={petalRef}
      color={color}
      position={position}
      rotation={rotation}
      scale={[0.2 * scale, 0.01 * scale, 0.1 * scale]}
    />
  );
};

const FlowerField: React.FC<FlowerFieldProps> = ({ count = 100, petalCount = 200 }) => {
  const { size } = useThree();
  
  // Adjust count based on screen size for performance
  const adjustedCount = useMemo(() => {
    return size.width < 768 ? Math.floor(count * 0.6) : count;
  }, [count, size.width]);
  
  const adjustedPetalCount = useMemo(() => {
    return size.width < 768 ? Math.floor(petalCount * 0.5) : petalCount;
  }, [petalCount, size.width]);
  
  // Colors for gradient effect
  const colors = useMemo(() => [
    '#ff9f8e', '#ef7c8e', '#d8a7b1', '#f8c3cd', '#feeeed', '#f4b8d6', '#fedfe1'
  ], []);
  
  // Create random flowers - memoized for performance
  const flowers = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: number;
      color: string;
      rotation: [number, number, number];
      key: number;
    }[] = [];
    
    for (let i = 0; i < adjustedCount; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      const y = -1; // On the ground
      
      const scale = 0.3 + Math.random() * 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation: [number, number, number] = [0, Math.random() * Math.PI, 0];
      
      items.push({
        position: [x, y, z],
        scale,
        color,
        rotation,
        key: i
      });
    }
    
    return items;
  }, [adjustedCount, colors]);
  
  // Create falling rose petals
  const petals = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: number;
      color: string;
      rotation: [number, number, number];
      key: number;
    }[] = [];
    
    for (let i = 0; i < adjustedPetalCount; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = Math.random() * 20 - 3; // Distributed from above to below
      const z = (Math.random() - 0.5) * 30;
      
      const scale = 0.5 + Math.random() * 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation: [number, number, number] = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      items.push({
        position: [x, y, z],
        scale,
        color,
        rotation,
        key: i
      });
    }
    
    return items;
  }, [adjustedPetalCount, colors]);
  
  return (
    <>
      {/* Flowers */}
      <Instances>
        <boxGeometry />
        <meshStandardMaterial />
        
        {flowers.map((flower) => (
          <Flower
            key={flower.key}
            position={flower.position}
            scale={flower.scale}
            color={flower.color}
            rotation={flower.rotation}
          />
        ))}
      </Instances>
      
      {/* Rose petals */}
      <Instances>
        <boxGeometry />
        <meshStandardMaterial />
        
        {petals.map((petal) => (
          <RosePetal
            key={petal.key}
            position={petal.position}
            scale={petal.scale}
            color={petal.color}
            rotation={petal.rotation}
          />
        ))}
      </Instances>
    </>
  );
};

export default FlowerField; 