import React, { useRef } from 'react';
import styled from 'styled-components';

interface WelcomeMessageProps {
  names: { bride: string; groom: string };
  date: string;
  message: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ names, date, message }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <MessageContainer ref={containerRef}>
      <Heading>Wedding Invitation</Heading>
      <NamesContainer>
        <BrideName>{names.bride}</BrideName>
        <AndSymbol>&</AndSymbol>
        <GroomName>{names.groom}</GroomName>
      </NamesContainer>
      <DateText>{date}</DateText>
      <Message>{message}</Message>
      <HeartContainer>
        <HeartIcon>❤️</HeartIcon>
      </HeartContainer>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 4rem;
  text-align: center;
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 23, 68, 0.4);
  border: 3px solid rgba(255, 23, 68, 0.5);
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    width: 95%;
  }
`;

const Heading = styled.h1`
  font-size: 3.5rem;
  color: white;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  text-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 23, 68, 0.8);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

const NamesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 2rem;
  }
`;

const NameText = styled.span`
  font-size: 5rem;
  color: white;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(255, 23, 68, 1), 0 0 20px rgba(255, 23, 68, 0.8);
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const BrideName = styled(NameText)`
  color: #ff80ab;
`;

const GroomName = styled(NameText)`
  color: #ff80ab;
`;

const AndSymbol = styled.span`
  font-size: 5.5rem;
  color: #ff1744;
  margin: 0 1.5rem;
  font-family: 'Playfair Display', serif;
  text-shadow: 0 0 25px rgba(255, 23, 68, 0.9);
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    font-size: 4rem;
  }
`;

const DateText = styled.div`
  font-size: 2.3rem;
  color: #ff4081;
  margin-bottom: 2.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.7);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const Message = styled.p`
  font-size: 1.8rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    line-height: 1.6;
  }
`;

const HeartContainer = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    height: 70px;
    margin-top: 1.5rem;
  }
`;

const HeartIcon = styled.span`
  color: #ff1744;
  font-size: 5rem;
  animation: heartbeat 1.5s infinite;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.8);
  
  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

export default WelcomeMessage; 