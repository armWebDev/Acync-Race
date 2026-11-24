const MS_IN_SECOND = 1000;
const TIME_PRECISION = 2;

export const msToSeconds = (ms: number): number =>
  Number((ms / MS_IN_SECOND).toFixed(TIME_PRECISION));

export const formatSeconds = (seconds: number): string => `${seconds.toFixed(TIME_PRECISION)} s`;
