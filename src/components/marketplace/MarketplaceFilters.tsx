'use client';

import { BUSINESS_CATEGORIES } from '@/lib/marketplace/constants';

interface MarketplaceFiltersProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function MarketplaceFilters({ selectedCategory, onCategoryChange }: MarketplaceFiltersProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => onCategoryChange('all')}
            className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {BUSINESS_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
