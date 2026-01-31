import React from 'react';
import { TimerMode, TimerSettings } from '../types';
import { ScrollPicker } from './ScrollPicker';

interface SettingsFormProps {
  mode: TimerMode;
  settings: TimerSettings;
  onChange: (settings: TimerSettings) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ mode, settings, onChange }) => {
  const handleChange = (key: keyof TimerSettings, val: number) => {
    onChange({ ...settings, [key]: val });
  };

  if (mode === TimerMode.CLOCK) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-red-600/20 border-t-red-600 animate-spin mb-6"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing Local Time...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {mode === TimerMode.AMRAP && (
          <ScrollPicker 
            label="Workout Duration" 
            value={settings.amrapDuration / 60} 
            onChange={(v) => handleChange('amrapDuration', v * 60)}
            min={1}
            max={60}
            unit="min"
          />
        )}

        {mode === TimerMode.EMOM && (
          <>
            <ScrollPicker 
              label="Work Interval" 
              value={settings.emomWorkDuration} 
              onChange={(v) => handleChange('emomWorkDuration', v)}
              min={5}
              max={300}
              step={5}
              unit="sec"
            />
            <ScrollPicker 
              label="Total Rounds" 
              value={settings.emomRounds} 
              onChange={(v) => handleChange('emomRounds', v)}
              min={1}
              max={100}
            />
            <ScrollPicker 
              label="Rest Interval" 
              value={settings.emomRestDuration} 
              onChange={(v) => handleChange('emomRestDuration', v)}
              min={0}
              max={120}
              step={5}
              unit="sec"
            />
          </>
        )}

        {mode === TimerMode.TABATA && (
          <>
             <ScrollPicker 
              label="Tabata Rounds" 
              value={settings.tabataRounds} 
              onChange={(v) => handleChange('tabataRounds', v)}
              min={1}
              max={50}
            />
            <ScrollPicker 
              label="Work Time" 
              value={settings.tabataWorkDuration} 
              onChange={(v) => handleChange('tabataWorkDuration', v)}
              min={5}
              max={120}
              step={5}
              unit="sec"
            />
            <ScrollPicker 
              label="Rest Time" 
              value={settings.tabataRestDuration} 
              onChange={(v) => handleChange('tabataRestDuration', v)}
              min={5}
              max={120}
              step={5}
              unit="sec"
            />
          </>
        )}

        {mode === TimerMode.FOR_TIME && (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="text-4xl mb-4">⏱️</div>
            <p className="text-zinc-500 text-sm font-medium">Standard count-up timer. Hit start to begin your workout.</p>
          </div>
        )}
      </div>
    </div>
  );
};