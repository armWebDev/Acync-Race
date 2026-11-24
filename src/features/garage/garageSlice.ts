import {
  createSlice,
  isRejected,
  type ActionReducerMapBuilder,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { GARAGE_PAGE_LIMIT } from '../../constants';
import type { Car, LoadStatus } from '../../types';
import { getPageCount, getPageOffset } from '../../utils/pagination';
import { createCar, deleteCar, fetchCars, generateCars, updateCar } from './garageThunks';

export interface GarageState {
  cars: Car[];
  total: number;
  page: number;
  loadedPage: number | null;
  requestedPage: number | null;
  status: LoadStatus;
  isGenerating: boolean;
  deletingIds: number[];
  error: string | null;
}

const initialState: GarageState = {
  cars: [],
  total: 0,
  page: 1,
  loadedPage: null,
  requestedPage: null,
  status: 'idle',
  isGenerating: false,
  deletingIds: [],
  error: null,
};

const appendCars = (state: GarageState, newCars: Car[]) => {
  state.total += newCars.length;

  const freeSlots = GARAGE_PAGE_LIMIT - state.cars.length;
  if (freeSlots > 0) {
    state.cars.push(...newCars.slice(0, freeSlots));
  }
};

const removeCar = (state: GarageState, id: number) => {
  state.cars = state.cars.filter((car) => car.id !== id);
  state.total = Math.max(0, state.total - 1);

  const isPageEmpty = state.cars.length === 0;
  if (isPageEmpty && state.page > 1) {
    state.page -= 1;
    return;
  }

  const carsUpToThisPage = getPageOffset(state.page, GARAGE_PAGE_LIMIT) + state.cars.length;
  const hasCarsOnNextPages = state.total > carsUpToThisPage;
  if (hasCarsOnNextPages) {
    state.loadedPage = null;
  }
};

const stopDeleting = (state: GarageState, id: number) => {
  state.deletingIds = state.deletingIds.filter((deletingId) => deletingId !== id);
};

const addFetchCases = (builder: ActionReducerMapBuilder<GarageState>) =>
  builder
    .addCase(fetchCars.pending, (state, { meta }) => {
      state.status = 'loading';
      state.requestedPage = meta.arg;
      state.error = null;
    })
    .addCase(fetchCars.fulfilled, (state, { payload, meta }) => {
      if (meta.arg !== state.page) {
        return;
      }
      const pageCount = getPageCount(payload.total, GARAGE_PAGE_LIMIT);

      state.status = 'succeeded';
      state.cars = payload.items;
      state.total = payload.total;
      state.loadedPage = meta.arg;
      state.page = Math.min(state.page, pageCount);
    })
    .addCase(fetchCars.rejected, (state, { meta }) => {
      if (meta.arg === state.page) {
        state.status = 'failed';
      }
    });

const addMutationCases = (builder: ActionReducerMapBuilder<GarageState>) =>
  builder
    .addCase(createCar.fulfilled, (state, { payload }) => {
      appendCars(state, [payload]);
    })
    .addCase(generateCars.pending, (state) => {
      state.isGenerating = true;
    })
    .addCase(generateCars.fulfilled, (state, { payload }) => {
      state.isGenerating = false;
      appendCars(state, payload);
    })
    .addCase(generateCars.rejected, (state) => {
      state.isGenerating = false;
    })
    .addCase(updateCar.fulfilled, (state, { payload }) => {
      state.cars = state.cars.map((car) => (car.id === payload.id ? payload : car));
    })
    .addCase(deleteCar.pending, (state, { meta }) => {
      state.deletingIds.push(meta.arg);
    })
    .addCase(deleteCar.fulfilled, (state, { payload }) => {
      stopDeleting(state, payload.id);
      removeCar(state, payload.id);
      if (payload.winnerCleanupError) {
        state.error = 'The car was deleted, but its winner record could not be removed.';
      }
    })
    .addCase(deleteCar.rejected, (state, { meta }) => {
      stopDeleting(state, meta.arg);
    });

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    pageChanged(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    errorDismissed(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    addFetchCases(builder);
    addMutationCases(builder);
    builder.addMatcher(
      isRejected(fetchCars, createCar, generateCars, updateCar, deleteCar),
      (state, { error }) => {
        state.error = error.message ?? 'Something went wrong';
      },
    );
  },
});

export const { pageChanged, errorDismissed } = garageSlice.actions;
export default garageSlice.reducer;
