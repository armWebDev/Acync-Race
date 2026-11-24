import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { WINNERS_PAGE_LIMIT } from '../../constants';
import type { LoadStatus, SortField, WinnerRow, WinnersQuery } from '../../types';
import { getPageCount } from '../../utils/pagination';
import { deleteCar, updateCar } from '../garage/garageThunks';
import { getNextOrder, toQueryKey } from './winnersQuery';
import { fetchWinners, recordWin } from './winnersThunks';

interface WinnersState {
  rows: WinnerRow[];
  total: number;
  query: WinnersQuery;
  loadedQuery: string | null;
  requestedQuery: string | null;
  status: LoadStatus;
  error: string | null;
}

const initialState: WinnersState = {
  rows: [],
  total: 0,
  query: { page: 1, sort: 'wins', order: 'DESC' },
  loadedQuery: null,
  requestedQuery: null,
  status: 'idle',
  error: null,
};

const isCurrentQuery = (state: WinnersState, query: WinnersQuery) =>
  toQueryKey(state.query) === toQueryKey(query);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    pageChanged(state, action: PayloadAction<number>) {
      state.query.page = action.payload;
    },
    sortChanged(state, { payload: field }: PayloadAction<SortField>) {
      state.query = { page: 1, sort: field, order: getNextOrder(state.query, field) };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinners.pending, (state, { meta }) => {
        state.status = 'loading';
        state.requestedQuery = toQueryKey(meta.arg);
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, { payload, meta }) => {
        if (!isCurrentQuery(state, meta.arg)) {
          return;
        }
        const pageCount = getPageCount(payload.total, WINNERS_PAGE_LIMIT);

        state.status = 'succeeded';
        state.rows = payload.rows;
        state.total = payload.total;
        state.loadedQuery = toQueryKey(meta.arg);
        state.query.page = Math.min(state.query.page, pageCount);
      })
      .addCase(fetchWinners.rejected, (state, { meta, error }) => {
        if (!isCurrentQuery(state, meta.arg)) {
          return;
        }
        state.status = 'failed';
        state.error = error.message ?? 'Failed to load winners';
      })
      .addCase(recordWin.fulfilled, (state) => {
        state.loadedQuery = null;
      })
      .addCase(deleteCar.fulfilled, (state, { payload }) => {
        if (payload.wasWinner) {
          state.loadedQuery = null;
        }
      })
      .addCase(updateCar.fulfilled, (state, { payload }) => {
        state.rows = state.rows.map((row) =>
          row.id === payload.id ? { ...row, name: payload.name, color: payload.color } : row,
        );
      });
  },
});

export const { pageChanged, sortChanged } = winnersSlice.actions;
export default winnersSlice.reducer;
