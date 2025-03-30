import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FallingRosesProps {
  count?: number;
  colors?: string[];
  area?: number;
  baseSize?: number;
  intensity?: number;
  fallingSpeed?: number;
}

// Create varied rose petal shapes
const createPetalShapes = () => {
  // Classic rose petal shape
  const classicPetal = new THREE.Shape();
  classicPetal.moveTo(0, 0);
  classicPetal.bezierCurveTo(0, 1.2, 1.2, 1.8, 1.5, 0.8);
  classicPetal.bezierCurveTo(1.8, 0, 1, -0.5, 0, 0);
  
  // Rounder petal shape
  const roundPetal = new THREE.Shape();
  roundPetal.moveTo(0, 0);
  roundPetal.bezierCurveTo(0.5, 0.8, 1.5, 1.2, 1.8, 0.5);
  roundPetal.bezierCurveTo(1.9, 0, 1.2, -0.4, 0.5, -0.2);
  roundPetal.bezierCurveTo(0.2, -0.3, -0.2, -0.2, 0, 0);
  
  // Heart-like petal
  const heartPetal = new THREE.Shape();
  heartPetal.moveTo(0, 0);
  heartPetal.bezierCurveTo(-0.2, 0.5, -0.8, 0.8, -0.8, 1.2);
  heartPetal.bezierCurveTo(-0.8, 1.6, -0.4, 1.8, 0, 1.4);
  heartPetal.bezierCurveTo(0.4, 1.8, 0.8, 1.6, 0.8, 1.2);
  heartPetal.bezierCurveTo(0.8, 0.8, 0.2, 0.5, 0, 0);
  
  // Doodle-like irregular petal
  const doodlePetal = new THREE.Shape();
  doodlePetal.moveTo(0, 0);
  doodlePetal.bezierCurveTo(0.2, 0.4, 0.8, 0.5, 1.0, 0.8);
  doodlePetal.bezierCurveTo(1.3, 1.2, 1.2, 1.6, 0.8, 1.6);
  doodlePetal.bezierCurveTo(0.4, 1.7, 0.2, 1.4, 0.1, 1.2);
  doodlePetal.bezierCurveTo(0, 1.4, -0.2, 1.7, -0.4, 1.6);
  doodlePetal.bezierCurveTo(-0.8, 1.5, -1.2, 1.0, -0.8, 0.6);
  doodlePetal.bezierCurveTo(-0.5, 0.3, -0.2, 0.2, 0, 0);
  
  return [classicPetal, roundPetal, heartPetal, doodlePetal];
};

const FallingRoses: React.FC<FallingRosesProps> = ({ 
  count = 80, 
  colors = ['#e91e63', '#ec407a', '#f06292', '#f48fb1', '#f8bbd0', '#d81b60'],
  area = 60,
  baseSize = 0.3,
  intensity = 0.5,
  fallingSpeed = 0.8
}) => {
  const { size } = useThree();
  
  // Create petal geometries - different variations
  const petalGeometries = useMemo(() => {
    const shapes = createPetalShapes();
    
    return shapes.map(shape => {
      const extrudeSettings = {
        depth: 0.02,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.01,
        bevelThickness: 0.01,
        curveSegments: 12
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    });
  }, []);
  
  // Create memoized array of petal instances
  const petals = useMemo(() => {
    const temp = [];
    const responsiveRatio = Math.min(size.width, size.height) / 1000;
    const responsiveArea = area * responsiveRatio;
    
    for (let i = 0; i < count; i++) {
      // Choose random petal shape
      const petalVariation = Math.floor(Math.random() * petalGeometries.length);
      
      // Randomize starting position
      const position = [
        (Math.random() - 0.5) * responsiveArea * 2,                  // x: wide distribution
        (Math.random() * responsiveArea * 1.5) + responsiveArea,     // y: start above the visible area
        (Math.random() - 0.5) * (responsiveArea * 0.5) - 5           // z: slightly biased toward viewer
      ];
      
      // Randomize rotation
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      // Randomize animation speeds
      const spinSpeed = 0.1 + Math.random() * 0.4;
      const swaySpeed = 0.2 + Math.random() * 0.8;
      const fallSpeed = (0.3 + Math.random() * 0.7) * fallingSpeed;
      const swayAmplitude = 1 + Math.random() * 3;
      
      // Add flutter effect params
      const flutterSpeed = 2 + Math.random() * 3;
      const flutterAmplitude = 0.1 + Math.random() * 0.3;
      const flutterPhaseOffset = Math.random() * Math.PI * 2;
      
      // Randomize size
      const size = baseSize * (0.6 + Math.random() * 0.7) * responsiveRatio;
      
      // Randomize color
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Add subtle color variation to each petal
      const colorVariation = 0.1; // 10% variation
      const baseColor = new THREE.Color(color);
      const adjustedColor = new THREE.Color(
        baseColor.r * (1 + (Math.random() * 2 - 1) * colorVariation),
        baseColor.g * (1 + (Math.random() * 2 - 1) * colorVariation),
        baseColor.b * (1 + (Math.random() * 2 - 1) * colorVariation)
      );
      
      // Randomize opacity
      const opacity = 0.7 + Math.random() * 0.3;
      const emissiveIntensity = 0.1 + Math.random() * 0.4 * intensity;
      
      // Add delay for staggered appearance
      const fallDelay = Math.random() * 20; // Random delay up to 20 seconds
      
      // Add petal to array
      temp.push({
        position,
        rotation,
        spinSpeed,
        swaySpeed,
        fallSpeed,
        swayAmplitude,
        flutterSpeed,
        flutterAmplitude,
        flutterPhaseOffset,
        size,
        color: adjustedColor.getHexString(),
        opacity,
        emissiveIntensity,
        fallDelay,
        petalVariation
      });
    }
    
    return temp;
  }, [count, area, baseSize, colors, size, intensity, fallingSpeed, petalGeometries]);
  
  // Create refs for each petal
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update each petal's position and rotation
    petals.forEach((petal, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      
      // Don't start falling until delay has passed
      if (time < petal.fallDelay) {
        mesh.position.y = petal.position[1];
        return;
      }
      
      // Calculate adjusted time (accounting for delay)
      const adjustedTime = time - petal.fallDelay;
      
      // Falling motion
      mesh.position.y = petal.position[1] - (adjustedTime * petal.fallSpeed);
      
      // If fallen below view, reset to top with new random x position
      if (mesh.position.y < -area/2) {
        mesh.position.y = area + Math.random() * 20;
        mesh.position.x = (Math.random() - 0.5) * area * 2;
      }
      
      // Gentle swaying left and right
      mesh.position.x = petal.position[0] + 
        Math.sin(time * petal.swaySpeed) * petal.swayAmplitude;
      
      // Gentle forward and backward motion
      mesh.position.z = petal.position[2] + 
        Math.cos(time * petal.swaySpeed * 0.7) * (petal.swayAmplitude * 0.3);
      
      // Flutter effect - adds a quick oscillating rotation
      const flutterPhase = time * petal.flutterSpeed + petal.flutterPhaseOffset;
      const flutterEffect = Math.sin(flutterPhase) * petal.flutterAmplitude;
      
      // Spinning (rotating) motion as petals fall with flutter effect
      mesh.rotation.x = petal.rotation[0] + time * petal.spinSpeed * 0.5 + flutterEffect;
      mesh.rotation.y = petal.rotation[1] + time * petal.spinSpeed + flutterEffect * 0.7;
      mesh.rotation.z = petal.rotation[2] + time * petal.spinSpeed * 0.7 + flutterEffect * 0.5;
      
      // Add slight scale variation for more natural look
      const scaleVariation = 1 + Math.sin(time * 0.5 + petal.flutterPhaseOffset) * 0.05;
      mesh.scale.set(
        petal.size * scaleVariation,
        petal.size * (scaleVariation + 0.02),
        petal.size * scaleVariation
      );
      
      // Update opacity based on position for fade out effect near bottom
      const distanceFromBottom = mesh.position.y + area/2;
      const fadeDistance = area * 0.1;
      if (distanceFromBottom < fadeDistance) {
        const material = mesh.material as THREE.MeshPhysicalMaterial;
        material.opacity = petal.opacity * (distanceFromBottom / fadeDistance);
      }
    });
  });
  
  return (
    <group>
      {petals.map((petal, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          position={new THREE.Vector3(...petal.position)}
          rotation={new THREE.Euler(...petal.rotation)}
          scale={petal.size}
        >
          <primitive object={petalGeometries[petal.petalVariation]} attach="geometry" />
          <meshPhysicalMaterial
            color={`#${petal.color}`}
            metalness={0.1}
            roughness={0.4}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
            transparent
            opacity={petal.opacity}
            emissive={`#${petal.color}`}
            emissiveIntensity={petal.emissiveIntensity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Add soft pink point light for rose highlights */}
      <pointLight position={[0, 30, 20]} distance={100} intensity={1.5} color="#ffcdd2" />
    </group>
  );
};

export default FallingRoses; 