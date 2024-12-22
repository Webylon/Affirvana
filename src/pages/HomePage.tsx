import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryNav from '../components/CategoryNav/index';
import ItemGrid from '../components/ItemGrid';
import LoadingOverlay from '../components/LoadingOverlay';
import { fetchPixabayImages } from '../services/api/pixabayApi';
import { LuxuryItem, Category } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useDebounce } from '../hooks/useDebounce';
import { useLoadingDelay } from '../hooks/useLoadingDelay';

const ITEMS_PER_PAGE = 50;

const HomePage: React.FC = () => {
  const [items, setItems] = useState<LuxuryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('luxury lifestyle');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toggleFavorite } = useFavorites();

  const debouncedSearch = useDebounce(searchQuery, 800);
  const showLoading = useLoadingDelay(loading);

  const loadItems = async (query: string, pageNum: number, category: Category | null, reset: boolean = false) => {
    try {
      setLoading(true);
      const searchTerm = category ? `luxury ${category.toLowerCase()}` : query;
      const newItems = await fetchPixabayImages(searchTerm, pageNum, ITEMS_PER_PAGE);
      
      if (newItems.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setItems(prev => reset ? newItems : [...prev, ...newItems]);
    } catch (error) {
      console.error('Error loading items:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      setHasMore(true);
      loadItems(debouncedSearch, 1, selectedCategory, true);
    }
  }, [debouncedSearch, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadItems(searchQuery, nextPage, selectedCategory);
    }
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={showLoading} 
        message="Finding luxury items..."
      />
      
      <div className="container mx-auto py-6 px-4">
        <SearchBar onSearch={handleSearch} />
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <ItemGrid
          items={items}
          onToggleFavorite={toggleFavorite}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
    </>
  );
};

export default HomePage;