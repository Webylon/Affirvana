import React, { createContext, useContext, useState, useCallback } from 'react';
import { LuxuryItem } from '../types';

interface FavoritesContextType {
  favorites: LuxuryItem[];
  toggleFavorite: (item: LuxuryItem) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<LuxuryItem[]>([]);

  const toggleFavorite = useCallback((item: LuxuryItem) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, { ...item, isFavorite: true }];
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};