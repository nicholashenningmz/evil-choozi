import React, { useState, useEffect, useCallback } from 'react';
import { HelpModal } from "@/components/HelpModal";
import { GameControls } from "@/components/GameControls";
import { TouchHandler } from "@/components/TouchHandler";
import { useGameState, Finger } from '@/hooks/useGameState';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGameAnimation } from '@/hooks/useGameAnimation';
import { useAudio } from '@/hooks/useAudio';

const Index = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const {
    fingers,
    setFingers,
    gamePhase,
    setGamePhase,
    winner,
    setWinner,
    screenColor,
    setScreenColor,
    showImpAnimation,
    setShowImpAnimation,
    showOnlyWinner,
    setShowOnlyWinner,
    countdownRef,
    colorIndexRef,
    resetGame // Ensure resetGame is properly defined in useGameState
  } = useGameState();

  const { findWinner, isTouchBlocked } = useGameLogic();

  // Call the useAudio hook at the top level
  const { playEvilGiggle, vibrate } = useAudio(soundEnabled);

  // Call useGameAnimation at the top level
  // Arguments are correct as positional, since playEvilGiggle is used *inside* useGameAnimation
  const { executeSelection } = useGameAnimation(
    soundEnabled,
    setGamePhase,
    setScreenColor,
    setShowImpAnimation,
    setShowOnlyWinner,
    resetGame // Make sure resetGame is passed correctly if it's from useGameState
  );

  // Separate useEffect for confirming useAudio initialization
  useEffect(() => {
    console.log('Main Component: useAudio hook called and initialized. playEvilGiggle obtained.');
  }, [playEvilGiggle]); // Dependency array looks correct

  // startCountdown wrapped in useCallback, at the top level of the component
  const startCountdown = useCallback((currentFingers: Finger[]) => {
    console.log('Index: startCountdown received. currentFingers.length:', currentFingers.length);

    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null; // Important to nullify after clearing
      console.log('Index: Existing countdown cleared.');
    }

    if (currentFingers.length > 0) {
      console.log('Index: Setting new countdown for', currentFingers.length, 'fingers.');
      countdownRef.current = setTimeout(() => {
        console.log('Index: Countdown timer finished. Selecting winner for', currentFingers.length, 'fingers.');
        const selectedWinner = findWinner(currentFingers);
        setWinner(selectedWinner);
        executeSelection(selectedWinner); // This will now trigger the animation and sound
        countdownRef.current = null;
      }, 2000);
    } else {
      console.log('Index: No fingers to count down. Countdown not started.');
    }
  }, [countdownRef, findWinner, setWinner, executeSelection]); // Dependencies for useCallback are correct

  // Cleanup on unmount - this useEffect is correctly placed and structured
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Main touch area */}
      <TouchHandler
        fingers={fingers}
        screenColor={screenColor}
        gamePhase={gamePhase}
        showImpAnimation={showImpAnimation}
        showOnlyWinner={showOnlyWinner}
        winner={winner}
        isTouchBlocked={isTouchBlocked}
        setFingers={setFingers}
        colorIndexRef={colorIndexRef}
        countdownRef={countdownRef}
        startCountdown={startCountdown} // Pass the useCallback wrapped function
      />

      {/* Control buttons */}
      <GameControls
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        setShowHelp={setShowHelp}
      />

      {/* Help modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};

export default Index;