import { Category } from '../types';

export const assignCategory = (tags: string): Category => {
  const tagLower = tags.toLowerCase();
  
  if (tagLower.includes('house') || tagLower.includes('villa') || tagLower.includes('mansion')) {
    return 'Homes';
  } else if (tagLower.includes('car') || tagLower.includes('vehicle')) {
    return 'Cars';
  } else if (tagLower.includes('boat') || tagLower.includes('yacht')) {
    return 'Boats';
  } else if (tagLower.includes('travel') || tagLower.includes('vacation')) {
    return 'Travel';
  } else if (tagLower.includes('fashion') || tagLower.includes('clothes')) {
    return 'Fashion';
  } else if (tagLower.includes('jewelry') || tagLower.includes('diamond')) {
    return 'Jewelry';
  } else if (tagLower.includes('watch') || tagLower.includes('timepiece')) {
    return 'Watches';
  } else if (tagLower.includes('art') || tagLower.includes('painting')) {
    return 'Art';
  } else if (tagLower.includes('event') || tagLower.includes('experience')) {
    return 'Experiences';
  } else {
    return 'Gadgets';
  }
};