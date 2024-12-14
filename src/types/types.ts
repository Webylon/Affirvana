export interface LuxuryItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  rating?: number;
  ratingCount?: number;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  created_at?: string;
}

export type Category = 
  | 'Fashion'
  | 'Jewelry'
  | 'Watches'
  | 'Cars'
  | 'Real Estate'
  | 'Art'
  | 'Travel'
  | 'Lifestyle';
