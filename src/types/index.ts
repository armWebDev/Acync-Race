export interface Car {
  id: number;
  name: string;
  color: string;
}

export type CarDraft = Omit<Car, 'id'>;

export interface EngineParams {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerRow extends Winner {
  name: string;
  color: string;
}

export interface Page<T> {
  items: T[];
  total: number;
}

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface WinnersQuery {
  page: number;
  sort: SortField;
  order: SortOrder;
}

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
