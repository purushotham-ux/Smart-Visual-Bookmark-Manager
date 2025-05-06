import React from 'react';
import { Category } from '../types/User';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="space-y-1.5">
      <div 
        className={`px-3 py-2.5 rounded-md cursor-pointer flex items-center transition-colors duration-200 ${
          selectedCategory === 'all' 
            ? 'bg-purple-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        onClick={() => onCategoryChange('all')}
      >
        <span className="mr-3 text-lg">🏠</span>
        <span className="font-medium">All Categories</span>
      </div>
      
      {categories.map((category) => (
        <div 
          key={category.id}
          className={`px-3 py-2.5 rounded-md cursor-pointer flex items-center transition-colors duration-200 ${
            selectedCategory === category.id 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="mr-3 text-lg">{category.icon || '📁'}</span>
          <span className="font-medium">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter; 