import { useState, useEffect } from 'react';
import { Howl } from 'howler';

interface UseAudioProps {
  src: string;
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

const useAudio = ({ src, volume = 0.5, loop = true, autoplay = true }: UseAudioProps) => {
  const [audio, setAudio] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    // Create the Howl instance
    const sound = new Howl({
      src: [src],
      volume,
      loop,
      autoplay
    });

    setAudio(sound);

    // Clean up on unmount
    return () => {
      sound.stop();
      sound.unload();
    };
  }, [src, volume, loop, autoplay]);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const setVolume = (newVolume: number) => {
    if (!audio) return;
    
    audio.volume(Math.min(1, Math.max(0, newVolume)));
  };

  return {
    audio,
    isPlaying,
    togglePlay,
    setVolume
  };
};

export default useAudio; 