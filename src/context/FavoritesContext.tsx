import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/favorites';
import { LuxuryItem } from '../types';

interface FavoritesContextType {
  favorites: LuxuryItem[];
  toggleFavorite: (item: LuxuryItem) => void;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<LuxuryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load favorites when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      if (user) {
        try {
          const userFavorites = await getFavorites(user.id);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFavorites([]);
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Optimistically update UI and handle errors
  const toggleFavorite = useCallback(async (item: LuxuryItem) => {
    if (!user) return;

    const exists = favorites.some(fav => fav.id === item.id);
    const prevFavorites = [...favorites];
    
    try {
      // Optimistically update UI
      const newFavorites = exists
        ? prevFavorites.filter(fav => fav.id !== item.id)
        : [...prevFavorites, { ...item, isFavorite: true }];
      
      setFavorites(newFavorites);

      if (exists) {
        await removeFromFavorites(user.id, item.id);
      } else {
        await addToFavorites(user.id, item);
      }

      // Refresh favorites after successful operation
      const updatedFavorites = await getFavorites(user.id);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setFavorites(prevFavorites);
    }
  }, [user, favorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoading }}>
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