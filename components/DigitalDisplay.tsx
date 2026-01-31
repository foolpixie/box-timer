
import React from 'react';

interface DigitalDisplayProps {
  timeValue: string;
  roundValue?: string;
  label?: string;
  isResting?: boolean;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({ timeValue, roundValue, label, isResting }) => {
  // Logic to generate ghost segments (88) for the round and time
  const timeGhost = timeValue.replace(/[0-9]/g, '8');
  const roundGhost = roundValue ? roundValue.replace(/[0-9]/g, '8') : '';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 select-none overflow-hidden">
      {label && (
        <div className="text-xs md:text-xl font-bold mb-4 uppercase tracking-[0.3em] text-zinc-600 transition-colors">
          {label}
        </div>
      )}
      
      <div className="flex items-baseline justify-center relative">
        {/* ROUND PART (GREEN) */}
        {roundValue && (
          <div className="relative mr-[0.2em]">
             {/* Round Ghost */}
             <div className="digital-font absolute inset-0 ghost-green whitespace-nowrap text-[20vw] landscape:text-[45vh]">
               {roundGhost}
             </div>
             {/* Round Active */}
             <div className="digital-font relative z-10 glow-green whitespace-nowrap text-[20vw] landscape:text-[45vh]">
               {roundValue}
             </div>
          </div>
        )}

        {/* TIME PART (RED) */}
        <div className="relative">
          {/* Time Ghost */}
          <div className={`digital-font absolute inset-0 whitespace-nowrap text-[20vw] landscape:text-[45vh] ${isResting ? 'ghost-green' : 'ghost-red'}`}>
            {timeGhost}
          </div>
          {/* Time Active */}
          <div className={`digital-font relative z-10 whitespace-nowrap text-[20vw] landscape:text-[45vh] ${isResting ? 'glow-green' : 'glow-red'}`}>
            {timeValue}
          </div>
        </div>
      </div>
    </div>
  );
};
