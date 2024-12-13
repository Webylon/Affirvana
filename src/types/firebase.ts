export interface FirebaseUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    currency: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface FirebaseItem {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebasePurchase {
  id: string;
  userId: string;
  itemId: string;
  price: number;
  purchaseDate: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface FirebaseRating {
  id: string;
  userId: string;
  itemId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface FirebaseFavorite {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
}