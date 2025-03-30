import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Stars
} from '@react-three/drei';
import { ShaderMaterial, Color } from 'three';
import FloatingHearts from './FloatingHearts';
import PhotoCarousel from './PhotoCarousel';
import FlowerField from './FlowerField';

interface WeddingSceneProps {
  images: string[];
}

// Custom camera controller for smooth animations
const CameraController = () => {
  const { camera, mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame(() => {
    // Subtle camera movement based on mouse position
    targetRotation.current.x = (mouse.y * 0.1);
    targetRotation.current.y = (mouse.x * 0.1);
    
    // Smooth interpolation for camera rotation
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.01;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.01;
  });
  
  return null;
};

// Color palette for background transitions
const backgroundPalettes = [
  { color1: '#4a0d2d', color2: '#d81e5b' }, // Deep red to pink
  { color1: '#0c005b', color2: '#bc027f' }, // Deep blue to magenta
  { color1: '#8b104e', color2: '#ff5c8a' }, // Medium red to light pink
  { color1: '#1e0253', color2: '#8e4cf6' }, // Deep blue to purple
  { color1: '#300350', color2: '#d972ff' }  // Dark purple to light purple
];

// Animated gradient background with color transitions
const GradientBackground = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const currentPaletteIndex = useRef(0);
  const transitionProgress = useRef(0);
  const nextPaletteIndex = useRef(1);
  const lastTransitionTime = useRef(0);
  
  // Create gradient shader material
  const shaderMaterial = new ShaderMaterial({
    uniforms: {
      color1: { value: new Color(backgroundPalettes[0].color1) },
      color2: { value: new Color(backgroundPalettes[0].color2) },
      nextColor1: { value: new Color(backgroundPalettes[1].color1) },
      nextColor2: { value: new Color(backgroundPalettes[1].color2) },
      mixRatio: { value: 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 nextColor1;
      uniform vec3 nextColor2;
      uniform float mixRatio;
      varying vec2 vUv;
      
      void main() {
        vec3 currentGradient = mix(color1, color2, vUv.y);
        vec3 nextGradient = mix(nextColor1, nextColor2, vUv.y);
        vec3 finalColor = mix(currentGradient, nextGradient, mixRatio);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
  
  // Animate color transitions
  useFrame((state) => {
    if (!shaderMaterial) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    
    // Transition every 7 seconds
    if (elapsedTime - lastTransitionTime.current > 7) {
      // Reset transition
      transitionProgress.current = 0;
      lastTransitionTime.current = elapsedTime;
      
      // Update palette indices
      currentPaletteIndex.current = nextPaletteIndex.current;
      nextPaletteIndex.current = (nextPaletteIndex.current + 1) % backgroundPalettes.length;
      
      // Update colors
      shaderMaterial.uniforms.color1.value = new Color(backgroundPalettes[currentPaletteIndex.current].color1);
      shaderMaterial.uniforms.color2.value = new Color(backgroundPalettes[currentPaletteIndex.current].color2);
      shaderMaterial.uniforms.nextColor1.value = new Color(backgroundPalettes[nextPaletteIndex.current].color1);
      shaderMaterial.uniforms.nextColor2.value = new Color(backgroundPalettes[nextPaletteIndex.current].color2);
    } else {
      // Smooth transition between colors
      const transitionDuration = 1.5; // Duration of the fade effect
      const startTransitionAt = 7 - transitionDuration;
      
      if (elapsedTime - lastTransitionTime.current > startTransitionAt) {
        const progress = (elapsedTime - lastTransitionTime.current - startTransitionAt) / transitionDuration;
        transitionProgress.current = Math.min(progress, 1.0);
        shaderMaterial.uniforms.mixRatio.value = transitionProgress.current;
      }
    }
  });
  
  return (
    <mesh position={[0, 0, -15]} scale={[30, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={shaderMaterial} ref={shaderRef} />
    </mesh>
  );
};

// Fallback component when loading
const Fallback = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#ffb6c1" />
    </mesh>
  );
};

const WeddingScene: React.FC<WeddingSceneProps> = ({ images }) => {
  // Heart color palette - red and pink tones
  const heartColors = [
    '#ff5252', '#ff1744', '#ff4081', '#f50057', 
    '#ff80ab', '#ff4081', '#ff80ab', '#ff80dd', 
    '#f8bbd0', '#f48fb1', '#f06292', '#ec407a'
  ];
  
  // More images for the carousel
  const extendedImages = [
    ...images,
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc'
  ];
  
  return (
    <Canvas 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      dpr={[1, 2]} // Dynamic pixel ratio for better performance
      gl={{ antialias: true }} // Smooth edges
      linear // Linear color space for better visuals
    >
      <color attach="background" args={['#2d0f4c']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} near={0.1} far={1000} />
      <CameraController />
      
      {/* Brighter lights for better visibility */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#fff6e0" />
      <spotLight position={[-10, -10, -5]} intensity={1.2} color="#ffc8dd" angle={0.15} penumbra={1} />
      
      <Suspense fallback={<Fallback />}>
        {/* Environment lighting */}
        <Environment preset="sunset" />
        
        {/* Starry background */}
        <Stars radius={300} depth={100} count={5000} factor={4} fade speed={1} />
        
        {/* Gradient background with transitions */}
        <GradientBackground />
        
        {/* Photo carousel with extended images */}
        <PhotoCarousel 
          images={extendedImages} 
          radius={7} 
          height={0} 
          rotationSpeed={0.02} 
        />
        
        {/* Floating hearts with pink and red colors */}
        <FloatingHearts count={150} colors={heartColors} />
        
        {/* Flower field with rose petals - increase count for more petals */}
        <FlowerField count={150} petalCount={600} />
        
        {/* Controls - limited for better user experience */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Suspense>
    </Canvas>
  );
};

export default WeddingScene; 