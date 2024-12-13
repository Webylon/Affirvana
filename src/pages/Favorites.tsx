import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ItemGrid from '../components/ItemGrid';
import { LuxuryItem } from '../types';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();

  const handleAddToCart = (item: LuxuryItem) => {
    console.log('Added to cart:', item);
  };

  const handleToggleFavorite = (itemId: string) => {
    const item = favorites.find(i => i.id === itemId);
    if (item) {
      toggleFavorite(item);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">You haven't saved any items to your favorites yet.</p>
        </div>
      ) : (
        <ItemGrid
          items={favorites}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={() => {}}
          hasMore={false}
          loading={false}
        />
      )}
    </div>
  );
};

export default Favorites;