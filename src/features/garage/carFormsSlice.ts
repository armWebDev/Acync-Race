import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_CAR_COLOR } from '../../constants';
import type { Car, CarDraft } from '../../types';
import { createCar, deleteCar, updateCar } from './garageThunks';

export type CarFormValues = CarDraft;

export interface EditFormValues extends CarFormValues {
  carId: number | null;
}

interface CarFormsState {
  create: CarFormValues;
  edit: EditFormValues;
}

const emptyCreateForm: CarFormValues = { name: '', color: DEFAULT_CAR_COLOR };
const emptyEditForm: EditFormValues = { ...emptyCreateForm, carId: null };

const initialState: CarFormsState = {
  create: emptyCreateForm,
  edit: emptyEditForm,
};

const carFormsSlice = createSlice({
  name: 'carForms',
  initialState,
  reducers: {
    createFormChanged(state, action: PayloadAction<Partial<CarFormValues>>) {
      Object.assign(state.create, action.payload);
    },
    editFormChanged(state, action: PayloadAction<Partial<CarFormValues>>) {
      Object.assign(state.edit, action.payload);
    },
    carSelected(state, { payload }: PayloadAction<Car>) {
      state.edit = { carId: payload.id, name: payload.name, color: payload.color };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCar.fulfilled, (state) => {
        state.create = emptyCreateForm;
      })
      .addCase(updateCar.fulfilled, (state) => {
        state.edit = emptyEditForm;
      })
      .addCase(deleteCar.fulfilled, (state, { payload }) => {
        if (state.edit.carId === payload.id) {
          state.edit = emptyEditForm;
        }
      });
  },
});

export const { createFormChanged, editFormChanged, carSelected } = carFormsSlice.actions;
export default carFormsSlice.reducer;
