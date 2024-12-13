import React from 'react';
import { LuxuryItem } from '../types';
import LuxuryItemCard from './LuxuryItemCard';

interface ItemGridProps {
  items: LuxuryItem[];
  onAddToCart: (item: LuxuryItem) => void;
  onToggleFavorite: (itemId: string) => void;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({ 
  items, 
  onAddToCart,
  onToggleFavorite,
  loading 
}) => {
  if (items.length === 0 && !loading) {
    return (
      <div className="text-center text-gray-500 py-12">
        No items found. Try adjusting your search or category filters.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <LuxuryItemCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      )}
    </div>
  );
};

export default ItemGrid;