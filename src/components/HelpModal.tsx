
import React from 'react';
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          How to Use Evil Chwazi
        </h2>
        
        <div className="text-gray-700 space-y-3 text-left">
          <p>
            Place your fingers anywhere on the screen. Each finger will create a colored circle.
          </p>
          
          <p>
            Wait 2 seconds without adding or removing fingers.
          </p>
          
          <p>
            The app will <span className="line-through">randomly</span> <em className="text-purple-600 font-semibold">impishly</em> select one color. The finger closest to the bottom of the phone screen will be chosen.
          </p>
          
          <p className="text-sm text-gray-500 italic">
            Tap anywhere to close this help.
          </p>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Got it! 😈
          </Button>
        </div>
      </div>
    </div>
  );
};
