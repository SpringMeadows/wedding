import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  title: string;
  time: string;
  location: string;
  description: string;
}

interface HorizontalEventSliderProps {
  events: Event[];
}

const HorizontalEventSlider: React.FC<HorizontalEventSliderProps> = ({ events }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Auto-rotate through events when slider is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && events.length > 1) {
      interval = setInterval(() => {
        setActiveEventIndex((prev) => (prev + 1) % events.length);
      }, 8000); // Change event every 8 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, events.length]);
  
  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };
  
  const handleEventClick = (index: number) => {
    setActiveEventIndex(index);
  };
  
  return (
    <SliderContainer>
      <AnimatePresence>
        {isOpen && (
          <SliderContent
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            ref={sliderRef}
          >
            <EventsNavigation>
              {events.map((event, index) => (
                <EventNavItem 
                  key={index}
                  isActive={index === activeEventIndex}
                  onClick={() => handleEventClick(index)}
                >
                  {event.title}
                </EventNavItem>
              ))}
            </EventsNavigation>
            
            <EventContent
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key={activeEventIndex}
              transition={{ duration: 0.3 }}
            >
              <EventHeader>
                <EventTitle>{events[activeEventIndex].title}</EventTitle>
                <EventTime>
                  <TimeIcon />
                  {events[activeEventIndex].time}
                </EventTime>
                <EventLocation>
                  <LocationIcon />
                  {events[activeEventIndex].location}
                </EventLocation>
              </EventHeader>
              <EventDescription>
                {events[activeEventIndex].description}
              </EventDescription>
            </EventContent>
          </SliderContent>
        )}
      </AnimatePresence>
      
      <ToggleButton 
        onClick={toggleSlider}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? 'Hide Schedule' : 'View Wedding Schedule'}
        <ToggleIcon isOpen={isOpen} />
      </ToggleButton>
    </SliderContainer>
  );
};

// Icons
const TimeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20Z" fill="white"/>
    <path d="M12 7V12H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
  </svg>
);

interface ToggleIconProps {
  isOpen: boolean;
}

const ToggleIcon: React.FC<ToggleIconProps> = ({ isOpen }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
    <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Styled Components
const SliderContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SliderContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  width: 100%;
  padding: 20px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
  border-top: 2px solid rgba(255, 23, 68, 0.5);
  
  @media (min-width: 768px) {
    display: flex;
    align-items: flex-start;
  }
`;

const EventsNavigation = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 10px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 23, 68, 0.5);
    border-radius: 2px;
  }
  
  @media (min-width: 768px) {
    flex-direction: column;
    min-width: 250px;
    margin-right: 30px;
    margin-bottom: 0;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

interface EventNavItemProps {
  isActive: boolean;
}

const EventNavItem = styled.button<EventNavItemProps>`
  padding: 10px 15px;
  background: ${props => props.isActive ? 'rgba(255, 23, 68, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 20px;
  margin-right: 10px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.isActive ? 'rgba(255, 23, 68, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  @media (min-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    border-radius: 8px;
    text-align: left;
    width: 100%;
  }
`;

const EventContent = styled(motion.div)`
  color: white;
  flex: 1;
`;

const EventHeader = styled.div`
  margin-bottom: 15px;
`;

const EventTitle = styled.h3`
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #ff80ab;
  font-family: 'Playfair Display', serif;
`;

const EventTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.9);
  
  svg {
    margin-right: 8px;
  }
`;

const EventLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  
  svg {
    margin-right: 8px;
  }
`;

const EventDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
`;

const ToggleButton = styled(motion.button)`
  background: rgba(255, 23, 68, 0.9);
  color: white;
  border: none;
  border-radius: 30px 30px 0 0;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  
  svg {
    margin-left: 8px;
  }
`;

export default HorizontalEventSlider; 