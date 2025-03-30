import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

interface PhotoSlideshowProps {
  images: string[];
  height?: number;
  activeIndex?: number;
  setActiveIndex?: (index: number) => void;
}

// Create heart shape for decorative elements
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

// Create a fallback texture function
const createFallbackTexture = (index: number) => {
  const placeholderColor = index % 2 === 0 ? "#ffcdd2" : "#f8bbd0";
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Draw background
    ctx.fillStyle = placeholderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw heart in center
    ctx.fillStyle = "#f50057";
    const heartPath = new Path2D();
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const size = 100;
    
    heartPath.moveTo(x, y - size/4);
    heartPath.bezierCurveTo(
      x, y - size/2,
      x - size, y - size/2,
      x - size, y
    );
    heartPath.bezierCurveTo(
      x - size, y + size/2,
      x, y + size,
      x, y + size/2
    );
    heartPath.bezierCurveTo(
      x, y + size,
      x + size, y + size/2,
      x + size, y
    );
    heartPath.bezierCurveTo(
      x + size, y - size/2,
      x, y - size/2,
      x, y - size/4
    );
    
    ctx.fill(heartPath);
    
    // Add text
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Samiksha & Sumit`, x, y + size + 40);
    ctx.font = "20px Arial";
    ctx.fillText(`Wedding Photo ${index+1}`, x, y + size + 70);
  }
  
  return new THREE.CanvasTexture(canvas);
};

const ScrollingGallery: React.FC<PhotoSlideshowProps> = ({
  images = [],
  height = 0,
  activeIndex = -1,
  setActiveIndex = () => {}
}) => {
  const { size, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const scrollSpeed = 1.5; // Scrolling speed
  
  // Calculate image scale based on viewport size
  const imageScale = useMemo(() => {
    // Calculate dimensions to fill the screen height while maintaining aspect ratio
    const height = viewport.height * 0.85;  
    const width = height * 1.33; // 4:3 aspect ratio
    return { width, height };
  }, [viewport.height]);
  
  // Space between images
  const spacing = useMemo(() => imageScale.width * 1.05, [imageScale]);
  
  // Heart shape for decoration
  const heartGeometry = useMemo(() => {
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };
    return new THREE.ExtrudeGeometry(createHeartShape(), extrudeSettings);
  }, []);
  
  // Load textures
  useEffect(() => {
    const loader = new TextureLoader();
    const fallbacks = Array.from({ length: Math.max(images.length, 1) }, (_, i) => 
      createFallbackTexture(i)
    );
    
    // Set fallbacks immediately
    setTextures(fallbacks);
    
    if (!Array.isArray(images) || images.length === 0) return;
    
    // Load actual images
    const loadedTextures: THREE.Texture[] = [...fallbacks];
    let loadedCount = 0;
    
    images.forEach((src, i) => {
      loader.load(
        src,
        (texture) => {
          texture.anisotropy = 16;
          loadedTextures[i] = texture;
          loadedCount++;
          
          if (loadedCount === images.length) {
            setTextures([...loadedTextures]);
          }
        },
        undefined,
        (error) => {
          console.error(`Error loading image ${i}:`, error);
          loadedCount++;
          
          if (loadedCount === images.length) {
            setTextures([...loadedTextures]);
          }
        }
      );
    });
    
    return () => {
      loadedTextures.forEach(texture => texture.dispose());
    };
  }, [images]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current || textures.length === 0) return;
    
    // Animate the train of images
    Array.from(groupRef.current.children).forEach((child, index) => {
      // Move each image from right to left
      child.position.x -= scrollSpeed * delta;
      
      // If an image moves off-screen to the left, reposition it to the far right
      if (child.position.x < -viewport.width) {
        child.position.x += textures.length * spacing;
      }
      
      // Animate decorative elements
      if (child.children.length > 2) {
        const decorations = child.children[2];
        if (decorations && decorations.type === 'Group') {
          // Gentle floating motion for decorations
          decorations.position.y = Math.sin(state.clock.getElapsedTime() * 0.5 + index) * 0.1;
        }
      }
    });
  });
  
  // Handle image click
  const handleImageClick = (index: number) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };
  
  // Create connector between images
  const Connector = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      {/* Main connector */}
      <mesh scale={[0.25, imageScale.height * 0.9, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ff1744" opacity={0.8} transparent />
      </mesh>
      
      {/* Decorative elements */}
      <mesh position={[0, imageScale.height * 0.4, 0.01]} scale={[0.35, 0.15, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ff80ab" opacity={0.9} transparent />
      </mesh>
      
      <mesh position={[0, -imageScale.height * 0.4, 0.01]} scale={[0.35, 0.15, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ff80ab" opacity={0.9} transparent />
      </mesh>
      
      {/* Heart decoration */}
      <mesh position={[0, 0, 0.02]} scale={[0.2, 0.2, 0.1]}>
        <primitive object={heartGeometry} attach="geometry" />
        <meshPhysicalMaterial 
          color="#ff80ab"
          metalness={0.1} 
          roughness={0.3}
          clearcoat={0.8}
          emissive="#ff2a6d"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
  
  // If no textures or in detail view mode
  if (textures.length === 0) return null;
  
  // Detail view when an image is selected
  if (activeIndex !== -1) {
    const selectedTexture = textures[activeIndex] || createFallbackTexture(activeIndex);
    
    return (
      <group position={[0, height, 0]}>
        {/* Background train - continues scrolling */}
        <group ref={groupRef} scale={[0.7, 0.7, 0.7]} position={[0, -viewport.height * 0.7, -15]}>
          {textures.map((texture, i) => (
            <group 
              key={`bg-${i}`} 
              position={[i * spacing, 0, 0]}
            >
              <mesh scale={[imageScale.width, imageScale.height, 1]}>
                <planeGeometry />
                <meshBasicMaterial map={texture} transparent opacity={0.4} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Selected image in focus */}
        <mesh
          position={[0, 0, -5]}
          scale={[imageScale.width * 1.2, imageScale.height * 1.2, 1]}
          onClick={() => handleImageClick(activeIndex)}
        >
          <planeGeometry />
          <meshBasicMaterial map={selectedTexture} transparent />
          
          {/* Frame */}
          <mesh position={[0, 0, -0.01]} scale={[1.04, 1.05, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#ff1744" opacity={0.8} transparent alphaTest={0.1} />
          </mesh>
        </mesh>
        
        {/* Dark backdrop */}
        <mesh position={[0, 0, -15]} scale={[viewport.width * 2, viewport.height * 2, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#000000" opacity={0.9} transparent depthWrite={false} />
        </mesh>
        
        {/* Close button */}
        <mesh
          position={[imageScale.width * 0.65, imageScale.height * 0.65, -4.9]}
          scale={[0.4, 0.4, 1]}
          onClick={() => handleImageClick(activeIndex)}
          onPointerOver={() => setHoveredIndex(-2)}
          onPointerOut={() => setHoveredIndex(-1)}
        >
          <planeGeometry />
          <meshBasicMaterial 
            color={hoveredIndex === -2 ? "#ff5c8d" : "#ff1744"}
            opacity={0.9}
            transparent
          />
          {/* X symbol */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.6, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.01]}>
              <planeGeometry args={[0.6, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0, 0.01]}>
              <planeGeometry args={[0.6, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </mesh>
        
        {/* Navigation buttons */}
        <mesh
          position={[-imageScale.width * 0.65, 0, -4.9]}
          scale={[0.4, 0.4, 1]}
          onClick={() => {
            const prevIndex = (activeIndex - 1 + textures.length) % textures.length;
            setActiveIndex(prevIndex);
          }}
          onPointerOver={() => setHoveredIndex(-3)}
          onPointerOut={() => setHoveredIndex(-1)}
          visible={textures.length > 1}
        >
          <planeGeometry />
          <meshBasicMaterial 
            color={hoveredIndex === -3 ? "#ff5c8d" : "#ff1744"}
            opacity={0.9}
            transparent
          />
          {/* Left arrow symbol */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.4, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
            <mesh rotation={[0, 0, Math.PI / 4]} position={[-0.15, 0.15, 0]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.15, -0.15, 0]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </mesh>
        
        <mesh
          position={[imageScale.width * 0.65, 0, -4.9]}
          scale={[0.4, 0.4, 1]}
          onClick={() => {
            const nextIdx = (activeIndex + 1) % textures.length;
            setActiveIndex(nextIdx);
          }}
          onPointerOver={() => setHoveredIndex(-4)}
          onPointerOut={() => setHoveredIndex(-1)}
          visible={textures.length > 1}
        >
          <planeGeometry />
          <meshBasicMaterial 
            color={hoveredIndex === -4 ? "#ff5c8d" : "#ff1744"}
            opacity={0.9}
            transparent
          />
          {/* Right arrow symbol */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.4, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[0.15, 0.15, 0]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0.15, -0.15, 0]}>
              <planeGeometry args={[0.3, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </mesh>
      </group>
    );
  }
  
  // Main gallery view - scrolling images
  return (
    <group position={[0, height, -4]}>
      {/* Main container for train of images */}
      <group ref={groupRef}>
        {/* Initial positioning of images from right to left across the viewport */}
        {textures.map((texture, i) => {
          // Start with images spread across and outside the viewport
          const initialX = i * spacing + viewport.width;
          
          return (
            <group 
              key={`train-${i}`} 
              position={[initialX, 0, 0]}
            >
              {/* Image with frame */}
              <mesh
                scale={[imageScale.width, imageScale.height, 1]}
                onClick={() => handleImageClick(i)}
                onPointerOver={() => setHoveredIndex(i)}
                onPointerOut={() => setHoveredIndex(-1)}
              >
                <planeGeometry />
                <meshBasicMaterial map={texture} transparent />
                
                {/* Frame */}
                <mesh position={[0, 0, -0.01]} scale={[1.02, 1.03, 1]}>
                  <planeGeometry />
                  <meshBasicMaterial
                    color={hoveredIndex === i ? "#ff1744" : "#330033"}
                    opacity={hoveredIndex === i ? 0.8 : 0.4}
                    transparent
                    alphaTest={0.1}
                  />
                </mesh>
              </mesh>
              
              {/* Connector to next image */}
              <Connector position={[imageScale.width/2 + 0.1, 0, -0.01]} />
              
              {/* Decorative elements */}
              <group>
                {/* Top heart */}
                <mesh position={[-imageScale.width/4, imageScale.height/3, 0.5]} rotation={[0, 0, 0.2]} scale={[0.3, 0.3, 0.3]}>
                  <primitive object={heartGeometry} attach="geometry" />
                  <meshPhysicalMaterial 
                    color="#ff2a6d"
                    metalness={0.1} 
                    roughness={0.3}
                    clearcoat={0.8}
                    emissive="#ff2a6d"
                    emissiveIntensity={0.6}
                  />
                </mesh>
                
                {/* Bottom heart */}
                <mesh position={[imageScale.width/4, -imageScale.height/3, 0.5]} rotation={[0, 0, -0.3]} scale={[0.3, 0.3, 0.3]}>
                  <primitive object={heartGeometry} attach="geometry" />
                  <meshPhysicalMaterial 
                    color="#ff2a6d"
                    metalness={0.1} 
                    roughness={0.3}
                    clearcoat={0.8}
                    emissive="#ff2a6d"
                    emissiveIntensity={0.6}
                  />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
      
      {/* Speed controller */}
      <mesh
        position={[viewport.width * 0.4, -viewport.height * 0.4, 1]}
        scale={[0.3, 0.3, 0.1]}
        onPointerOver={() => setHoveredIndex(-5)}
        onPointerOut={() => setHoveredIndex(-1)}
      >
        <planeGeometry />
        <meshBasicMaterial 
          color={hoveredIndex === -5 ? "#ff5c8d" : "#ff1744"}
          opacity={0.9}
          transparent
        />
        <group position={[0, 0, 0.01]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.6, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.1, 0.6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </mesh>
      
      {/* Additional lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={1.0} color="#ffffff" />
    </group>
  );
};

export default ScrollingGallery; 