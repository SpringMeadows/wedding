import React from 'react';
import styled from 'styled-components';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface SoundControlProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const SoundControl: React.FC<SoundControlProps> = ({ enabled, onChange }) => {
  return (
    <SoundControlButton
      onClick={() => onChange(!enabled)}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      title={enabled ? 'Mute sound' : 'Enable sound'}
    >
      {enabled ? 
        <span>{React.createElement(FaVolumeUp as any)}</span> : 
        <span>{React.createElement(FaVolumeMute as any)}</span>}
      <SoundText>{enabled ? 'Sound On' : 'Sound Off'}</SoundText>
    </SoundControlButton>
  );
};

const SoundControlButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 23, 68, 0.5);
  border-radius: 50px;
  width: auto;
  padding: 0.7rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  svg {
    font-size: 1.5rem;
    color: #ff1744;
    filter: drop-shadow(0 0 8px rgba(255, 23, 68, 0.5));
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(255, 23, 68, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    
    svg {
      filter: drop-shadow(0 0 12px rgba(255, 23, 68, 0.8));
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    
    svg {
      font-size: 1.3rem;
    }
  }
`;

const SoundText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export default SoundControl; 