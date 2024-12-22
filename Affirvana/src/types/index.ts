export type Category = 
  | 'Homes' 
  | 'Travel' 
  | 'Cars' 
  | 'Boats' 
  | 'Gadgets'
  | 'Fashion'
  | 'Jewelry'
  | 'Watches'
  | 'Art'
  | 'Experiences';

export interface LuxuryItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: Category;
  description: string;
  rating?: number;
  ratingCount?: number;
  isFavorite?: boolean;
}

export interface CartItem extends LuxuryItem {
  quantity: number;
}

export interface Purchase {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  subtotal: number;
  salesTax: number;
  luxuryTax: number;
  shipping: number;
  shippingDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    currency: string;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  favorites: string[];
}