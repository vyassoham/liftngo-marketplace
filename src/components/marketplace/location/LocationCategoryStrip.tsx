'use client';

import { CategoryStat } from '@/lib/marketplace/location';

interface LocationCategoryStripProps {
  categories: CategoryStat[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  totalStoreCount: number;
}

export default function LocationCategoryStrip({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  totalStoreCount
}: LocationCategoryStripProps) {
  // If there are no categories with stores, don't show the strip
  if (!categories || categories.length === 0) return null;

  return (
    <div className="sticky top-16 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative flex items-center">
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide snap-x">
            
            <button
              onClick={() => onCategoryChange('all')}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
              <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {totalStoreCount}
              </span>
            </button>
            
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.slug)}
                  className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon_url ? (
                    <img src={category.icon_url} alt="" className="h-4 w-4 object-contain" />
                  ) : null}
                  <span>{category.name}</span>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.store_count}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Fading edge to indicate horizontal scroll on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent sm:hidden" />
        </div>
      </div>
    </div>
  );
}
