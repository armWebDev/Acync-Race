import garageApi from '../../api/garageApi';
import winnersApi from '../../api/winnersApi';
import createAppAsyncThunk from '../../app/createAppAsyncThunk';
import { GARAGE_PAGE_LIMIT } from '../../constants';
import type { Car, CarDraft } from '../../types';
import { createRandomCars } from '../../utils/randomCar';

export const fetchCars = createAppAsyncThunk(
  'garage/fetchCars',
  (page: number) => garageApi.getPage(page, GARAGE_PAGE_LIMIT),
  {
    condition: (page, { getState }) => {
      const { status, requestedPage } = getState().garage;
      return !(status === 'loading' && requestedPage === page);
    },
  },
);

export const createCar = createAppAsyncThunk('garage/createCar', (draft: CarDraft) =>
  garageApi.create(draft),
);

export const generateCars = createAppAsyncThunk('garage/generateCars', async (count: number) => {
  const drafts = createRandomCars(count);
  const results = await Promise.allSettled(drafts.map((draft) => garageApi.create(draft)));

  const createdCars: Car[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      createdCars.push(result.value);
    }
  });

  if (createdCars.length === 0) {
    throw new Error('Failed to generate cars');
  }

  return createdCars.sort((a, b) => a.id - b.id);
});

export const updateCar = createAppAsyncThunk('garage/updateCar', ({ id, ...draft }: Car) =>
  garageApi.update(id, draft),
);

export const deleteCar = createAppAsyncThunk(
  'garage/deleteCar',
  async (id: number) => {
    await garageApi.remove(id);

    try {
      const winner = await winnersApi.find(id);
      if (winner) {
        await winnersApi.remove(id);
      }
      return { id, wasWinner: winner !== null, winnerCleanupError: null };
    } catch (error) {
      return { id, wasWinner: true, winnerCleanupError: String(error) };
    }
  },
  {
    condition: (id, { getState }) => !getState().garage.deletingIds.includes(id),
  },
);
