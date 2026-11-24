import garageApi from '../../api/garageApi';
import winnersApi from '../../api/winnersApi';
import createAppAsyncThunk from '../../app/createAppAsyncThunk';
import { UNKNOWN_CAR_COLOR } from '../../constants';
import type { Winner, WinnerRow, WinnersQuery } from '../../types';
import { toQueryKey } from './winnersQuery';

export const fetchWinners = createAppAsyncThunk(
  'winners/fetchWinners',
  async (query: WinnersQuery) => {
    const { items, total } = await winnersApi.getPage(query);
    const cars = await garageApi.getByIds(items.map((winner) => winner.id));
    const carsById = new Map(cars.map((car) => [car.id, car]));

    const rows: WinnerRow[] = items.map((winner) => {
      const car = carsById.get(winner.id);
      return {
        ...winner,
        name: car?.name ?? 'Unknown car',
        color: car?.color ?? UNKNOWN_CAR_COLOR,
      };
    });

    return { rows, total };
  },
  {
    condition: (query, { getState }) => {
      const { status, requestedQuery } = getState().winners;
      return !(status === 'loading' && requestedQuery === toQueryKey(query));
    },
  },
);

export const recordWin = createAppAsyncThunk(
  'winners/recordWin',
  async ({ id, time }: Pick<Winner, 'id' | 'time'>) => {
    const existing = await winnersApi.find(id);

    if (!existing) {
      return winnersApi.create({ id, wins: 1, time });
    }

    return winnersApi.update({
      id,
      wins: existing.wins + 1,
      time: Math.min(existing.time, time),
    });
  },
);
