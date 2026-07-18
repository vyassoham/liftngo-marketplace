'use client';

import { useState } from 'react';
import LocationCategoryStrip from './LocationCategoryStrip';
import LocationStoreGrid from './LocationStoreGrid';
import type { LocationStore, CategoryStat } from '@/lib/marketplace/location';

interface LocationContentProps {
  stores: LocationStore[];
  categories: CategoryStat[];
  locationName: string;
}

export default function LocationContent({ stores, categories, locationName }: LocationContentProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  
  return (
    <div className="flex flex-col min-h-[50vh]">
      <LocationCategoryStrip 
        categories={categories}
        selectedCategory={selectedCategorySlug}
        onCategoryChange={setSelectedCategorySlug}
        totalStoreCount={stores.length}
      />
      
      <LocationStoreGrid 
        stores={stores}
        selectedCategorySlug={selectedCategorySlug}
        locationName={locationName}
      />
    </div>
  );
}
