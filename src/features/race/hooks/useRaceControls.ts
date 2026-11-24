import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { GENERATED_CARS_COUNT } from '../../../constants';
import { selectGarageCars, selectIsGenerating } from '../../garage/garageSelectors';
import { generateCars } from '../../garage/garageThunks';
import { selectIsRaceActive, selectIsTrackBusy } from '../raceSelectors';
import { resetRace, startRace } from '../raceThunks';

export default function useRaceControls() {
  const dispatch = useAppDispatch();
  const hasCars = useAppSelector(selectGarageCars).length > 0;
  const isTrackBusy = useAppSelector(selectIsTrackBusy);
  const isRaceActive = useAppSelector(selectIsRaceActive);
  const isGenerating = useAppSelector(selectIsGenerating);

  const race = useCallback(() => dispatch(startRace()), [dispatch]);
  const reset = useCallback(() => dispatch(resetRace()), [dispatch]);
  const generate = useCallback(() => dispatch(generateCars(GENERATED_CARS_COUNT)), [dispatch]);

  return {
    canRace: hasCars && !isTrackBusy,
    canReset: isTrackBusy,
    canGenerate: !isRaceActive && !isGenerating,
    isGenerating,
    race,
    reset,
    generate,
  };
}
