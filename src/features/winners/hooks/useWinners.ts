import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { RootState } from '../../../app/store';
import { WINNERS_PAGE_LIMIT } from '../../../constants';
import type { SortField } from '../../../types';
import { getPageCount, getPageOffset } from '../../../utils/pagination';
import { toQueryKey } from '../winnersQuery';
import { pageChanged, sortChanged } from '../winnersSlice';
import { fetchWinners } from '../winnersThunks';

const selectWinners = (state: RootState) => state.winners;

export default function useWinners() {
  const dispatch = useAppDispatch();
  const { rows, total, query, loadedQuery, status, error } = useAppSelector(selectWinners);
  const isCacheValid = loadedQuery === toQueryKey(query);

  useEffect(() => {
    if (!isCacheValid) {
      dispatch(fetchWinners(query));
    }
  }, [dispatch, isCacheValid, query]);

  const changePage = useCallback((page: number) => dispatch(pageChanged(page)), [dispatch]);
  const changeSort = useCallback((field: SortField) => dispatch(sortChanged(field)), [dispatch]);
  const retry = useCallback(() => dispatch(fetchWinners(query)), [dispatch, query]);

  return {
    rows,
    total,
    page: query.page,
    sort: query.sort,
    order: query.order,
    pageCount: getPageCount(total, WINNERS_PAGE_LIMIT),
    firstRowNumber: getPageOffset(query.page, WINNERS_PAGE_LIMIT) + 1,
    isLoading: status === 'loading',
    error,
    changePage,
    changeSort,
    retry,
  };
}
