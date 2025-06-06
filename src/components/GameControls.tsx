
import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, Volume2, VolumeX } from "lucide-react";

interface GameControlsProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setShowHelp: (show: boolean) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  soundEnabled,
  setSoundEnabled,
  setShowHelp
}) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        onClick={() => setShowHelp(true)}
      >
        <HelpCircle size={20} />
      </Button>
    </div>
  );
};
