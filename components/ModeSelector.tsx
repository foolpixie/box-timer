
import React from 'react';
import { TimerMode } from '../types';

interface ModeSelectorProps {
  activeMode: TimerMode;
  onSelect: (mode: TimerMode) => void;
  disabled: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onSelect, disabled }) => {
  const modes = [
    { id: TimerMode.CLOCK, label: 'Clock' },
    { id: TimerMode.AMRAP, label: 'AMRAP' },
    { id: TimerMode.EMOM, label: 'EMOM' },
    { id: TimerMode.TABATA, label: 'Tabata' },
    { id: TimerMode.FOR_TIME, label: 'For Time' },
  ];

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
      {modes.map((mode) => (
        <button
          key={mode.id}
          disabled={disabled}
          onClick={() => onSelect(mode.id)}
          className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-semibold text-sm
            ${activeMode === mode.id 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-zinc-800 text-zinc-400 active:bg-zinc-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};
