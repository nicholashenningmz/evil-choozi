
import { useCallback } from 'react';
import { Finger } from './useGameState';

// Array of colors for circles
export const COLORS = [
  '#FF6B6B', // Bright red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue  
  '#96CEB4', // Mint green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light blue
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9F43'  // Orange
];

export const useGameLogic = () => {
  // Find the winner - finger closest to bottom of screen
  const findWinner = useCallback((activeFingers: Finger[]): Finger => {
    if (activeFingers.length === 0) return null!;
    
    console.log('Finding winner from fingers:', activeFingers.map(f => ({ id: f.id, y: f.y, x: f.x, color: f.color })));
    
    // Start with the first finger as temporary winner
    let winner = activeFingers[0];
    
    // Loop through all fingers to find the one with the greatest y value (closest to bottom)
    for (let i = 1; i < activeFingers.length; i++) {
      const finger = activeFingers[i];
      
      console.log(`Comparing finger ${finger.id} (y: ${finger.y}) with current winner ${winner.id} (y: ${winner.y})`);
      
      if (finger.y > winner.y) {
        // This finger is closer to the bottom than our current winner
        console.log(`New winner: ${finger.id} with y: ${finger.y}`);
        winner = finger;
      } else if (finger.y === winner.y && finger.x > winner.x) {
        // Tiebreaker: rightmost finger wins if they're at same height
        console.log(`Tiebreaker winner: ${finger.id} with x: ${finger.x}`);
        winner = finger;
      }
    }
    
    console.log('Final winner selected:', { id: winner.id, y: winner.y, x: winner.x, color: winner.color });
    return winner;
  }, []);

  // Check if we're in an animation phase where touches should be blocked
  const isTouchBlocked = useCallback((gamePhase: string): boolean => {
    return gamePhase !== 'waiting' && gamePhase !== 'resetting';
  }, []);

  return { findWinner, isTouchBlocked };
};
