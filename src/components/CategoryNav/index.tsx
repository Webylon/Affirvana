import React from 'react';
import { Category } from '../../types';
import { categoryConfig } from './config';
import CategoryButton from './CategoryButton';
import ScrollableContainer from './ScrollableContainer';

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="w-full pb-8">
      {/* Mobile View - Horizontal Scrollable */}
      <div className="lg:hidden">
        <ScrollableContainer>
          {categoryConfig.map(({ name, icon, description }) => (
            <div key={name} className="snap-start shrink-0">
              <CategoryButton
                name={name}
                icon={icon}
                description={description}
                isSelected={selectedCategory === name}
                onClick={() => onSelectCategory(selectedCategory === name ? null : name)}
                className="w-[280px]"
              />
            </div>
          ))}
        </ScrollableContainer>
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