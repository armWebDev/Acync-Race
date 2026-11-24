import type { RootState } from '../../app/store';

export const selectRaceStatus = (state: RootState) => state.race.status;
export const selectRaceWinner = (state: RootState) => state.race.winner;
export const selectRaceError = (state: RootState) => state.race.error;

export const selectEngine = (state: RootState, carId: number) => state.race.engines.entities[carId];

export const selectEngineIds = (state: RootState) => state.race.engines.ids;

export const selectIsRaceActive = (state: RootState) => state.race.status !== 'idle';

export const selectIsTrackBusy = (state: RootState) =>
  selectIsRaceActive(state) || state.race.engines.ids.length > 0;
