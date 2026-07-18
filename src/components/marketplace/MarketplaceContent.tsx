'use client';

import { useState } from 'react';
import MarketplaceFilters from './MarketplaceFilters';
import StoreGrid, { StoreCardData } from './StoreGrid';

interface MarketplaceContentProps {
  stores: StoreCardData[];
}

export default function MarketplaceContent({ stores }: MarketplaceContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  return (
    <>
      <MarketplaceFilters 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <StoreGrid stores={stores} selectedCategory={selectedCategory} />
    </>
  );
}
