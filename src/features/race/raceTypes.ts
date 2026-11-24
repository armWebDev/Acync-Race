import type { Car } from '../../types';

export type EngineStatus = 'starting' | 'driving' | 'broken' | 'finished' | 'stopping';

export interface EngineState {
  id: number;
  status: EngineStatus;
  runId: string | null;
  duration: number;
  startedAt: number;
  stoppedAt: number | null;
}

export type RaceStatus = 'idle' | 'racing' | 'finished';

export interface RaceWinner {
  car: Car;
  time: number;
}
