import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuxuryItem } from '../types/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface FavoritesContextType {
  favorites: LuxuryItem[];
  addToFavorites: (item: LuxuryItem) => Promise<void>;
  removeFromFavorites: (item: LuxuryItem) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

interface StoredFavorite {
  id: string;
  user_id: string;
  item_id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string;
  created_at: string;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<LuxuryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (favoritesData) {
        const items = favoritesData.map((fav: StoredFavorite) => ({
          id: fav.item_id,
          title: fav.title,
          description: fav.description || '',
          price: fav.price,
          image: fav.image_url,
          category: 'Luxury',
          isFavorite: true
        }));
        setFavorites(items);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      toast.error('Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (item: LuxuryItem) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      setError(null);

      // First check if it's already a favorite
      if (isFavorite(item.id)) {
        return;
      }
      
      const { error: insertError } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          item_id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image_url: item.image
        }]);

      if (insertError) throw insertError;

      setFavorites(prev => [...prev, { ...item, isFavorite: true }]);
      toast.success('Added to favorites');
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      toast.error('Failed to add to favorites');
      throw err;
    }
  };

  const removeFromFavorites = async (item: LuxuryItem) => {
    if (!user) return;

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .match({
          user_id: user.id,
          item_id: item.id
        });

      if (deleteError) throw deleteError;

      setFavorites(prev => prev.filter(fav => fav.id !== item.id));
      toast.success('Removed from favorites');
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      toast.error('Failed to remove from favorites');
      throw err;
    }
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.some(fav => fav.id === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        isLoading,
        error,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};