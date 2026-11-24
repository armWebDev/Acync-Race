import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectGarage, selectGaragePageCount } from '../garageSelectors';
import { errorDismissed, pageChanged } from '../garageSlice';
import { fetchCars } from '../garageThunks';

export default function useGarage() {
  const dispatch = useAppDispatch();
  const { cars, total, page, loadedPage, status, error } = useAppSelector(selectGarage);
  const pageCount = useAppSelector(selectGaragePageCount);

  useEffect(() => {
    const needsLoading = loadedPage !== page;
    if (needsLoading) {
      dispatch(fetchCars(page));
    }
  }, [dispatch, loadedPage, page]);

  const changePage = useCallback((nextPage: number) => dispatch(pageChanged(nextPage)), [dispatch]);
  const retry = useCallback(() => dispatch(fetchCars(page)), [dispatch, page]);
  const dismissError = useCallback(() => dispatch(errorDismissed()), [dispatch]);

  return {
    cars,
    total,
    page,
    pageCount,
    isLoading: status === 'loading',
    error,
    changePage,
    retry,
    dismissError,
  };
}
