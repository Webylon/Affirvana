import React from 'react';
import { LuxuryItem } from '../types';
import LuxuryItemCard from './LuxuryItemCard';
import { useInView } from 'react-intersection-observer';

interface ItemGridProps {
  items: LuxuryItem[];
  onAddToCart: (item: LuxuryItem) => void;
  onToggleFavorite: (itemId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

const ItemGrid: React.FC<ItemGridProps> = ({ 
  items, 
  onAddToCart,
  onToggleFavorite,
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !loading) {
        onLoadMore();
      }
    },
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <LuxuryItemCard
            key={`${item.id}-${index}`}
            item={item}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      
      <div ref={ref} className="flex justify-center py-8">
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        ) : hasMore ? (
          <button
            onClick={onLoadMore}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Show More
          </button>
        ) : items.length > 0 ? (
          <p className="text-gray-500">No more items to load</p>
        ) : null}
      </div>
    </div>
  );
};

export default ItemGrid;