import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TimerStatus, TimerSettings } from './types';
import { audioService } from './services/audioService';
import { ModeSelector } from './components/ModeSelector';
import { SettingsForm } from './components/SettingsForm';
import { DigitalDisplay } from './components/DigitalDisplay';

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.CLOCK);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [systemTimeStr, setSystemTimeStr] = useState<string>('--:--:--');
  
  const [settings, setSettings] = useState<TimerSettings>({
    amrapDuration: 600,
    emomWorkDuration: 60,
    emomRounds: 10,
    emomRestDuration: 0,
    tabataRounds: 8,
    tabataWorkDuration: 20,
    tabataRestDuration: 10,
  });

  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const formatTime = (totalSeconds: number): string => {
    const absSeconds = Math.round(Math.abs(totalSeconds));
    const mins = Math.floor(absSeconds / 60);
    const secs = Math.floor(absSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSystemClock = useCallback(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    setSystemTimeStr(`${h}:${m}:${s}`);
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (!lastTickRef.current) lastTickRef.current = timestamp;
    const delta = timestamp - lastTickRef.current;

    // Tick exactly every 1000ms
    if (delta >= 1000) {
      lastTickRef.current = timestamp;

      // Always update system clock string
      updateSystemClock();

      // Only update gym timer if not IDLE
      if (status !== TimerStatus.IDLE && status !== TimerStatus.PAUSED && status !== TimerStatus.FINISHED) {
        setCurrentTime((prev) => {
          const isCountUp = mode === TimerMode.FOR_TIME && status === TimerStatus.RUNNING;
          const next = isCountUp ? prev + 1 : prev - 1;
          
          // Audio cues logic
          if (status === TimerStatus.COUNTDOWN || status === TimerStatus.RUNNING || status === TimerStatus.RESTING) {
            if (next <= 3 && next > 0) {
              audioService.playLowBeep();
            } else if (next === 0) {
              audioService.playHighBeep();
            }
          }
          return next;
        });
      }
    }

    timerRef.current = window.requestAnimationFrame(tick);
  }, [mode, status, updateSystemClock]);

  // Start the animation loop on mount and keep it running for the system clock
  useEffect(() => {
    timerRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (timerRef.current) window.cancelAnimationFrame(timerRef.current);
    };
  }, [tick]);

  // Logic for transitioning rounds and states
  useEffect(() => {
    if (status === TimerStatus.COUNTDOWN && currentTime < 0) {
      if (mode === TimerMode.AMRAP) {
        setCurrentTime(settings.amrapDuration);
        setStatus(TimerStatus.RUNNING);
      } else if (mode === TimerMode.FOR_TIME) {
        setCurrentTime(0);
        setStatus(TimerStatus.RUNNING);
      } else if (mode === TimerMode.EMOM) {
        setCurrentTime(settings.emomWorkDuration);
        setCurrentRound(1);
        setStatus(TimerStatus.RUNNING);
      } else if (mode === TimerMode.TABATA) {
        setCurrentTime(settings.tabataWorkDuration);
        setCurrentRound(1);
        setStatus(TimerStatus.RUNNING);
      }
    }

    if (status === TimerStatus.RUNNING) {
      if (mode === TimerMode.AMRAP && currentTime < 0) {
        setStatus(TimerStatus.FINISHED);
      }
      
      if (mode === TimerMode.EMOM && currentTime < 0) {
        if (settings.emomRestDuration > 0) {
          setCurrentTime(settings.emomRestDuration);
          setStatus(TimerStatus.RESTING);
        } else {
          if (currentRound < settings.emomRounds) {
            setCurrentRound(prev => prev + 1);
            setCurrentTime(settings.emomWorkDuration);
          } else {
            setStatus(TimerStatus.FINISHED);
          }
        }
      }

      if (mode === TimerMode.TABATA && currentTime < 0) {
        setCurrentTime(settings.tabataRestDuration);
        setStatus(TimerStatus.RESTING);
      }
    }

    if (status === TimerStatus.RESTING && currentTime < 0) {
      if (mode === TimerMode.EMOM) {
        if (currentRound < settings.emomRounds) {
          setCurrentRound(prev => prev + 1);
          setCurrentTime(settings.emomWorkDuration);
          setStatus(TimerStatus.RUNNING);
        } else {
          setStatus(TimerStatus.FINISHED);
        }
      }
      if (mode === TimerMode.TABATA) {
        if (currentRound < settings.tabataRounds) {
          setCurrentRound(prev => prev + 1);
          setCurrentTime(settings.tabataWorkDuration);
          setStatus(TimerStatus.RUNNING);
        } else {
          setStatus(TimerStatus.FINISHED);
        }
      }
    }
  }, [currentTime, status, mode, settings, currentRound]);

  const handleStart = () => {
    setCurrentTime(10);
    setStatus(TimerStatus.COUNTDOWN);
    audioService.playLowBeep(); 
  };

  const handleStop = () => {
    setStatus(TimerStatus.IDLE);
    setCurrentTime(0);
    setCurrentRound(1);
  };

  const renderContent = () => {
    if (status === TimerStatus.IDLE) {
      return (
        <div className="flex flex-col h-full bg-black overflow-hidden">
          <ModeSelector activeMode={mode} onSelect={setMode} disabled={false} />
          <div className="flex-1 flex flex-col overflow-hidden">
            {mode === TimerMode.CLOCK ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <DigitalDisplay timeValue={systemTimeStr} label="System Clock" />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <SettingsForm mode={mode} settings={settings} onChange={setSettings} />
                </div>
                <div className="p-6 bg-zinc-950 border-t border-zinc-900 pb-safe">
                  <button
                    onClick={handleStart}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl text-2xl uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all"
                  >
                    Start Workout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    let timeStr = formatTime(currentTime);
    let roundStr = '';
    let label = mode.toString().replace('_', ' ');
    let isResting = status === TimerStatus.RESTING;

    if (status === TimerStatus.COUNTDOWN) {
      label = "GET READY";
      timeStr = Math.max(0, currentTime).toString().padStart(2, '0');
    } else if (status === TimerStatus.FINISHED) {
      label = "FINISHED";
      timeStr = "00:00";
    } else {
      if (mode === TimerMode.EMOM || mode === TimerMode.TABATA) {
        roundStr = currentRound.toString().padStart(2, '0');
        label = isResting ? "REST" : "WORK";
      }
    }

    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center bg-black overflow-hidden">
        <DigitalDisplay 
          timeValue={timeStr} 
          roundValue={roundStr}
          label={label} 
          isResting={isResting}
        />
        
        <div className="absolute bottom-10 left-0 right-0 px-10 flex gap-4 pb-safe">
          <button 
            onClick={handleStop} 
            className="flex-1 bg-zinc-900/50 backdrop-blur border border-zinc-800 text-zinc-500 font-black py-4 rounded-xl text-xs uppercase tracking-widest active:bg-zinc-800"
          >
            Reset Timer
          </button>
          {status === TimerStatus.FINISHED && (
             <button 
              onClick={() => setStatus(TimerStatus.IDLE)} 
              className="flex-1 bg-red-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest"
             >
               Exit
             </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden pt-safe">
      <header className="px-6 py-5 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 hide-header-on-landscape transition-all">
        <h1 className="text-xl font-black italic text-red-600 tracking-tighter">BOX TIMER</h1>
        <div className="flex items-center gap-3">
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">{mode}</span>
           <div className={`h-2.5 w-2.5 rounded-full ${status === TimerStatus.RUNNING ? 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-zinc-800'}`}></div>
        </div>
      </header>
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;