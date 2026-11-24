import type { CarDraft } from '../types';

const BRANDS = [
  'Tesla',
  'BMW',
  'Mercedes',
  'Audi',
  'Ford',
  'Toyota',
  'Honda',
  'Nissan',
  'Chevrolet',
  'Kia',
] as const;

const MODELS = [
  'X',
  'Model S',
  'GT',
  'Sport',
  'Turbo',
  'Pro',
  'Prime',
  'Coupe',
  'RS',
  'Evo',
] as const;

const MAX_RGB_VALUE = 0xffffff;
const HEX_RADIX = 16;
const HEX_COLOR_LENGTH = 6;

const pickRandom = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export const getRandomCarName = (): string => `${pickRandom(BRANDS)} ${pickRandom(MODELS)}`;

export const getRandomColor = (): string => {
  const value = Math.floor(Math.random() * (MAX_RGB_VALUE + 1));
  return `#${value.toString(HEX_RADIX).padStart(HEX_COLOR_LENGTH, '0')}`;
};

export const createRandomCars = (count: number): CarDraft[] =>
  Array.from({ length: count }, () => ({ name: getRandomCarName(), color: getRandomColor() }));
