import React from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf, Heart } from 'lucide-react';
import { LuxuryItem } from '../types';
import { formatPrice } from '../utils/formatters';
import { useFavorites } from '../context/FavoritesContext';

interface LuxuryItemCardProps {
  item: LuxuryItem;
  onAddToCart: (item: LuxuryItem) => void;
}

const LuxuryItemCard: React.FC<LuxuryItemCardProps> = ({ item, onAddToCart }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isItemFavorite = isFavorite(item.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleFavorite(item);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Store item details in localStorage for the details page
  React.useEffect(() => {
    localStorage.setItem(`item-${item.id}`, JSON.stringify({
      ...item,
      isFavorite: isItemFavorite
    }));
  }, [item, isItemFavorite]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="fill-yellow-400 text-yellow-400"
          size={16}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="fill-yellow-400 text-yellow-400"
          size={16}
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="text-gray-300"
          size={16}
        />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <Link to={`/item/${item.id}`}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        </Link>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className={`${
              isItemFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            } transition-colors`}
          />
        </button>
      </div>
      <Link to={`/item/${item.id}`}>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {item.title}
          </h3>
          {item.rating && (
            <div className="mt-1 flex items-center gap-1">
              <div className="flex">
                {renderRatingStars(item.rating)}
              </div>
              <span className="text-sm font-medium text-gray-600">
                ({item.ratingCount || 0})
              </span>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-4">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LuxuryItemCard;