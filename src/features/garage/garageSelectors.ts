import type { RootState } from '../../app/store';
import { GARAGE_PAGE_LIMIT } from '../../constants';
import { getPageCount } from '../../utils/pagination';

export const selectGarage = (state: RootState) => state.garage;
export const selectGarageCars = (state: RootState) => state.garage.cars;
export const selectGaragePageCount = (state: RootState) =>
  getPageCount(state.garage.total, GARAGE_PAGE_LIMIT);
export const selectIsGenerating = (state: RootState) => state.garage.isGenerating;
export const selectIsCarDeleting = (state: RootState, id: number) =>
  state.garage.deletingIds.includes(id);

export const selectCreateForm = (state: RootState) => state.carForms.create;
export const selectEditForm = (state: RootState) => state.carForms.edit;
