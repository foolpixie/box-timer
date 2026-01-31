import React, { useRef, useEffect } from 'react';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 999, 
  step = 1,
  unit = "" 
}) => {
  const timerRef = useRef<number | null>(null);
  const initialDelay = 500;
  const repeatInterval = 80;

  const handleAdjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  const startAdjusting = (delta: number) => {
    handleAdjust(delta);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => {
        handleAdjust(delta);
      }, repeatInterval);
    }, initialDelay);
  };

  const stopAdjusting = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAdjusting();
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2 bg-zinc-900/50 rounded-2xl border border-zinc-800">
      <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest pl-2">
        {label}
      </label>
      <div className="flex items-center justify-between gap-2">
        <button
          onMouseDown={() => startAdjusting(-step)}
          onMouseUp={stopAdjusting}
          onMouseLeave={stopAdjusting}
          onTouchStart={(e) => { e.preventDefault(); startAdjusting(-step); }}
          onTouchEnd={stopAdjusting}
          className="w-14 h-14 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-red-600 transition-colors text-2xl font-bold text-white select-none"
        >
          −
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white digital-font glow-red leading-none">
            {value}
          </span>
          {unit && <span className="text-[8px] text-zinc-600 font-bold uppercase mt-1">{unit}</span>}
        </div>

        <button
          onMouseDown={() => startAdjusting(step)}
          onMouseUp={stopAdjusting}
          onMouseLeave={stopAdjusting}
          onTouchStart={(e) => { e.preventDefault(); startAdjusting(step); }}
          onTouchEnd={stopAdjusting}
          className="w-14 h-14 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-red-600 transition-colors text-2xl font-bold text-white select-none"
        >
          +
        </button>
      </div>
    </div>
  );
};