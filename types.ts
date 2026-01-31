
export enum TimerMode {
  CLOCK = 'CLOCK',
  AMRAP = 'AMRAP',
  EMOM = 'EMOM',
  TABATA = 'TABATA',
  FOR_TIME = 'FOR_TIME'
}

export enum TimerStatus {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  RUNNING = 'RUNNING',
  RESTING = 'RESTING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export interface TimerSettings {
  amrapDuration: number; // seconds
  emomWorkDuration: number; // seconds
  emomRounds: number;
  emomRestDuration: number; // seconds
  tabataRounds: number;
  tabataWorkDuration: number; // seconds
  tabataRestDuration: number; // seconds
}

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  currentTime: number; // seconds or ms depending on context
  currentRound: number;
  totalRounds: number;
  isLeadIn: boolean;
}
