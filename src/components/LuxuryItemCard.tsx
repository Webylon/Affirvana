import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { LuxuryItem } from '../types/types';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../utils/format';

interface LuxuryItemCardProps {
  item: LuxuryItem;
}

const LuxuryItemCard: React.FC<LuxuryItemCardProps> = ({ item }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const itemIsFavorite = isFavorite(item.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (itemIsFavorite) {
        await removeFromFavorites(item);
      } else {
        await addToFavorites(item);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/item/${item.id}`} className="group">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors
            ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              itemIsFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{item.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.category || 'Luxury'}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
      </div>
    </Link>
  );
};

export default LuxuryItemCard;