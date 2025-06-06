
import React, { useEffect, useState } from 'react';

export const ImpAnimation: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { duration: 400, scale: 0 },
      { duration: 800, scale: 1.2 },
      { duration: 800, scale: 1 },
      { duration: 400, scale: 0 }
    ];

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < phases.length - 1) {
        currentPhase++;
        setPhase(currentPhase);
      } else {
        clearInterval(interval);
      }
    }, phases[currentPhase]?.duration || 400);

    return () => clearInterval(interval);
  }, []);

  const getPhaseStyle = () => {
    const phases = [
      { scale: 0, opacity: 0 },
      { scale: 1.2, opacity: 1 },
      { scale: 1, opacity: 1 },
      { scale: 0, opacity: 0 }
    ];
    
    return phases[phase] || phases[0];
  };

  const style = getPhaseStyle();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div 
        className="text-8xl transition-all duration-500 ease-out"
        style={{
          transform: `scale(${style.scale})`,
          opacity: style.opacity
        }}
      >
        😈
      </div>
      
      {/* Dark overlay during animation */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-purple-900/50 to-red-900/50 -z-10 transition-opacity duration-1000"
        style={{ opacity: phase > 0 && phase < 3 ? 1 : 0 }}
      />
    </div>
  );
};
