import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingHeartsProps {
  count?: number;
  colors?: string[];
  area?: number;
  baseSize?: number;
  intensity?: number;
  fallingSpeed?: number;
}

// Create varied heart shapes for more doodle-like appearance
const createHeartShapes = () => {
  // Regular heart shape
  const regularHeart = new THREE.Shape();
  const x = 0, y = 0;
  
  regularHeart.moveTo(x + 0.25, y + 0.25);
  regularHeart.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  regularHeart.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  regularHeart.bezierCurveTo(x - 0.3, y + 0.6, x - 0.15, y + 0.8, x, y + 0.95);
  regularHeart.bezierCurveTo(x + 0.15, y + 0.8, x + 0.3, y + 0.6, x + 0.3, y + 0.35);
  regularHeart.bezierCurveTo(x + 0.3, y + 0.35, x + 0.3, y, x, y);
  
  // Doodle-like heart 1 (rounder)
  const doodleHeart1 = new THREE.Shape();
  doodleHeart1.moveTo(x, y + 0.3);
  doodleHeart1.bezierCurveTo(x - 0.1, y + 0.1, x - 0.4, y, x - 0.7, y + 0.1);
  doodleHeart1.bezierCurveTo(x - 1.1, y + 0.2, x - 1.1, y + 0.7, x - 0.6, y + 1.1);
  doodleHeart1.bezierCurveTo(x - 0.4, y + 1.3, x - 0.2, y + 1.4, x, y + 1.2);
  doodleHeart1.bezierCurveTo(x + 0.2, y + 1.4, x + 0.4, y + 1.3, x + 0.6, y + 1.1);
  doodleHeart1.bezierCurveTo(x + 1.1, y + 0.7, x + 1.1, y + 0.2, x + 0.7, y + 0.1);
  doodleHeart1.bezierCurveTo(x + 0.4, y, x + 0.1, y + 0.1, x, y + 0.3);
  
  // Doodle-like heart 2 (more exaggerated)
  const doodleHeart2 = new THREE.Shape();
  doodleHeart2.moveTo(x, y + 0.25);
  doodleHeart2.bezierCurveTo(x, y + 0.2, x - 0.5, y - 0.3, x - 0.8, y);
  doodleHeart2.bezierCurveTo(x - 1.2, y + 0.3, x - 1.3, y + 0.8, x - 0.5, y + 1.2);
  doodleHeart2.bezierCurveTo(x - 0.2, y + 1.4, x - 0.1, y + 1.5, x, y + 1.3);
  doodleHeart2.bezierCurveTo(x + 0.1, y + 1.5, x + 0.2, y + 1.4, x + 0.5, y + 1.2);
  doodleHeart2.bezierCurveTo(x + 1.3, y + 0.8, x + 1.2, y + 0.3, x + 0.8, y);
  doodleHeart2.bezierCurveTo(x + 0.5, y - 0.3, x, y + 0.2, x, y + 0.25);
  
  return [regularHeart, doodleHeart1, doodleHeart2];
};

const FloatingHearts: React.FC<FloatingHeartsProps> = ({ 
  count = 100, 
  colors = ['#ff1744', '#ff4081', '#ff80ab', '#ffb7c5', '#ffffff', '#fce4ec', '#f8bbd0'],
  area = 70,
  baseSize = 0.5,
  intensity = 0.7,
  fallingSpeed = 1.2
}) => {
  const { size } = useThree();
  
  // Create heart geometries - different variations
  const heartGeometries = useMemo(() => {
    const shapes = createHeartShapes();
    
    return shapes.map(shape => {
      const extrudeSettings = {
        depth: 0.05,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    });
  }, []);
  
  // Create memoized array of heart instances
  const hearts = useMemo(() => {
    const temp = [];
    const responsiveRatio = Math.min(size.width, size.height) / 1000;
    const responsiveArea = area * responsiveRatio;
    
    for (let i = 0; i < count; i++) {
      // Choose a random heart shape variation
      const heartVariation = Math.floor(Math.random() * heartGeometries.length);
      
      // Randomize starting position
      const position = [
        (Math.random() - 0.5) * responsiveArea * 2,                  // x: wider distribution
        (Math.random() * responsiveArea * 1.5) + responsiveArea/2,   // y: start above the visible area
        (Math.random() - 0.5) * (responsiveArea * 0.5) - 10          // z: slightly biased toward viewer
      ];
      
      // Randomize rotation
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      // Randomize animation speeds
      const pulseSpeed = 0.5 + Math.random() * 1.5;
      const floatSpeed = 0.2 + Math.random() * 0.8;
      const rotationSpeed = 0.1 + Math.random() * 0.3;
      const rotationAmplitude = Math.random() * 0.2 + 0.1;
      const fallSpeed = (0.5 + Math.random() * 0.8) * fallingSpeed; // Varied falling speed
      
      // Randomize size
      const size = baseSize * (0.3 + Math.random() * 1.7) * responsiveRatio;
      
      // Randomize color
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Randomize opacity and emissive intensity
      const opacity = 0.6 + Math.random() * 0.4;
      const emissiveIntensity = 0.3 + Math.random() * 0.7 * intensity;
      
      // Add delay for staggered appearance
      const fallDelay = Math.random() * 15; // Random delay up to 15 seconds
      
      // Random pop effect chance
      const popType = Math.floor(Math.random() * 3); // 0: normal, 1: quick pop, 2: pulse
      const popAmplitude = 0.1 + Math.random() * 0.2;
      const popSpeed = popType === 1 ? 4 + Math.random() * 3 : 0.8 + Math.random() * 1.2;
      
      // Add heart to array
      temp.push({
        position,
        rotation,
        pulseSpeed,
        floatSpeed,
        rotationSpeed,
        rotationAmplitude,
        fallSpeed,
        size,
        color,
        opacity,
        emissiveIntensity,
        fallDelay,
        heartVariation,
        popType,
        popAmplitude,
        popSpeed
      });
    }
    
    return temp;
  }, [count, area, baseSize, colors, size, intensity, fallingSpeed, heartGeometries]);
  
  // Create refs for each heart
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update each heart's position and rotation
    hearts.forEach((heart, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      
      // Don't start falling until delay has passed
      if (time < heart.fallDelay) {
        mesh.position.y = heart.position[1];
        return;
      }
      
      // Calculate adjusted time (accounting for delay)
      const adjustedTime = time - heart.fallDelay;
      
      // Falling motion with gentle swaying
      mesh.position.y = heart.position[1] - (adjustedTime * heart.fallSpeed);
      
      // If fallen below view, reset to top with new random x position
      if (mesh.position.y < -area/2) {
        mesh.position.y = area + Math.random() * 20;
        mesh.position.x = (Math.random() - 0.5) * area * 2;
      }
      
      // Gentle sideways movement (swaying)
      mesh.position.x = heart.position[0] + 
        Math.sin(time * heart.floatSpeed) * (heart.size * 5);
      
      // 3D rotation for more dynamic movement
      mesh.rotation.x = heart.rotation[0] + time * heart.rotationSpeed;
      mesh.rotation.y = heart.rotation[1] + Math.sin(time * 0.5) * heart.rotationAmplitude;
      mesh.rotation.z = heart.rotation[2] + Math.cos(time * 0.5) * heart.rotationAmplitude;
      
      // Scale pulsing based on pop type
      let pulseScale = 1;
      
      switch(heart.popType) {
        case 0: // Normal gentle pulse
          pulseScale = 1 + Math.sin(time * heart.pulseSpeed) * 0.15;
          break;
        case 1: // Quick pop
          pulseScale = 1 + Math.max(0, Math.sin(time * heart.popSpeed) * heart.popAmplitude);
          break;
        case 2: // Double pulse (heartbeat-like)
          const beatPhase = (time * heart.popSpeed) % (2 * Math.PI);
          if (beatPhase < Math.PI * 0.3) {
            pulseScale = 1 + Math.sin(beatPhase * 3.33) * heart.popAmplitude;
          } else if (beatPhase < Math.PI * 0.6) {
            pulseScale = 1 + Math.sin((beatPhase - Math.PI * 0.3) * 3.33) * heart.popAmplitude * 1.3;
          } else {
            pulseScale = 1;
          }
          break;
      }
      
      mesh.scale.set(
        heart.size * pulseScale,
        heart.size * pulseScale,
        heart.size * pulseScale
      );
      
      // Update opacity based on position for fade out effect near bottom
      const distanceFromBottom = mesh.position.y + area/2;
      const fadeDistance = area * 0.2;
      if (distanceFromBottom < fadeDistance) {
        const material = mesh.material as THREE.MeshPhysicalMaterial;
        material.opacity = heart.opacity * (distanceFromBottom / fadeDistance);
      }
      
      // Update emissive intensity for pulsing glow effect
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = heart.emissiveIntensity * (0.8 + pulseScale * 0.4);
    });
  });
  
  return (
    <group>
      {hearts.map((heart, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          position={new THREE.Vector3(...heart.position)}
          rotation={new THREE.Euler(...heart.rotation)}
          scale={heart.size}
        >
          <primitive object={heartGeometries[heart.heartVariation]} attach="geometry" />
          <meshPhysicalMaterial
            color={heart.color}
            metalness={0.1}
            roughness={0.3}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            transparent
            opacity={heart.opacity}
            emissive={heart.color}
            emissiveIntensity={heart.emissiveIntensity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Add ambient light for better visibility of hearts */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
    </group>
  );
};

export default FloatingHearts; 