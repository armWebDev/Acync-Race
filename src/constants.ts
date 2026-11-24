export const ROUTES = {
  garage: '/garage',
  winners: '/winners',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const GARAGE_PAGE_LIMIT = 7;
export const WINNERS_PAGE_LIMIT = 10;
export const GENERATED_CARS_COUNT = 100;

export const DEFAULT_CAR_COLOR = '#e63946';
export const CAR_NAME_MAX_LENGTH = 30;
export const UNKNOWN_CAR_COLOR = '#9e9e9e';
