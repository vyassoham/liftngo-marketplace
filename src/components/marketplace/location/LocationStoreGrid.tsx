'use client';

import { Star, Clock, MapPin, Truck, Tag, Store as StoreIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { LocationStore, isStoreCurrentlyOpen, formatPrepTime, formatMinorAmount } from '@/lib/marketplace/location';

interface LocationStoreGridProps {
  stores: LocationStore[];
  selectedCategorySlug: string;
  locationName: string;
}

function StoreCard({ store }: { store: LocationStore }) {
  const [imgError, setImgError] = useState(false);
  const open = isStoreCurrentlyOpen(store);
  const accent = store.accent_colour || '#FF6B35';
  const hasOffers = Array.isArray(store.offers) && store.offers.length > 0;
  const firstOffer = hasOffers ? (store.offers[0] as { title?: string })?.title : null;
  const prepLabel = formatPrepTime(store.default_preparation_minutes || 20);

  return (
    <Link
      href={`/store/${store.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-xl hover:ring-gray-200 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ ['--tw-ring-color' as string]: accent }}
      data-testid="store-card"
    >
      {/* Banner / Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {store.thumbnail_url && !imgError ? (
          <Image
            src={store.thumbnail_url}
            alt={store.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}15 0%, ${accent}30 100%)`,
            }}
          >
            <div className="flex h-full items-center justify-center text-gray-400 opacity-50">
              <StoreIcon className="h-16 w-16" />
            </div>
          </div>
        )}

        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

        {/* Badges container - Top */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {store.is_featured && (
            <div className="flex items-center gap-1 rounded-md bg-amber-500/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              Featured
            </div>
          )}
          {firstOffer && (
            <div className="flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-gray-900 uppercase tracking-wider shadow-sm">
              <Tag className="h-3 w-3" style={{ color: accent }} />
              <span className="truncate max-w-[120px]">{firstOffer}</span>
            </div>
          )}
        </div>

        {/* Open/Closed Badge */}
        <div className="absolute top-3 right-3 rounded-md bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold shadow-sm">
          <span className={open ? 'text-emerald-600' : 'text-rose-600 flex items-center gap-1'}>
            {open ? 'Open' : (
              <>
                <Clock className="h-3 w-3" /> Closed
              </>
            )}
          </span>
        </div>

        {/* Logo */}
        {store.logo_url && (
          <div className="absolute -bottom-4 right-4 h-14 w-14 overflow-hidden rounded-xl border-[3px] border-white shadow-md bg-white z-10">
            <Image
              src={store.logo_url}
              alt={`${store.name} logo`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Store Info */}
      <div className="flex flex-1 flex-col p-5 pt-6">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 transition-colors group-hover:text-gray-700 pr-12">
          {store.name}
        </h3>
        
        {store.usp ? (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-snug min-h-[40px]">
            {store.usp}
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-snug min-h-[40px]">
            {store.description || 'Local business serving the community.'}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{prepLabel}</span>
          </div>
          {store.minimum_order_minor > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <span className="text-gray-400">Min:</span>
              <span>{formatMinorAmount(store.minimum_order_minor)}</span>
            </div>
          )}
        </div>

        {/* Footer line */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          {store.business_categories?.name ? (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
              style={{ background: `${accent}15`, color: accent }}
            >
              {store.business_categories.name}
            </span>
          ) : <div />}
          
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
            <Truck className="h-3.5 w-3.5" />
            <span>Liftngo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ locationName, categoryName }: { locationName: string, categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6 ring-8 ring-gray-50">
        <StoreIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No {categoryName !== 'all' ? categoryName : ''} stores found
      </h3>
      <p className="max-w-md text-sm text-gray-500">
        We're rapidly expanding our marketplace in {locationName}. 
        Check back soon as we add more local favorites.
      </p>
      <div className="mt-8 flex gap-3">
        <Link 
          href="/contact#business-enquiry"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
        >
          Recommend a Store
        </Link>
      </div>
    </div>
  );
}

// ─── Main Grid Component ──────────────────────────────────────────────────────

export default function LocationStoreGrid({
  stores,
  selectedCategorySlug,
  locationName,
}: LocationStoreGridProps) {
  
  // Filter stores based on client-side state
  const filteredStores = selectedCategorySlug === 'all'
    ? stores
    : stores.filter((s) => s.business_categories?.slug === selectedCategorySlug);

  return (
    <section className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Dynamic header reflecting filter state */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
              {selectedCategorySlug === 'all' 
                ? 'All Businesses' 
                : `${selectedCategorySlug.charAt(0).toUpperCase() + selectedCategorySlug.slice(1).replace(/-/g, ' ')}`}
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} available for delivery
            </p>
          </div>
        </div>

        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <EmptyState 
            locationName={locationName} 
            categoryName={selectedCategorySlug.replace(/-/g, ' ')} 
          />
        )}
      </div>
    </section>
  );
}
