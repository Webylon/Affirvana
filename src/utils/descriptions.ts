import { Category } from '../types';

const LUXURY_ADJECTIVES = [
  'exquisite', 'prestigious', 'opulent', 'refined', 'distinguished',
  'elegant', 'sophisticated', 'luxurious', 'premium', 'exclusive'
];

const CATEGORY_DESCRIPTIONS: Record<Category, string[]> = {
  Homes: [
    'Nestled in a prime location, this architectural masterpiece offers unparalleled luxury living.',
    'A harmonious blend of modern design and timeless elegance defines this exceptional property.',
    'Experience the pinnacle of residential luxury in this meticulously crafted estate.'
  ],
  Travel: [
    'Embark on an extraordinary journey to one of the world\'s most exclusive destinations.',
    'Indulge in a bespoke travel experience crafted for the most discerning adventurers.',
    'Discover paradise reimagined through this exceptional luxury travel opportunity.'
  ],
  Cars: [
    'Engineering excellence meets artistic design in this remarkable automotive achievement.',
    'Experience unrivaled performance and sophistication in this masterpiece of modern engineering.',
    'A perfect synthesis of power, precision, and luxury defines this exceptional vehicle.'
  ],
  Boats: [
    'Navigate the seas in unprecedented style and comfort aboard this magnificent vessel.',
    'Experience maritime luxury at its finest with this expertly crafted yacht.',
    'Set sail into a world of exclusive luxury with this exceptional watercraft.'
  ],
  Gadgets: [
    'Cutting-edge technology meets sophisticated design in this premium device.',
    'Experience the future of technology through this innovative luxury gadget.',
    'Precision engineering and elegant design unite in this high-end technological marvel.'
  ],
  Fashion: [
    'Elevate your style with this masterpiece of contemporary fashion design.',
    'Impeccable craftsmanship meets timeless elegance in this exclusive piece.',
    'Experience the pinnacle of luxury fashion with this distinguished creation.'
  ],
  Jewelry: [
    'A stunning testament to the artistry of fine jewelry making.',
    'Radiant beauty meets exceptional craftsmanship in this precious piece.',
    'Experience timeless elegance with this masterfully created jewelry item.'
  ],
  Watches: [
    'A masterpiece of horological excellence and precision engineering.',
    'Timeless sophistication meets innovative craftsmanship in this exceptional timepiece.',
    'Experience the art of fine watchmaking with this distinguished creation.'
  ],
  Art: [
    'A compelling masterpiece that captures the essence of contemporary artistic expression.',
    'Experience the transformative power of fine art through this exceptional piece.',
    'A stunning example of artistic excellence and creative vision.'
  ],
  Experiences: [
    'Immerse yourself in an unparalleled journey of luxury and discovery.',
    'Experience excellence redefined through this exclusive opportunity.',
    'Create lasting memories with this carefully curated luxury experience.'
  ]
};

export const generateItemDescription = (category: Category, baseDescription: string): string => {
  const adjective = LUXURY_ADJECTIVES[Math.floor(Math.random() * LUXURY_ADJECTIVES.length)];
  const categoryDesc = CATEGORY_DESCRIPTIONS[category][Math.floor(Math.random() * CATEGORY_DESCRIPTIONS[category].length)];
  
  return `${categoryDesc} This ${adjective} ${category.toLowerCase()} piece ${baseDescription.toLowerCase()}. Crafted for those who appreciate the finest things in life, this offering represents the pinnacle of luxury in its category.`;
};