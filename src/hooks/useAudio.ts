
import { useRef, useEffect } from 'react';

export const useAudio = (soundEnabled: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for evil laugh
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    // Using a placeholder URL - in a real app, you'd host this audio file
    audioRef.current.src = '/sounds/giggle.mp3';
    console.log('useAudio: Audio element created and source set.'); // Added for confirmation
  }, []);

  const playEvilGiggle = () => {
    console.log('playEvilGiggle called.'); // Log whenever the function is invoked

    if (soundEnabled && audioRef.current) {
      console.log('Attempting to play audio. Sound enabled:', soundEnabled); // This is the key log
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        // This 'catch' should trigger for autoplay blocks or other playback failures
        console.log('Audio playback failed in catch block:', e);
      });
    } else {
      console.log('Audio not played. Condition check: soundEnabled =', soundEnabled, 'audioRef.current exists =', !!audioRef.current);
    }
  };

  // Vibration effect
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  return { playEvilGiggle, vibrate, audioRef };
};
