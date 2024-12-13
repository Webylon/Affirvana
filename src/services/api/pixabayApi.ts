import { PixabayImage, PixabayResponse } from '../../types/api';
import { LuxuryItem } from '../../types';
import { generateRandomPrice } from '../../utils/pricing';
import { generateRandomRating } from '../../utils/ratings';
import { assignCategory } from '../../utils/categories';

const API_KEY = '47416749-c836903e5c91c12873c6712e9';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchPixabayImages = async (
  query: string,
  page: number,
  perPage: number = 50
): Promise<LuxuryItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true&min_width=800`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }

    const data: PixabayResponse = await response.json();
    return transformPixabayData(data.hits);
  } catch (error) {
    console.error('Error fetching Pixabay images:', error);
    return [];
  }
};

const transformPixabayData = (images: PixabayImage[]): LuxuryItem[] => {
  return images.map(image => {
    const category = assignCategory(image.tags);
    const { rating, ratingCount } = generateRandomRating();
    const price = generateRandomPrice(category);
    
    return {
      id: image.id.toString(),
      title: generateTitle(image.tags),
      description: `Beautiful ${image.tags.replace(',', ', ')}`,
      price,
      image: image.largeImageURL,
      category,
      rating,
      ratingCount,
      isFavorite: false
    };
  });
};

const generateTitle = (tags: string): string => {
  const tagArray = tags.split(',').map(tag => tag.trim());
  const mainTag = tagArray[0];
  return mainTag.charAt(0).toUpperCase() + mainTag.slice(1);
};