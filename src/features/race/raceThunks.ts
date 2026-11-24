import engineApi from '../../api/engineApi';
import createAppAsyncThunk from '../../app/createAppAsyncThunk';
import type { RootState } from '../../app/store';
import { msToSeconds } from '../../utils/format';
import { recordWin } from '../winners/winnersThunks';
import engineStarted from './raceActions';
import { selectEngine, selectEngineIds } from './raceSelectors';
import type { RaceWinner } from './raceTypes';

const isActiveRun = (state: RootState, carId: number, runId: string) =>
  selectEngine(state, carId)?.runId === runId;

export const startCar = createAppAsyncThunk(
  'race/startCar',
  async (id: number, { dispatch, getState, requestId }) => {
    const { velocity, distance } = await engineApi.start(id);
    const duration = distance / velocity;
    dispatch(engineStarted({ id, runId: requestId, duration, startedAt: Date.now() }));

    let finished = false;
    if (isActiveRun(getState(), id, requestId)) {
      const reachedFinish = await engineApi.drive(id);
      finished = reachedFinish && isActiveRun(getState(), id, requestId);
    }

    return { id, duration, finished, endedAt: Date.now() };
  },
);

export const stopCar = createAppAsyncThunk(
  'race/stopCar',
  async (id: number) => {
    await engineApi.stop(id);
    return id;
  },
  {
    condition: (id, { getState }) => {
      const engine = selectEngine(getState(), id);
      return engine !== undefined && engine.status !== 'stopping';
    },
  },
);

export const startRace = createAppAsyncThunk(
  'race/startRace',
  async (_, { dispatch, getState, requestId }): Promise<RaceWinner | null> => {
    const { cars } = getState().garage;

    const finishers = cars.map(async (car): Promise<RaceWinner> => {
      const result = await dispatch(startCar(car.id)).unwrap();
      if (!result.finished) {
        throw new Error(`${car.name} did not finish`);
      }
      return { car, time: msToSeconds(result.duration) };
    });

    let winner: RaceWinner;
    try {
      winner = await Promise.any(finishers);
    } catch {
      return null;
    }

    const raceWasReset = getState().race.raceId !== requestId;
    if (raceWasReset) {
      return null;
    }

    dispatch(recordWin({ id: winner.car.id, time: winner.time }));
    return winner;
  },
);

export const resetRace = createAppAsyncThunk(
  'race/resetRace',
  async (_, { dispatch, getState }) => {
    const carIds = selectEngineIds(getState());
    await Promise.all(carIds.map((id) => dispatch(stopCar(id))));
  },
);
