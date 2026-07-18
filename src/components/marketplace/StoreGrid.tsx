'use client';

import { Star, Clock, MapPin, Truck, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface StoreCardData {
  id: string;
  slug: string;
  name: string;
  usp: string | null;
  thumbnail_url: string | null;
  logo_url: string | null;
  accent_colour: string | null;
  status: string;
  temporarily_closed_until: string | null;
  default_preparation_minutes: number;
  minimum_order_minor: number;
  is_featured: boolean;
  offers: unknown[];
  business_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  localities: {
    id: string;
    name: string;
  } | null;
}

interface StoreGridProps {
  stores: StoreCardData[];
  selectedCategory?: string;
  emptyMessage?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOpen(store: StoreCardData): boolean {
  if (store.status === 'PAUSED') return false;
  if (store.temporarily_closed_until) {
    return new Date(store.temporarily_closed_until) < new Date();
  }
  return store.status === 'ACTIVE';
}

function getPreparationLabel(mins: number): string {
  if (mins <= 15) return `${mins} min`;
  if (mins <= 30) return `${mins - 5}–${mins} min`;
  return `${mins}–${mins + 10} min`;
}

// ─── Store Card ───────────────────────────────────────────────────────────────

function StoreCard({ store }: { store: StoreCardData }) {
  const [imgError, setImgError] = useState(false);
  const open = isOpen(store);
  const accent = store.accent_colour || '#FF6B35';
  const hasOffers = Array.isArray(store.offers) && store.offers.length > 0;
  const firstOffer = hasOffers ? (store.offers[0] as { title?: string })?.title : null;
  const prepLabel = getPreparationLabel(store.default_preparation_minutes || 20);

  return (
    <Link
      href={`/store/${store.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ ['--tw-ring-color' as string]: accent }}
    >
      {/* Banner / Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {store.thumbnail_url && !imgError ? (
          <Image
            src={store.thumbnail_url}
            alt={store.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient fallback */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}22 0%, ${accent}55 100%)`,
            }}
          >
            <div className="flex h-full items-center justify-center text-6xl opacity-30 select-none">
              🏪
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Offer badge */}
        {firstOffer && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-900 shadow-lg">
            <Tag className="h-3 w-3" style={{ color: accent }} />
            {firstOffer}
          </div>
        )}

        {/* Featured badge */}
        {store.is_featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Open/Closed */}
        <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold shadow-lg">
          <span className={open ? 'text-green-600' : 'text-red-500'}>
            {open ? '● Open' : '● Closed'}
          </span>
        </div>

        {/* Logo overlay */}
        {store.logo_url && (
          <div className="absolute bottom-3 left-3 h-12 w-12 overflow-hidden rounded-xl border-2 border-white shadow-md bg-white">
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 transition-colors group-hover:text-inherit">
          {store.name}
        </h3>
        {store.usp && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{store.usp}</p>
        )}

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{prepLabel}</span>
          </div>
          {store.localities?.name && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{store.localities.name}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          {store.business_categories?.name && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: `${accent}15`, color: accent }}
            >
              {store.business_categories.name}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 ml-auto">
            <Truck className="h-3.5 w-3.5" />
            <span>Liftngo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Grid ─────────────────────────────────────────────────────────────────

export default function StoreGrid({
  stores,
  selectedCategory = 'all',
  emptyMessage = 'No stores found in this category.',
}: StoreGridProps) {
  // Client-side filter by category slug
  const filtered =
    selectedCategory === 'all'
      ? stores
      : stores.filter(
          (s) =>
            s.business_categories?.slug === selectedCategory ||
            s.business_categories?.name.toLowerCase() === selectedCategory
        );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {selectedCategory === 'all' ? 'All Businesses' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Stores`}
        </h2>
        <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto">
          {filtered.length > 0
            ? `${filtered.length} store${filtered.length !== 1 ? 's' : ''} available • Delivered by Liftngo`
            : emptyMessage}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-lg font-bold text-gray-700">No stores here yet</h3>
          <p className="mt-2 text-sm text-gray-400">
            We're onboarding businesses in this category. Check back soon!
          </p>
        </div>
      )}
    </section>
  );
}
