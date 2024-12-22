import React from 'react';
import { Category } from '../../types';
import { categoryConfig } from './config';
import CategoryButton from './CategoryButton';

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="w-full pb-8">
      {/* Mobile View - Vertical Stack */}
      <div className="lg:hidden space-y-3 px-4">
        {categoryConfig.map(({ name, icon, description }) => (
          <CategoryButton
            key={name}
            name={name}
            icon={icon}
            description={description}
            isSelected={selectedCategory === name}
            onClick={() => onSelectCategory(selectedCategory === name ? null : name)}
            className="w-full"
          />
        ))}
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:grid grid-cols-5 gap-4 px-4">
        {categoryConfig.map(({ name, icon, description }) => (
          <CategoryButton
            key={name}
            name={name}
            icon={icon}
            description={description}
            isSelected={selectedCategory === name}
            onClick={() => onSelectCategory(selectedCategory === name ? null : name)}
          />
        ))}
      </div>
    </div>
  );
}