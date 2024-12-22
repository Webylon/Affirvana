import React from 'react';
import { Category } from '../../types';

interface CategoryButtonProps {
  name: Category;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  className?: string;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  name,
  icon,
  description,
  isSelected,
  className = '',
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl transition-all ${className}
        ${isSelected 
          ? 'bg-purple-50 border-2 border-purple-200 shadow-lg' 
          : 'bg-white border-2 border-gray-100 hover:border-purple-100 hover:shadow-md'}`}
    >
      <div className={`p-3 rounded-lg mb-2 transition-colors
        ${isSelected 
          ? 'bg-purple-100 text-purple-600' 
          : 'bg-gray-50 text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
        {icon}
      </div>
      <span className="font-medium text-gray-900 text-sm">{name}</span>
      <span className="text-xs text-gray-500 mt-1 text-center line-clamp-1">{description}</span>
    </button>
  );
};

export default CategoryButton;