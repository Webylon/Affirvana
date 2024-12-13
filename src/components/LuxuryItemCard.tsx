import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { LuxuryItem } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface LuxuryItemCardProps {
  item: LuxuryItem;
  onAddToCart: (item: LuxuryItem) => void;
  onToggleFavorite: (itemId: string) => void;
}

const LuxuryItemCard: React.FC<LuxuryItemCardProps> = ({ item, onAddToCart, onToggleFavorite }) => {
  const { favorites } = useFavorites();
  const isFavorite = favorites.includes(item.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <span className="text-sm font-medium text-purple-600 whitespace-nowrap ml-2">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
          
          {item.rating && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">
                {item.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({item.ratingCount} reviews)
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onAddToCart(item)}
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(LuxuryItemCard);