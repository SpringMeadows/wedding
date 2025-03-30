import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import styled from 'styled-components';
import WelcomeMessage from './components/ui/WelcomeMessage';
import CountdownTimer from './components/ui/CountdownTimer';
import SoundControl from './components/ui/SoundControl';
import FloatingHearts from './components/3d/FloatingHearts';
import FallingRoses from './components/3d/FallingRoses';
import ScrollingGallery from './components/3d/PhotoCarousel';
import EventDetails from './components/ui/EventDetails';
import HeartShower from './components/3d/HeartShower';
import './styles/globals.css';

// Define the App component
const App: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(-1);
  const [showHeartShower, setShowHeartShower] = useState(true);
  
  // Wedding details
  const weddingDate = "April 25, 2025";
  const weddingTime = new Date('2025-04-25T12:00:00');
  const names = { bride: "Samiksha", groom: "Sumit" };
  
  // Sample image URLs
  const sampleImages = () => {
    // Use actual images from the public folder
    const images = [];
    for (let i = 1; i <= 18; i++) {
      images.push(`/images/${i}.jpg`);
    }
    return images;
  };
  
  // Wedding events
  const weddingEvents = [
    {
      title: "Wedding Ceremony",
      time: "4:00 PM - 5:00 PM",
      location: "Bakhhopur , Jaunpur",
      description: "Join us as we exchange vows and begin our journey together in the beautiful rose garden overlooking the lake.",
      icon: "ceremony" as const,
      date: "April 25, 2025"
    },
    
    {
      title: "Mehndi Ceremony",
      time: "2:00 PM - 6:00 PM",
      location: "GHARE DUWARE ",
      description: "Join us for a traditional Mehndi ceremony with beautiful henna designs, music, and celebration.",
      icon: "party" as const,
      date: "April 24, 2025"
    },
    {
      title: "Dinner & Toasts",
      time: "6:30 PM - 8:30 PM",
      location: "GHARE DUWARE",
      description: "A formal seated dinner will be served, followed by toasts from the wedding party and family members.",
      icon: "dinner" as const,
      date: "April 24, 2025"
    },
    {
      title: "Sangeet Night",
      time: "7:00 PM - 11:00 PM",
      location: "GHARE DUWARE",
      description: "Experience a night of music, dance performances, and celebrations as families come together.",
      icon: "party" as const,
      date: "April 24, 2025"
    },
    {
      title: "Dancing & Celebration",
      time: "8:30 PM - 12:00 AM",
      location: "GHARE DUWARE",
      description: "Dance the night away with live music and celebration as we begin our new life together.",
      icon: "party" as const,
      date: "April 24, 2025"
    }
  ];
  
  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Play background music when enabled
  useEffect(() => {
    // Use a local audio file
    const audio = new Audio('/audio/wedding-music.mp3');
    audio.loop = true;
    
    if (audioEnabled) {
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioEnabled]);
  
  // Hide heart shower after it finishes (automatically hidden by the component itself)
  useEffect(() => {
    // Reset flag after animation completes
    const timer = setTimeout(() => {
      setShowHeartShower(false);
    }, 10000); // 10 seconds, matching the duration in HeartShower component
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AppContainer>
      {/* Background 3D Canvas */}
      <CanvasContainer>
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffcdd2" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f8bbd0" />
          <Suspense fallback={null}>
            <Stars 
              radius={100} 
              depth={50} 
              count={3000} 
              factor={4} 
              saturation={0.5} 
              fade 
              speed={0.5} 
            />
            <group position={[0, 0, -5]}>
              <FloatingHearts 
                count={200} 
                colors={['#ff1744', '#ff4081', '#ff80ab', '#ffb7c5', '#ffffff', '#fce4ec', '#f8bbd0']}
                area={100}
                baseSize={1.0}
                intensity={1.0}
                fallingSpeed={1.0}
              />
            </group>
            <group position={[0, 0, -2]}>
              <FallingRoses 
                count={150} 
                colors={['#e91e63', '#ec407a', '#f06292', '#f48fb1', '#f8bbd0', '#d81b60']}
                area={100}
                baseSize={0.8}
                intensity={0.8}
                fallingSpeed={0.9}
              />
            </group>
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
        <BackgroundGradient />
      </CanvasContainer>
      
      {/* Main content */}
      <MainContent>
        {/* Welcome Section with 3D animation */}
        <Section id="welcome">
          <WelcomeMessage 
            names={names} 
            date={weddingDate} 
            message="We cordially invite you to share in our special day as we begin our new life together."
          />
          
          <CountdownTimerContainer style={{ 
            opacity: Math.max(0, 1 - scrollPosition / 500),
            transform: `translateY(${Math.min(0, -scrollPosition / 10)}px)`
          }}>
            <CountdownTimer targetDate={weddingTime} />
          </CountdownTimerContainer>
        </Section>
        
        {/* Photos Section */}
        <Section id="photos">
          <SectionTitle>Our Story</SectionTitle>
          <PhotoSlideshowContainer>
            <Canvas
              shadows
              camera={{ position: [0, 0, 10], fov: 55 }}
              style={{ width: '100%', height: '100vh', position: 'absolute' }}
            >
              <hemisphereLight intensity={0.7} groundColor="#330033" />
              <pointLight position={[5, 5, 5]} intensity={0.5} />
              <pointLight position={[-5, 5, 5]} intensity={0.5} />
              
              <FallingRoses />
              <FloatingHearts />
              <ScrollingGallery 
                images={sampleImages()} 
                activeIndex={activeImageIndex}
                setActiveIndex={setActiveImageIndex}
              />
              
              {/* Show heart shower animation on page load */}
              {showHeartShower && <HeartShower />}
            </Canvas>
            
            {/* Display image index when viewing an image */}
            {activeImageIndex !== -1 && (
              <div className="image-counter">
                {activeImageIndex + 1} / {sampleImages().length}
              </div>
            )}
          </PhotoSlideshowContainer>
        </Section>
        
        {/* Schedule Section */}
        <Section id="schedule">
          <SectionTitle>Wedding Details</SectionTitle>
          <EventDetails 
            events={weddingEvents} 
            weddingDate={weddingDate} 
          />
        </Section>
        
        {/* Footer */}
        <Footer>
          <p>Samiksha & Sumit &copy; 2025 | Made with ❤️</p>
        </Footer>
      </MainContent>
      
      {/* Sound control */}
      <SoundControlContainer>
        <SoundControl enabled={audioEnabled} onChange={setAudioEnabled} />
      </SoundControlContainer>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: linear-gradient(135deg, #0a001a 0%, #1a0033 50%, #330033 100%);
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 23, 68, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: 0;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, 
      rgba(26, 0, 51, 0.6) 0%, 
      rgba(26, 0, 51, 0.3) 50%, 
      rgba(26, 0, 51, 0.7) 100%
    );
  }
`;

const MainContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  position: relative;
  
  &#welcome {
    justify-content: center;
  }
  
  &#photos {
    background-color: rgba(51, 0, 51, 0.3);
  }
  
  &#schedule {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  color: #ff1744;
  margin-bottom: 3rem;
  font-family: 'Playfair Display', serif;
  text-align: center;
  text-shadow: 0 0 15px rgba(255, 23, 68, 0.6);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const CountdownTimerContainer = styled.div`
  margin-top: 3rem;
  width: 100%;
  max-width: 800px;
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const PhotoSlideshowContainer = styled.div`
  width: 100%;
  height: 90vh;
  max-width: 1600px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  position: relative;
  
  @media (max-width: 768px) {
    height: 70vh;
    border-radius: 12px;
  }
`;

const SoundControlContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  background-color: rgba(51, 0, 51, 0.4);
  
  p {
    margin: 0;
  }
`;

export default App;
