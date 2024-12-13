import React, { useRef, useState } from 'react';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Category } from '../types';

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [visibleCategories, setVisibleCategories] = useState({ start: 0, end: 3 });

  const categories: { name: Category; icon: React.ReactNode; description: string }[] = [
    { name: 'Homes', icon: <Home size={24} />, description: 'Luxury Properties' },
    { name: 'Travel', icon: <Plane size={24} />, description: 'Exclusive Destinations' },
    { name: 'Cars', icon: <Car size={24} />, description: 'Premium Vehicles' },
    { name: 'Boats', icon: <Ship size={24} />, description: 'Luxury Yachts' },
    { name: 'Fashion', icon: <Shirt size={24} />, description: 'Designer Apparel' },
    { name: 'Jewelry', icon: <Diamond size={24} />, description: 'Fine Jewelry' },
    { name: 'Watches', icon: <Watch size={24} />, description: 'Luxury Timepieces' },
    { name: 'Gadgets', icon: <Smartphone size={24} />, description: 'High-end Tech' },
    { name: 'Art', icon: <Palette size={24} />, description: 'Fine Art & Collectibles' },
    { name: 'Experiences', icon: <Trophy size={24} />, description: 'Exclusive Events' }
  ];

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setShowLeftButton(scrollLeft > 10);

    const itemWidth = 128;
    const startIndex = Math.floor(scrollLeft / itemWidth);
    const visibleCount = Math.ceil(clientWidth / itemWidth);
    
    setVisibleCategories({
      start: startIndex,
      end: Math.min(startIndex + visibleCount, categories.length - 1)
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const itemWidth = 128; // Width of each category item
    const gap = 16; // Gap between items
    const visibleItems = Math.floor(container.clientWidth / (itemWidth + gap));
    const scrollAmount = (itemWidth + gap) * visibleItems;

    const targetScroll = direction === 'left'
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(
          container.scrollWidth - container.clientWidth,
          container.scrollLeft + scrollAmount
        );

    
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full px-4 pb-8 overflow-hidden">
      {/* Mobile View - Horizontal Scroll */}
      <div className="lg:hidden relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all ${
            showLeftButton 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-full pointer-events-none'
          }`}
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all ${
            showRightButton 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto scrollbar-hide px-2"
        >
          <div className="flex space-x-4 pb-4 min-w-min">
            {categories.map(({ name, icon, description }, index) => (
              <button
                key={name}
                onClick={() => onSelectCategory(selectedCategory === name ? null : name)}
                className={`flex-shrink-0 flex flex-col items-center p-4 rounded-xl transition-all w-32
                  ${selectedCategory === name 
                    ? 'bg-purple-50 border-2 border-purple-200 shadow-lg' 
                    : 'bg-white border-2 border-gray-100 hover:border-purple-100 hover:shadow-md'}
                  ${index >= visibleCategories.start && index <= visibleCategories.end
                    ? 'opacity-100 scale-100'
                    : 'opacity-75 scale-95'}`}
              >
                <div className={`p-3 rounded-lg mb-2 transition-colors
                  ${selectedCategory === name 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-50 text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                  {icon}
                </div>
                <span className="font-medium text-gray-900 text-sm">{name}</span>
                <span className="text-xs text-gray-500 mt-1 text-center line-clamp-1">{description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {categories.map(({ name, icon, description }) => (
          <button
            key={name}
            onClick={() => onSelectCategory(selectedCategory === name ? null : name)}
            className={`relative group flex flex-col items-center p-6 rounded-xl transition-all
              ${selectedCategory === name 
                ? 'bg-purple-50 border-2 border-purple-200 shadow-lg' 
                : 'bg-white border-2 border-gray-100 hover:border-purple-100 hover:shadow-md'}`}
          >
            <div className={`p-3 rounded-lg mb-2 transition-colors
              ${selectedCategory === name 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-50 text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
              {icon}
            </div>
            <span className="font-medium text-gray-900">{name}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;