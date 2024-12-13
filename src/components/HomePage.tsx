import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryNav from './CategoryNav';
import ItemGrid from './ItemGrid';
import LoadingOverlay from './LoadingOverlay';
import TestSupabase from './TestSupabase';
import { LuxuryItem, Category } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useDebounce } from '../hooks/useDebounce';
import { useLoadingDelay } from '../hooks/useLoadingDelay';
import { luxuryItemApi } from '../lib/api';
import { Database } from '../types/supabase';

const ITEMS_PER_PAGE = 12;

type DbLuxuryItem = Database['public']['Tables']['luxury_items']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'];
};

const mapDbItemToLuxuryItem = (dbItem: DbLuxuryItem): LuxuryItem => ({
  id: dbItem.id,
  title: dbItem.title,
  price: dbItem.price,
  image: dbItem.image,
  category: dbItem.categories.name as Category,
  description: dbItem.description,
  rating: dbItem.rating || undefined,
  ratingCount: dbItem.rating_count || undefined,
});

const HomePage: React.FC = () => {
  const [items, setItems] = useState<LuxuryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toggleFavorite } = useFavorites();

  const debouncedSearch = useDebounce(searchQuery, 800);
  const showLoading = useLoadingDelay(loading);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: DbLuxuryItem[];
      
      if (selectedCategory) {
        // Get items by category
        data = await luxuryItemApi.getByCategory(selectedCategory);
      } else if (debouncedSearch) {
        // TODO: Implement full-text search in Supabase
        data = await luxuryItemApi.getAll();
        // Client-side filtering for now
        data = data.filter(item => 
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      } else {
        // Get all items
        data = await luxuryItemApi.getAll();
      }

      setItems(data.map(mapDbItemToLuxuryItem));
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load luxury items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [debouncedSearch, selectedCategory]);

  const handleAddToCart = (item: LuxuryItem) => {
    // TODO: Implement cart functionality with Supabase
    console.log('Add to cart:', item);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search luxury items..."
      />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <TestSupabase />

      {showLoading ? (
        <LoadingOverlay />
      ) : (
        <ItemGrid
          items={items}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          hasMore={false} // Pagination handled by Supabase
          loading={loading}
          onLoadMore={() => {}} // Pagination handled by Supabase
        />
      )}
    </div>
  );
};

export default HomePage;