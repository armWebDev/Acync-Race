import {
  createEntityAdapter,
  createSlice,
  type ActionReducerMapBuilder,
  type EntityState,
} from '@reduxjs/toolkit';
import { recordWin } from '../winners/winnersThunks';
import engineStarted from './raceActions';
import { resetRace, startCar, startRace, stopCar } from './raceThunks';
import type { EngineState, RaceStatus, RaceWinner } from './raceTypes';

const enginesAdapter = createEntityAdapter<EngineState>();

export interface RaceState {
  status: RaceStatus;
  raceId: string | null;
  engines: EntityState<EngineState, number>;
  winner: RaceWinner | null;
  error: string | null;
}

const initialState: RaceState = {
  status: 'idle',
  raceId: null,
  engines: enginesAdapter.getInitialState(),
  winner: null,
  error: null,
};

const findRunEngine = (state: RaceState, carId: number, runId: string) => {
  const engine = state.engines.entities[carId];
  if (engine?.runId !== runId) {
    return undefined;
  }
  return engine;
};

const addEngineStartCases = (builder: ActionReducerMapBuilder<RaceState>) =>
  builder
    .addCase(startCar.pending, (state, { meta }) => {
      enginesAdapter.setOne(state.engines, {
        id: meta.arg,
        status: 'starting',
        runId: meta.requestId,
        duration: 0,
        startedAt: 0,
        stoppedAt: null,
      });
    })
    .addCase(engineStarted, (state, { payload }) => {
      const engine = findRunEngine(state, payload.id, payload.runId);
      if (!engine) {
        return;
      }
      engine.status = 'driving';
      engine.duration = payload.duration;
      engine.startedAt = payload.startedAt;
    })
    .addCase(startCar.fulfilled, (state, { payload, meta }) => {
      const engine = findRunEngine(state, payload.id, meta.requestId);
      if (!engine) {
        return;
      }

      if (payload.finished) {
        engine.status = 'finished';
        engine.stoppedAt = null;
      } else {
        engine.status = 'broken';
        engine.stoppedAt = payload.endedAt;
      }
    })
    .addCase(startCar.rejected, (state, { meta }) => {
      if (findRunEngine(state, meta.arg, meta.requestId)) {
        enginesAdapter.removeOne(state.engines, meta.arg);
        state.error = 'Lost connection to a car engine. The car was moved back to the start.';
      }
    });

const addEngineStopCases = (builder: ActionReducerMapBuilder<RaceState>) =>
  builder
    .addCase(stopCar.pending, (state, { meta }) => {
      enginesAdapter.updateOne(state.engines, {
        id: meta.arg,
        changes: { status: 'stopping', runId: null },
      });
    })
    .addCase(stopCar.fulfilled, (state, { meta }) => {
      enginesAdapter.removeOne(state.engines, meta.arg);
    })
    .addCase(stopCar.rejected, (state, { meta }) => {
      enginesAdapter.removeOne(state.engines, meta.arg);
      state.error =
        'Could not stop a car engine on the server. The car was moved back to the start.';
    });

const addRaceCases = (builder: ActionReducerMapBuilder<RaceState>) =>
  builder
    .addCase(startRace.pending, (state, { meta }) => {
      state.status = 'racing';
      state.raceId = meta.requestId;
      state.winner = null;
      state.error = null;
    })
    .addCase(startRace.fulfilled, (state, { payload, meta }) => {
      if (state.raceId !== meta.requestId) {
        return;
      }
      state.status = 'finished';
      state.winner = payload;
    })
    .addCase(startRace.rejected, (state, { meta }) => {
      if (state.raceId === meta.requestId) {
        state.status = 'finished';
      }
    })
    .addCase(resetRace.pending, (state) => {
      state.status = 'idle';
      state.raceId = null;
      state.winner = null;
    })
    .addCase(recordWin.rejected, (state) => {
      state.error = 'The race finished, but the result could not be saved to the winners table.';
    });

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    winnerDismissed(state) {
      state.winner = null;
    },
    errorDismissed(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    addEngineStartCases(builder);
    addEngineStopCases(builder);
    addRaceCases(builder);
  },
});

export const { winnerDismissed, errorDismissed } = raceSlice.actions;
export default raceSlice.reducer;
