import type { SortField, SortOrder, WinnersQuery } from '../../types';

const DEFAULT_ORDER: Record<SortField, SortOrder> = {
  wins: 'DESC',
  time: 'ASC',
};

export const toQueryKey = ({ page, sort, order }: WinnersQuery): string =>
  `${page}:${sort}:${order}`;

export const getNextOrder = (current: WinnersQuery, field: SortField): SortOrder => {
  if (current.sort !== field) {
    return DEFAULT_ORDER[field];
  }
  return current.order === 'ASC' ? 'DESC' : 'ASC';
};
