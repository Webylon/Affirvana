import React, { useRef, useState, useEffect } from 'react';
import {
  Home,
  Plane,
  Car,
  Ship,
  Smartphone,
  Shirt,
  Diamond,
  Watch,
  Palette,
  Trophy,
} from 'lucide-react';
import { Category } from '../../types';
import CategoryButton from './CategoryButton';
import ScrollControls from './ScrollControls';
import { categoryApi } from '../../lib/api';
import { Database } from '../../types/supabase';

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

type CategoryData = Database['public']['Tables']['categories']['Row'];

const iconMap: { [key: string]: React.FC<{ size?: number }> } = {
  Home,
  Plane,
  Car,
  Ship,
  Smartphone,
  Shirt,
  Diamond,
  Watch,
  Palette,
  Trophy,
};

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryApi.getAll();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const firstCategoryButton = container.querySelector('.category-button') as HTMLElement;
    const scrollAmount = firstCategoryButton ? firstCategoryButton.offsetWidth : container.clientWidth * 0.75;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => requestAnimationFrame(updateScrollButtons);
      
      updateScrollButtons();
      
      container.addEventListener('scroll', handleScroll, { passive: true });
      const handleResize = () => {
        updateScrollButtons();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 pb-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 pb-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-8">
      {/* Mobile View - Horizontal Scroll */}
      <div className="lg:hidden relative">
        <ScrollControls
          onScrollLeft={() => scroll('left')}
          onScrollRight={() => scroll('right')}
          showLeftButton={scrollState.canScrollLeft}
          showRightButton={scrollState.canScrollRight}
        />

        {/* Scrollable Container */}
        <div 
          ref={containerRef}
          className="overflow-x-auto scrollbar-hide px-2 -mx-2 scroll-smooth flex-no-wrap whitespace-nowrap"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="inline-flex gap-4 pb-4 px-2">
            {categories.map(({ id, name, icon, description }) => {
              const IconComponent = iconMap[icon];
              return (
                <CategoryButton
                  key={id}
                  name={name as Category}
                  icon={<IconComponent size={24} />}
                  description={description}
                  isSelected={selectedCategory === name}
                  onClick={() => onSelectCategory(selectedCategory === name ? null : name as Category)}
                  className="category-button flex-shrink-0"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {categories.map(({ id, name, icon, description }) => {
          const IconComponent = iconMap[icon];
          return (
            <CategoryButton
              key={id}
              name={name as Category}
              icon={<IconComponent size={24} />}
              description={description}
              isSelected={selectedCategory === name}
              onClick={() => onSelectCategory(selectedCategory === name ? null : name as Category)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
