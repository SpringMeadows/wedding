import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Create a heart shape for the particles
const createHeartShape = () => {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  
  // Heart shape with curves
  shape.moveTo(x, y + 0.5);
  // Left curve
  shape.bezierCurveTo(
    x - 0.5, y + 0.3,  // control point 1
    x - 1.0, y,        // control point 2
    x - 1.0, y - 0.6   // end point
  );
  shape.bezierCurveTo(
    x - 1.0, y - 1.4,  // control point 1
    x - 0.5, y - 1.5,  // control point 2
    x, y - 1.0         // end point
  );
  // Right curve
  shape.bezierCurveTo(
    x + 0.5, y - 1.5,  // control point 1
    x + 1.0, y - 1.4,  // control point 2
    x + 1.0, y - 0.6   // end point
  );
  shape.bezierCurveTo(
    x + 1.0, y,        // control point 1
    x + 0.5, y + 0.3,  // control point 2
    x, y + 0.5         // end point
  );
  
  return shape;
};

// Interface for a single heart particle
interface HeartParticle {
  position: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
  color: string;
  velocity: THREE.Vector3;
  opacity: number;
  active: boolean;
  delay: number;
}

// Main HeartShower component
const HeartShower: React.FC = () => {
  const { viewport, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate a selection of pink and red colors for hearts
  const colors = useMemo(() => [
    '#ff1744', // red
    '#ff4081', // pink
    '#f50057', // deep pink
    '#ff80ab', // light pink
    '#f8bbd0', // very light pink
    '#ff5c8d', // coral pink
    '#c2185b', // dark pink
  ], []);
  
  // Create heart geometry for the shower
  const heartGeometry = useMemo(() => {
    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    return new THREE.ExtrudeGeometry(createHeartShape(), extrudeSettings);
  }, []);
  
  // Create array of heart particles
  const hearts = useMemo(() => {
    const count = 200; // Number of hearts to create
    const particles: HeartParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      // Random position across viewport width, start from below viewport
      const x = (Math.random() - 0.5) * viewport.width * 1.5;
      const y = -(viewport.height + Math.random() * viewport.height);
      const z = -5 - Math.random() * 10;
      
      // Random size for variety
      const scale = 0.05 + Math.random() * 0.1;
      
      // Random rotation
      const rotationX = Math.random() * Math.PI;
      const rotationY = Math.random() * Math.PI;
      const rotationZ = Math.random() * Math.PI;
      
      // Random velocity (mostly upward)
      const vx = (Math.random() - 0.5) * 0.2;
      const vy = 0.5 + Math.random() * 0.5;
      const vz = (Math.random() - 0.5) * 0.1;
      
      // Random color from our palette
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random delay before starting to rise
      const delay = Math.random() * 3;
      
      particles.push({
        position: new THREE.Vector3(x, y, z),
        scale,
        rotation: new THREE.Euler(rotationX, rotationY, rotationZ),
        color,
        velocity: new THREE.Vector3(vx, vy, vz),
        opacity: 0.7 + Math.random() * 0.3,
        active: true,
        delay
      });
    }
    
    return particles;
  }, [viewport.width, viewport.height, colors]);
  
  // Animation ref to keep track of elapsed time
  const animationRef = useRef({
    time: 0,
    active: true,
    duration: 10, // Total duration of the effect in seconds
    initialized: false
  });
  
  // Initialize animation on first render
  useEffect(() => {
    animationRef.current.time = 0;
    animationRef.current.active = true;
    animationRef.current.initialized = true;
    
    // Automatically hide hearts after duration
    const timer = setTimeout(() => {
      animationRef.current.active = false;
    }, animationRef.current.duration * 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current || !animationRef.current.initialized) return;
    
    // Update animation time
    animationRef.current.time += delta;
    const { time, active, duration } = animationRef.current;
    
    // If animation is complete, hide the group
    if (time > duration) {
      groupRef.current.visible = false;
      return;
    }
    
    // Update each heart
    if (active) {
      const heartMeshes = groupRef.current.children;
      
      hearts.forEach((heart, i) => {
        if (i >= heartMeshes.length) return;
        
        const mesh = heartMeshes[i] as THREE.Mesh;
        
        // Only start animation after delay
        if (time > heart.delay) {
          // Calculate elapsed time for this heart
          const heartTime = time - heart.delay;
          
          // Update position based on velocity
          heart.position.x += heart.velocity.x * delta;
          heart.position.y += heart.velocity.y * delta;
          heart.position.z += heart.velocity.z * delta;
          
          // Apply gentle oscillation on X axis
          heart.position.x += Math.sin(heartTime * 2) * 0.01;
          
          // Add slight rotation animation
          heart.rotation.x += delta * 0.2;
          heart.rotation.y += delta * 0.3;
          heart.rotation.z += delta * 0.1;
          
          // Update opacity - fade in at start, fade out at end
          let opacity = heart.opacity;
          if (heartTime < 0.5) {
            // Fade in
            opacity = Math.min(heart.opacity, heartTime * 2 * heart.opacity);
          } else if (heartTime > duration - 1) {
            // Fade out in the last second
            opacity = Math.max(0, heart.opacity * (1 - (heartTime - (duration - 1))));
          }
          
          // Apply updated values to the mesh
          mesh.position.copy(heart.position);
          mesh.rotation.copy(heart.rotation);
          mesh.scale.set(heart.scale, heart.scale, heart.scale);
          
          // Update material opacity
          if (mesh.material instanceof THREE.Material) {
            mesh.material.opacity = opacity;
          } else if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.opacity = opacity);
          }
          
          // Check if heart is out of bounds (too high)
          if (heart.position.y > viewport.height + 2) {
            // Reset position to loop the animation
            heart.position.y = -viewport.height;
            heart.position.x = (Math.random() - 0.5) * viewport.width * 1.5;
          }
        } else {
          // Heart is still waiting - keep it invisible
          if (mesh.material instanceof THREE.Material) {
            mesh.material.opacity = 0;
          } else if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.opacity = 0);
          }
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {hearts.map((heart, i) => (
        <mesh key={`heart-${i}`} position={heart.position} rotation={heart.rotation}>
          <primitive object={heartGeometry} attach="geometry" />
          <meshPhysicalMaterial 
            color={heart.color}
            metalness={0.1} 
            roughness={0.4}
            clearcoat={0.8}
            transparent
            opacity={0}
            emissive={heart.color}
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default HeartShower; 