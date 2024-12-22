import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Star, StarHalf, ShoppingCart } from 'lucide-react';
import { LuxuryItem } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { generateItemDescription } from '../utils/descriptions';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<LuxuryItem | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [aiDescription, setAiDescription] = useState<string>('');

  useEffect(() => {
    const storedItem = localStorage.getItem(`item-${id}`);
    if (storedItem) {
      const parsedItem = JSON.parse(storedItem);
      setItem(parsedItem);
      setAiDescription(generateItemDescription(parsedItem.category, parsedItem.description));
    }
  }, [id]);

  if (!item) {
    return (
      <div className="p-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="fill-yellow-400 text-yellow-400"
          size={20}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="fill-yellow-400 text-yellow-400"
          size={20}
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="text-gray-300"
          size={20}
        />
      );
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-purple-600 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Browse
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={() => toggleFavorite(item)}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <Heart
                size={24}
                className={`${
                  isFavorite(item.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                } transition-colors`}
              />
            </button>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {item.title}
            </h1>

            {item.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderRatingStars(item.rating)}
                </div>
                <span className="text-gray-600">
                  ({item.ratingCount} ratings)
                </span>
              </div>
            )}

            <div className="text-3xl font-bold text-purple-600 mb-6">
              {formatPrice(item.price)}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{aiDescription}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Category</h2>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;