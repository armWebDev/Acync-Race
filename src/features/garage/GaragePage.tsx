import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';
import WinnerModal from '../race/components/WinnerModal';
import { selectIsTrackBusy, selectRaceError } from '../race/raceSelectors';
import { errorDismissed as raceErrorDismissed } from '../race/raceSlice';
import CarEditor from './components/CarEditor';
import CarList from './components/CarList';
import RaceControls from './components/RaceControls';
import useGarage from './hooks/useGarage';
import './garage.css';

export default function GaragePage() {
  const { cars, total, page, pageCount, isLoading, error, changePage, retry, dismissError } =
    useGarage();
  const isTrackBusy = useAppSelector(selectIsTrackBusy);
  const raceError = useAppSelector(selectRaceError);
  const dispatch = useAppDispatch();

  return (
    <section className="view">
      <div className="panel">
        <CarEditor />
        <RaceControls />
      </div>

      <h1 className="view__title">
        Garage <span className="view__count">({total})</span>
      </h1>

      {error && <ErrorMessage message={error} onRetry={retry} onDismiss={dismissError} />}
      {raceError && (
        <ErrorMessage message={raceError} onDismiss={() => dispatch(raceErrorDismissed())} />
      )}

      <CarList cars={cars} isLoading={isLoading} />

      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={changePage}
        disabled={isLoading || isTrackBusy}
      />

      <WinnerModal />
    </section>
  );
}
