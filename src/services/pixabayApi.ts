const API_KEY = '47416749-c836903e5c91c12873c6712e9';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchPixabayImages = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`
    );
    const data = await response.json();
    
    return data.hits.map((item: any) => ({
      id: item.id.toString(),
      title: generateTitle(item.tags),
      image: item.largeImageURL,
      description: `Beautiful ${item.tags.replace(',', ', ')}`,
      price: generatePrice(assignCategory(item.tags)),
      category: assignCategory(item.tags)
    }));
  } catch (error) {
    console.error('Error fetching Pixabay images:', error);
    return [];
  }
};

const generateTitle = (tags: string): string => {
  const tagArray = tags.split(',').map(tag => tag.trim());
  return tagArray[0].charAt(0).toUpperCase() + tagArray[0].slice(1);
};

const generatePrice = (category: string): number => {
  if (category === 'Boats') {
    // Boats: $1,000,000+
    return Math.floor(Math.random() * (10000000 - 1000000) + 1000000);
  }

  // Other categories: $1,000 - $500,000
  const minPrice = 1000;
  const maxPrice = 500000;
  return Math.floor(Math.random() * (maxPrice - minPrice) + minPrice);
};

const assignCategory = (tags: string): Category => {
  const tagLower = tags.toLowerCase();
  if (tagLower.includes('house') || tagLower.includes('villa') || tagLower.includes('mansion')) {
    return 'Homes';
  } else if (tagLower.includes('car') || tagLower.includes('vehicle')) {
    return 'Cars';
  } else if (tagLower.includes('boat') || tagLower.includes('yacht')) {
    return 'Boats';
  } else if (tagLower.includes('travel') || tagLower.includes('vacation')) {
    return 'Travel';
  } else if (tagLower.includes('fashion') || tagLower.includes('clothes') || tagLower.includes('dress')) {
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