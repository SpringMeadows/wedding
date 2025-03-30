import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRing, FaGlassCheers, FaUtensils, FaMusic } from 'react-icons/fa';

interface Event {
  title: string;
  time: string;
  location: string;
  description: string;
  icon: 'ceremony' | 'reception' | 'dinner' | 'party';
  date?: string; // Add optional date for each event
}

interface EventDetailsProps {
  events: Event[];
  weddingDate: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ events, weddingDate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle navigation between events
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
  };
  
  // Get icon component based on event type
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'ceremony':
        return <span>{React.createElement(FaRing as any, { size: 24 })}</span>;
      case 'reception':
        return <span>{React.createElement(FaGlassCheers as any, { size: 24 })}</span>;
      case 'dinner':
        return <span>{React.createElement(FaUtensils as any, { size: 24 })}</span>;
      case 'party':
        return <span>{React.createElement(FaMusic as any, { size: 24 })}</span>;
      default:
        return <span>{React.createElement(FaRing as any, { size: 24 })}</span>;
    }
  };
  
  return (
    <EventDetailsContainer>
      <EventCard>
        <IconContainer>
          {getIcon(events[activeIndex].icon)}
        </IconContainer>
        
        <EventTitle>{events[activeIndex].title}</EventTitle>
        
        <EventDate>
          {events[activeIndex].date || weddingDate}
        </EventDate>
        
        <EventTime>{events[activeIndex].time}</EventTime>
        
        <EventLocation>{events[activeIndex].location}</EventLocation>
        
        <EventDescription>
          {events[activeIndex].description}
        </EventDescription>
        
        <Navigation>
          <NavButton onClick={handlePrev}>&larr; Previous</NavButton>
          <EventIndicators>
            {events.map((_, index) => (
              <EventIndicator 
                key={index} 
                active={index === activeIndex} 
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </EventIndicators>
          <NavButton onClick={handleNext}>Next &rarr;</NavButton>
        </Navigation>
      </EventCard>
    </EventDetailsContainer>
  );
};

const EventDetailsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const EventCard = styled.div`
  background-color: rgba(51, 0, 51, 0.7);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  backdrop-filter: blur(10px);
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 350px;
  }
`;

const IconContainer = styled.div`
  background-color: #ff1744;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
`;

const EventTitle = styled.h3`
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const EventDate = styled.p`
  color: #ff80ab;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
`;

const EventTime = styled.p`
  color: #ff80ab;
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const EventLocation = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const EventDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 90%;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: #ff80ab;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff1744;
  }
`;

const EventIndicators = styled.div`
  display: flex;
  gap: 8px;
`;

const EventIndicator = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#ff1744' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#ff1744' : 'rgba(255, 255, 255, 0.6)'};
    transform: scale(1.2);
  }
`;

export default EventDetails; 