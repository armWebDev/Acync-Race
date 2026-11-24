import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { Car } from '../../../types';
import { selectEngine, selectIsRaceActive } from '../../race/raceSelectors';
import { startCar, stopCar } from '../../race/raceThunks';
import { carSelected } from '../carFormsSlice';
import { selectIsCarDeleting } from '../garageSelectors';
import { deleteCar } from '../garageThunks';

export type CarControls = ReturnType<typeof useCarControls>;

export default function useCarControls(car: Car) {
  const dispatch = useAppDispatch();
  const isRaceActive = useAppSelector(selectIsRaceActive);
  const isDeleting = useAppSelector((state) => selectIsCarDeleting(state, car.id));
  const engine = useAppSelector((state) => selectEngine(state, car.id));

  const isOnTrack = engine !== undefined;
  const isEngineBusy = engine?.status === 'starting' || engine?.status === 'stopping';

  const start = useCallback(() => dispatch(startCar(car.id)), [dispatch, car.id]);
  const stop = useCallback(() => dispatch(stopCar(car.id)), [dispatch, car.id]);
  const select = useCallback(() => dispatch(carSelected(car)), [dispatch, car]);
  const remove = useCallback(() => dispatch(deleteCar(car.id)), [dispatch, car.id]);

  return {
    canStart: !isRaceActive && !isOnTrack,
    canStop: !isRaceActive && isOnTrack && !isEngineBusy,
    canSelect: !isRaceActive && !isDeleting,
    canRemove: !isRaceActive && !isOnTrack && !isDeleting,
    start,
    stop,
    select,
    remove,
  };
}
