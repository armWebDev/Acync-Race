import { createAction } from '@reduxjs/toolkit';

interface EngineStartedPayload {
  id: number;
  runId: string;
  duration: number;
  startedAt: number;
}

const engineStarted = createAction<EngineStartedPayload>('race/engineStarted');

export default engineStarted;
