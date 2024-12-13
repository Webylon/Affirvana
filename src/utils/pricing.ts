import { Category } from '../types';

const PRICE_RANGES: Record<Category, { min: number; max: number }> = {
  Homes: { min: 1000000, max: 25000000 },
  Travel: { min: 2000, max: 25000 },
  Cars: { min: 35000, max: 250000 },
  Boats: { min: 50000, max: 500000 },
  Gadgets: { min: 500, max: 5000 },
  Fashion: { min: 500, max: 10000 },
  Jewelry: { min: 1000, max: 50000 },
  Watches: { min: 2000, max: 75000 },
  Art: { min: 1000, max: 100000 },
  Experiences: { min: 1000, max: 25000 }
};

export const generateRandomPrice = (category: Category): number => {
  const { min, max } = PRICE_RANGES[category];
  const randomPrice = min + Math.random() * (max - min);
  // Round to nearest hundred for more realistic pricing
  return Math.round(randomPrice / 100) * 100;
};