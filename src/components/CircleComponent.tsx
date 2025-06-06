
import React, { useEffect, useState } from 'react';

interface CircleComponentProps {
  x: number;
  y: number;
  color: string;
  isWinner?: boolean;
}

export const CircleComponent: React.FC<CircleComponentProps> = ({ 
  x, 
  y, 
  color, 
  isWinner = false 
}) => {
  const [scale, setScale] = useState(1);

  // Pulsating animation
  useEffect(() => {
    if (isWinner) return; // Stop animation when selected
    
    const startTime = Date.now() + Math.random() * 1500; // Random start offset
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) % 1500;
      const progress = elapsed / 1500;
      
      // Smooth easing animation between 0.9 and 1.1
      const easeInOut = 0.5 * (1 + Math.sin(2 * Math.PI * progress - Math.PI / 2));
      const newScale = 0.9 + (easeInOut * 0.2);
      
      setScale(newScale);
      
      if (!isWinner) {
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [isWinner]);

  const circleSize = 90; // Increased from 80 to 90 pixels for better visibility

  return (
    <div
      className={`absolute pointer-events-none transition-all duration-200 ${
        isWinner ? 'z-10' : 'z-0'
      }`}
      style={{
        left: x - circleSize / 2,
        top: y - circleSize / 2,
        width: circleSize,
        height: circleSize,
        transform: `scale(${scale})`,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: isWinner 
          ? `0 0 20px ${color}, 0 0 40px ${color}` 
          : `0 0 10px rgba(0,0,0,0.3)`,
        transition: isWinner ? 'box-shadow 0.5s ease-out' : 'none'
      }}
    />
  );
};
