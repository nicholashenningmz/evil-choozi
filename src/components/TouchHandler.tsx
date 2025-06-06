
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { CircleComponent } from "@/components/CircleComponent";
import { ImpAnimation } from "@/components/ImpAnimation";
import { Finger } from "@/hooks/useGameState";
import { COLORS } from "@/hooks/useGameLogic";

interface TouchHandlerProps {
  fingers: Finger[];
  screenColor: string;
  gamePhase: string;
  showImpAnimation: boolean;
  showOnlyWinner: boolean;
  winner: Finger | null;
  isTouchBlocked: (gamePhase: string) => boolean;
 setFingers: React.Dispatch<React.SetStateAction<Finger[]>>; 
  colorIndexRef: React.MutableRefObject<number>;
  countdownRef: React.MutableRefObject<NodeJS.Timeout | null>;
  startCountdown: (latestFingers: Finger[]) => void;
}

const MOVEMENT_THRESHOLD = 15; // Pixels

export const TouchHandler: React.FC<TouchHandlerProps> = ({
  fingers,
  screenColor,
  gamePhase,
  showImpAnimation,
  showOnlyWinner,
  winner,
  isTouchBlocked,
  setFingers,
  colorIndexRef,
  countdownRef,
  startCountdown
}) => {
  // ADDED: Create a ref to attach to the div, allowing direct DOM manipulation
  const touchAreaRef = useRef<HTMLDivElement>(null);

  // Your touch handlers remain mostly the same, but they will be attached via addEventListener
const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();

    if (isTouchBlocked(gamePhase)) return;

    // Calculate the newFingers array *before* calling setFingers
    const currentTouches = Array.from(event.touches);
    const newFingersMap = new Map<string, Finger>();
    const rect = touchAreaRef.current ? touchAreaRef.current.getBoundingClientRect() : { left: 0, top: 0 };

    // Process current touches to build the newFingersMap
    currentTouches.forEach(touch => {
        const fingerId = `finger-${touch.identifier}`;
        // For touchstart, always create a new entry with a new color, or update if it somehow already exists
        newFingersMap.set(fingerId, {
            id: fingerId,
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
            color: COLORS[colorIndexRef.current % COLORS.length]
        });
        colorIndexRef.current++;
    });

    const fingersToUpdateStateAndCountdown = Array.from(newFingersMap.values());

    // Update the state with the newly calculated fingers
    setFingers(fingersToUpdateStateAndCountdown);

    // Now, call startCountdown with the array that *just* calculated
    startCountdown(fingersToUpdateStateAndCountdown);

}, [gamePhase, isTouchBlocked, setFingers, colorIndexRef, startCountdown]);


const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();

    if (isTouchBlocked(gamePhase)) return;

    // Calculate the updatedFingers array *before* calling setFingers
    let shouldResetCountdown = false;
    const currentTouches = Array.from(event.touches);
    const updatedFingersMap = new Map<string, Finger>();
    const rect = touchAreaRef.current ? touchAreaRef.current.getBoundingClientRect() : { left: 0, top: 0 };

    // Start with current fingers from state to find existing ones
    // Note: 'fingers' (from props) here might be slightly behind if a very rapid touchstart just happened.
    // However, for touchmove, it's generally safe to rely on the latest state for tracking.
    fingers.forEach(f => updatedFingersMap.set(f.id, f));

    currentTouches.forEach(touch => {
        const fingerId = `finger-${touch.identifier}`;
        const existingFinger = updatedFingersMap.get(fingerId);

        const newX = touch.clientX - rect.left;
        const newY = touch.clientY - rect.top;

        if (existingFinger) {
            const deltaX = newX - existingFinger.x;
            const deltaY = newY - existingFinger.y;
            const distance = Math.hypot(deltaX, deltaY);

            if (distance > MOVEMENT_THRESHOLD) {
                shouldResetCountdown = true;
            }

            updatedFingersMap.set(fingerId, {
                ...existingFinger,
                x: newX,
                y: newY,
            });
        } else {
            shouldResetCountdown = true;
            updatedFingersMap.set(fingerId, {
                id: fingerId,
                x: newX,
                y: newY,
                color: COLORS[colorIndexRef.current % COLORS.length]
            });
            colorIndexRef.current++;
        }
    });

    const fingersToUpdateStateAndCountdown = Array.from(updatedFingersMap.values());

    // Update the state with the newly calculated fingers
    setFingers(fingersToUpdateStateAndCountdown);

    // Now, call startCountdown with the array that *just* calculated
    if (shouldResetCountdown) {
        startCountdown(fingersToUpdateStateAndCountdown);
    }

}, [gamePhase, isTouchBlocked, setFingers, colorIndexRef, startCountdown, fingers]); // Added 'fingers' to dependencies


const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (event.cancelable) {
        event.preventDefault();
    }

    if (isTouchBlocked(gamePhase)) return;

    // NEW: Create a Set of IDs of fingers that are still on the screen *after* this 'touchend' event
    const currentTouchIdsOnScreen = new Set(Array.from(event.touches).map(touch => `finger-${touch.identifier}`));

    // Calculate the remainingFingers array *before* calling setFingers
    const remainingFingers = fingers.filter(finger => // Use 'fingers' from props as the base
        currentTouchIdsOnScreen.has(finger.id)
    );

    // Update the state with the newly calculated fingers
    setFingers(remainingFingers);

    // Now, call startCountdown with the array that *just* calculated
    if (remainingFingers.length > 0) {
        startCountdown(remainingFingers);
    } else {
        console.log('TouchHandler: Ended touch. No fingers remain. Clearing countdown.');
        if (countdownRef.current) {
            clearTimeout(countdownRef.current);
            countdownRef.current = null;
        }
    }
}, [gamePhase, isTouchBlocked, setFingers, startCountdown, countdownRef, fingers]); // Added 'fingers' to dependencies


  const handleTouchCancel = useCallback((event: TouchEvent) => {
    console.log('Touch Cancelled');
    // Reuse touch end logic, which correctly filters remaining fingers and manages countdown
    handleTouchEnd(event);
  }, [handleTouchEnd]); // Dependency for useCallback

  // ADDED: useEffect hook to manually attach event listeners
  useEffect(() => {
    const touchArea = touchAreaRef.current;

    if (touchArea) {
      // ADDED: Attach event listeners with { passive: false } to allow event.preventDefault()
      touchArea.addEventListener('touchstart', handleTouchStart, { passive: false });
      touchArea.addEventListener('touchmove', handleTouchMove, { passive: false });
      // CHANGED: For touchend and touchcancel, we generally don't need passive: false
      // unless you have a very specific reason to cancel them (which is rare).
      // They are often non-cancelable by browser design.
      // However, for consistency and to avoid potential issues, keeping passive: false here
      // won't hurt if you call preventDefault().
      touchArea.addEventListener('touchend', handleTouchEnd, { passive: false });
      touchArea.addEventListener('touchcancel', handleTouchCancel, { passive: false });

      // ADDED: Cleanup function to remove event listeners when the component unmounts
      return () => {
        touchArea.removeEventListener('touchstart', handleTouchStart);
        touchArea.removeEventListener('touchmove', handleTouchMove);
        touchArea.removeEventListener('touchend', handleTouchEnd);
        touchArea.removeEventListener('touchcancel', handleTouchCancel);
      };
    }
  }, [

    handleTouchStart, // If these handlers change (e.g., due to closure over unstable props/state)
    handleTouchMove,  // they should be wrapped in useCallback to prevent infinite loops.
    handleTouchEnd,   // For this rewrite, I'm assuming they are stable or will be memoized.
    handleTouchCancel
  ]);

  return (
    <div
      ref={touchAreaRef} // ADDED: Attach the ref to this div
      className="w-full h-full relative transition-colors duration-500"
      // CHANGED: Added touch-action: none to CSS to prevent default browser touch behaviors
      style={{ backgroundColor: screenColor, touchAction: 'none' }}
      // REMOVED: All onTouchStart, onTouchMove, onTouchEnd, onTouchCancel props from here!
    >
      {/* Render finger circles */}
      {fingers.map((finger) => {
        // During revealing phase (imp animation), only show winner
        if (gamePhase === 'revealing' && showOnlyWinner && finger.id !== winner?.id) {
          return null;
        }
        
        // Show all circles during waiting, or only winner during specific phases
        const shouldShow = !showOnlyWinner || finger.id === winner?.id;
        const isCurrentWinner = winner?.id === finger.id;
        
        // Hide during fading phase if it's the winner
        if (gamePhase === 'fading' && isCurrentWinner) {
          return null;
        }
        
        return shouldShow ? (
          <CircleComponent
            key={finger.id}
            x={finger.x}
            y={finger.y}
            color={finger.color}
            isWinner={isCurrentWinner && (gamePhase === 'hiding-losers' || gamePhase === 'expanding' || gamePhase === 'contracting' || gamePhase === 'revealing')}
          />
        ) : null;
      })}

      {/* Evil imp animation */}
      {showImpAnimation && (
        <ImpAnimation />
      )}
    </div>
  );
};
