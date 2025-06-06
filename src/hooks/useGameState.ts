
import { useState, useRef } from 'react';

export type GamePhase = 'waiting' | 'hiding-losers' | 'expanding' | 'contracting' | 'fading' | 'revealing' | 'resetting';

export interface Finger {
  id: string;
  x: number;
  y: number;
  color: string;
}

export const useGameState = () => {
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting');
  const [winner, setWinner] = useState<Finger | null>(null);
  const [screenColor, setScreenColor] = useState('#000000');
  const [showImpAnimation, setShowImpAnimation] = useState(false);
  const [showOnlyWinner, setShowOnlyWinner] = useState(false);
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const colorIndexRef = useRef(0);

  const resetGame = () => {
    setGamePhase('resetting');
    setShowImpAnimation(false);
    setScreenColor('#000000');
    setWinner(null);
    setFingers([]);
    setShowOnlyWinner(false);
    colorIndexRef.current = 0;
    setGamePhase('waiting');
  };

  return {
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
    resetGame
  };
};
