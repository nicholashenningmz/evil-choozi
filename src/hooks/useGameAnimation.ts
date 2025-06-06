import { useCallback } from 'react';
import { useAudio } from './useAudio';
import { GamePhase } from './useGameState';
import { Finger } from "@/hooks/useGameState";


export const useGameAnimation = (
  soundEnabled: boolean,
  setGamePhase: (phase: GamePhase) => void,
  setScreenColor: (color: string) => void,
  setShowImpAnimation: (show: boolean) => void,
  setShowOnlyWinner: (show: boolean) => void,
  resetGame: () => void
) => {
  const { playEvilGiggle, vibrate } = useAudio(soundEnabled);

  // Execute the selection animation sequence
  // The 'useCallback' starts here and wraps the entire function definition
  const executeSelection = useCallback((winner: Finger | null) => {
    if (!winner) return;

    console.log('executeSelection called. Winner ID:', winner.id);
    console.log('executeSelection: soundEnabled is', soundEnabled); // Check the value of soundEnabled here

    if (soundEnabled) {
      console.log('executeSelection: About to call playEvilGiggle in 1 second.'); // Update log
      setTimeout(() => { // <--- ADD THIS
        playEvilGiggle();
        console.log('playEvilGiggle called after 1 second delay.'); // Optional: add log for delayed call
      }, 1000); // <--- Delay for 1000 milliseconds (1 second)
    } else {
      console.log('executeSelection: Sound is not enabled, skipping playEvilGiggle.');
    }

    console.log('Starting animation with winner:', winner);

    // Phase 1: Hide losing circles (0.5 seconds)
    setGamePhase('hiding-losers');
    setShowOnlyWinner(true);

    setTimeout(() => {
      // Phase 2: Expand winner color to fill screen (0.5 seconds)
      setGamePhase('expanding');
      setScreenColor(winner.color);

      setTimeout(() => {
        // Phase 3: Contract back to circle with vibration (0.5 seconds)
        setGamePhase('contracting');
        setScreenColor('#000000');
        vibrate();

        setTimeout(() => {
          // Phase 4: Keep winning circle on screen for an additional half second
          setTimeout(() => {
            // Phase 5: Fade the winning circle (0.5 seconds)
            setGamePhase('fading');

            setTimeout(() => {
              // Phase 6: Wait 1 second, then show imp animation (keep only winner visible)
              setTimeout(() => {
                setGamePhase('revealing');
                setScreenColor('#1a1a1a');
                setShowImpAnimation(true);
                // Keep showOnlyWinner true so only winner circle stays visible

                setTimeout(() => {
                  // Phase 7: Reset everything
                  resetGame();
                }, 1800);
              }, 800);
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  }, [ // <-- Dependency array starts here
    soundEnabled,
    playEvilGiggle,
    vibrate,
    setGamePhase,
    setScreenColor,
    setShowImpAnimation,
    setShowOnlyWinner,
    resetGame
  ]); // <-- useCallback's closing parenthesis and bracket for dependency array

  return { executeSelection };
};