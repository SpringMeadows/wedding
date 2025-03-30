import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: Date;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
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
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // If the target date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  // Add leading zero for single digit numbers
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <CountdownWrapper>
      <CountdownTitle>Our Special Day Is Coming</CountdownTitle>
      <CountdownContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <TimeUnit
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <TimeValue>{formatNumber(timeLeft.days)}</TimeValue>
          <TimeLabel>Days</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <TimeValue>{formatNumber(timeLeft.hours)}</TimeValue>
          <TimeLabel>Hours</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <TimeValue>{formatNumber(timeLeft.minutes)}</TimeValue>
          <TimeLabel>Minutes</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <TimeValue>{formatNumber(timeLeft.seconds)}</TimeValue>
          <TimeLabel>Seconds</TimeLabel>
        </TimeUnit>
      </CountdownContainer>
    </CountdownWrapper>
  );
};

const CountdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
`;

const CountdownTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: #f50057;
  text-shadow: 0 2px 10px rgba(255, 23, 68, 0.5), 0 0 30px rgba(255, 255, 255, 0.1);
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

// @ts-ignore -- Bypass TypeScript errors with motion components
const CountdownContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 2rem 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 23, 68, 0.2);
  border: 2px solid rgba(255, 23, 68, 0.3);
  position: relative;
  overflow: hidden;
  
  /* Glowing outline effect */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 15px;
    background: linear-gradient(45deg, rgba(255, 23, 68, 0) 0%, rgba(255, 23, 68, 0.3) 50%, rgba(255, 23, 68, 0) 100%);
    z-index: -1;
    animation: glowPulse 3s infinite alternate;
  }
  
  @keyframes glowPulse {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    flex-wrap: wrap;
  }
`;

// @ts-ignore -- Bypass TypeScript errors with motion components
const TimeUnit = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.8rem;
  
  @media (max-width: 480px) {
    margin: 0 0.5rem;
  }
`;

const TimeValue = styled.div`
  font-size: 3.8rem;
  font-weight: 700;
  color: #ff1744;
  min-width: 5rem;
  text-align: center;
  font-family: 'Playfair Display', serif;
  text-shadow: 0 2px 15px rgba(255, 23, 68, 0.5), 0 0 30px rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    font-size: 2.8rem;
    min-width: 3.5rem;
  }
`;

const TimeLabel = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  margin-top: 0.5rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
`;

const Separator = styled.span`
  font-size: 3.5rem;
  color: #ff80ab;
  margin: 0 0.5rem;
  align-self: flex-start;
  padding-top: 0.5rem;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(255, 23, 68, 0.4);
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

export default Countdown; 