import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ScrollPickerProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({ 
  label, value, onChange, min, max, step = 1, unit = "" 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const itemWidth = 80;

  // Generate range of options
  const options: number[] = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  // Handle snapping manually to trigger onChange
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !isReady) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.round(scrollLeft / itemWidth);
    const newValue = options[Math.max(0, Math.min(index, options.length - 1))];
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
    }
  }, [isReady, options, value, onChange]);

  // Initial scroll position alignment
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const idx = options.indexOf(value);
        if (idx !== -1) {
          scrollRef.current.scrollLeft = idx * itemWidth;
        }
        setIsReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-1 py-4 border-b border-zinc-900 last:border-0">
      <div className="flex justify-between items-center px-6">
        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em]">
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-red-600 digital-font">{value}</span>
          <span className="text-[10px] text-zinc-600 font-bold uppercase">{unit}</span>
        </div>
      </div>

      <div className="relative h-24 w-full flex items-center bg-zinc-950/30 mt-2">
        {/* Selection Highlighter */}
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-20 h-16 border-y-2 border-red-600/30 bg-red-600/5 pointer-events-none rounded-sm"></div>
        
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory picker-gradient-mask h-full items-center px-[calc(50%-40px)]"
        >
          {options.map((opt) => (
            <div 
              key={opt}
              style={{ width: `${itemWidth}px` }}
              className={`flex-shrink-0 text-center snap-center transition-all duration-200 flex items-center justify-center h-full
                ${opt === value ? 'text-red-600 text-4xl font-black digital-font scale-110' : 'text-zinc-700 text-xl font-bold'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};