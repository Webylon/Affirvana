import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ItemGrid from './ItemGrid';
import { LuxuryItem } from '../types';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './ui/LoadingSpinner';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { addToCart } = useCart();
  const [favoriteItems, setFavoriteItems] = useState<LuxuryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorite items from Supabase
  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (favorites.length === 0) {
        setFavoriteItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('luxury_items')
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .in('id', favorites);

        if (error) throw error;

        const items: LuxuryItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          image: item.image,
          category: item.categories.name,
          description: item.description,
          rating: Number(item.rating) || undefined,
          ratingCount: Number(item.rating_count) || undefined,
        }));

        setFavoriteItems(items);
      } catch (err) {
        console.error('Error fetching favorite items:', err);
        setError('Failed to load favorite items');
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) {
      fetchFavoriteItems();
    }
  }, [favorites, favoritesLoading]);

  const handleAddToCart = (item: LuxuryItem) => {
    addToCart(item);
  };

  if (loading || favoritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">You haven't saved any items to your favorites yet.</p>
        </div>
      ) : (
        <ItemGrid
          items={favoriteItems}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          onLoadMore={() => {}}
          hasMore={false}
          loading={false}
        />
      )}
    </div>
  );
};

export default Favorites;