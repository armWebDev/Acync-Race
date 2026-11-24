import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectIsRaceActive } from '../../race/raceSelectors';
import { createFormChanged, editFormChanged, type CarFormValues } from '../carFormsSlice';
import { selectCreateForm, selectEditForm } from '../garageSelectors';
import { createCar, updateCar } from '../garageThunks';

const trimName = ({ name, color }: CarFormValues): CarFormValues => ({ name: name.trim(), color });

export function useCreateCarForm() {
  const dispatch = useAppDispatch();
  const values = useAppSelector(selectCreateForm);
  const isRaceActive = useAppSelector(selectIsRaceActive);

  const change = useCallback(
    (patch: Partial<CarFormValues>) => dispatch(createFormChanged(patch)),
    [dispatch],
  );
  const submit = useCallback(() => {
    dispatch(createCar(trimName(values)));
  }, [dispatch, values]);

  return { values, isDisabled: isRaceActive, change, submit };
}

export function useUpdateCarForm() {
  const dispatch = useAppDispatch();
  const values = useAppSelector(selectEditForm);
  const isRaceActive = useAppSelector(selectIsRaceActive);

  const change = useCallback(
    (patch: Partial<CarFormValues>) => dispatch(editFormChanged(patch)),
    [dispatch],
  );
  const hasSelectedCar = values.carId !== null;

  const submit = useCallback(() => {
    if (values.carId === null) {
      return;
    }
    dispatch(updateCar({ id: values.carId, ...trimName(values) }));
  }, [dispatch, values]);

  return { values, isDisabled: isRaceActive || !hasSelectedCar, change, submit };
}
