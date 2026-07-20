'use client';

import { HeartHandshake, PackageCheck, TimerReset } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type {
  CategoryStat,
  LocationStore,
  MarketplaceTrustItem,
} from '@/lib/marketplace/location';
import LocationCategoryStrip from './LocationCategoryStrip';
import LocationStoreGrid from './LocationStoreGrid';

interface LocationContentProps {
  stores: LocationStore[];
  categories: CategoryStat[];
  locationName: string;
  sectionTitle: string;
  sectionSubtitle: string;
  allCategory: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  trustItems: MarketplaceTrustItem[];
}

const TRUST_ICON_BY_ID = {
  'safe-packaging': PackageCheck,
  'on-time-delivery': TimerReset,
  'local-favourites': HeartHandshake,
};

export default function LocationContent({
  stores,
  categories,
  locationName,
  sectionTitle,
  sectionSubtitle,
  allCategory,
  trustItems,
}: LocationContentProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');
  const searchQuery = useSearchParams().get('q') ?? '';

  return (
    <section
      id="stores"
      className="mx-auto my-8 w-[calc(100%-2rem)] max-w-[1600px] overflow-hidden rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,#fff_0%,#fff_62%,#fff8f5_100%)] shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]"
    >
      <LocationCategoryStrip
        categories={categories}
        allCategory={allCategory}
        selectedCategory={selectedCategorySlug}
        onCategoryChange={setSelectedCategorySlug}
        totalStoreCount={stores.length}
      />

      <LocationStoreGrid
        stores={stores}
        selectedCategorySlug={selectedCategorySlug}
        locationName={locationName}
        sectionTitle={sectionTitle}
        sectionSubtitle={sectionSubtitle}
        searchQuery={searchQuery}
      />

      {trustItems.length ? (
        <div className="border-t border-slate-100 bg-white/75 px-5 py-5 backdrop-blur-sm sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-semibold text-slate-500 sm:text-sm">
            {trustItems.map((item, index) => {
              const Icon = TRUST_ICON_BY_ID[item.id as keyof typeof TRUST_ICON_BY_ID] ?? PackageCheck;
              return (
                <div key={item.id} className="flex items-center gap-2">
                  {index > 0 ? <span className="mr-3 hidden text-slate-300 sm:inline">•</span> : null}
                  <Icon className="h-5 w-5 text-slate-400" />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
