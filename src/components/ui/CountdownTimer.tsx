import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If the target date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    // Calculate immediately
    calculateTimeLeft();
    
    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);
  
  // Helper function to add leading zeros
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };
  
  // Render time units with animation
  const renderTimeUnit = (value: number, label: string, index: number) => (
    <TimeUnit 
      key={label}
      style={{ 
        animationDelay: `${index * 0.2}s`,
      }}
    >
      <TimeValue>{formatNumber(value)}</TimeValue>
      <TimeLabel>{label}</TimeLabel>
    </TimeUnit>
  );
  
  return (
    <CountdownContainer>
      <Title>Counting Down To Our Special Day</Title>
      <TimeUnitsContainer>
        {renderTimeUnit(timeLeft.days, "Days", 0)}
        <Separator>:</Separator>
        {renderTimeUnit(timeLeft.hours, "Hours", 1)}
        <Separator>:</Separator>
        {renderTimeUnit(timeLeft.minutes, "Minutes", 2)}
        <Separator>:</Separator>
        {renderTimeUnit(timeLeft.seconds, "Seconds", 3)}
      </TimeUnitsContainer>
    </CountdownContainer>
  );
};

const CountdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 23, 68, 0.5);
  border: 3px solid rgba(255, 23, 68, 0.6);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h3`
  font-size: 2.2rem;
  color: #ff4081;
  margin: 0 0 1.8rem 0;
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(255, 23, 68, 0.7);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const TimeUnitsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.7rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 0.8rem;
  animation: pulse 1.5s infinite alternate;
  
  @keyframes pulse {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.08);
    }
  }
  
  @media (max-width: 768px) {
    margin: 0 0.5rem;
  }
`;

const TimeValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.9);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const TimeLabel = styled.div`
  font-size: 1.2rem;
  color: #ff80ab;
  margin-top: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 23, 68, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`;

const Separator = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: #ff1744;
  margin: 0 0.2rem;
  align-self: flex-start;
  padding-top: 0.8rem;
  text-shadow: 0 0 15px rgba(255, 23, 68, 0.7);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

export default CountdownTimer; 