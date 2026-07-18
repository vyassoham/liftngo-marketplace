'use client';

import { Clock, MapPin, Phone, Star, Package, ChevronDown, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface StorefrontHeroProps {
  store: {
    name: string;
    tagline: string;
    usp: string;
    description: string;
    logo: string;
    banner: string;
    accentColor: string;
    isOpen: boolean;
    rating: number | null;
    preparationLabel: string;
    minimumOrder: number;
    supportPhone: string;
    locality: string;
    city: string;
    businessCategory: string | null;
  };
}

export default function StorefrontHero({ store }: StorefrontHeroProps) {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const accent = store.accentColor || '#FF6B35';

  return (
    <div className="relative">
      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72 lg:h-80 bg-gradient-to-br from-gray-800 to-gray-900">
        {store.banner && !imgError ? (
          <Image
            src={store.banner}
            alt={`${store.name} banner`}
            fill
            priority
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient fallback banner */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}22 0%, ${accent}44 50%, ${accent}22 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20 select-none">
              🏪
            </div>
          </div>
        )}

        {/* Gradient overlay — bottom fade to white */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

        {/* Open/Closed ribbon */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${
              store.isOpen
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                store.isOpen ? 'bg-green-200 animate-pulse' : 'bg-red-200'
              }`}
            />
            {store.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* ── Info Card ──────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 sm:-mt-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">

            {/* Logo */}
            <div
              className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:h-28 sm:w-28"
              style={{ background: `${accent}18` }}
            >
              {store.logo && !logoError ? (
                <Image
                  src={store.logo}
                  alt={`${store.name} logo`}
                  fill
                  className="object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  🏪
                </div>
              )}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {store.name}
                </h1>
                {store.businessCategory && (
                  <span
                    className="mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    {store.businessCategory}
                  </span>
                )}
              </div>

              {store.tagline && (
                <p className="mt-1 text-sm font-medium text-gray-500 line-clamp-1">
                  {store.tagline}
                </p>
              )}

              {/* Stat pills */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {store.rating !== null && (
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">{store.rating}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{store.preparationLabel}</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                  <Package className="h-3.5 w-3.5 text-gray-500" />
                  <span>Min ₹{store.minimumOrder}</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>{store.locality}, {store.city}</span>
                </div>
              </div>

              {/* USP highlight */}
              {store.usp && (
                <div
                  className="mt-4 flex items-start gap-2 rounded-xl p-3"
                  style={{ background: `${accent}10`, borderLeft: `3px solid ${accent}` }}
                >
                  <BadgeCheck className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                  <p className="text-sm font-medium" style={{ color: `${accent}dd` }}>
                    {store.usp}
                  </p>
                </div>
              )}
            </div>

            {/* Action column */}
            <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
              {store.supportPhone && (
                <a
                  href={`tel:${store.supportPhone}`}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </a>
              )}
            </div>
          </div>

          {/* Liftngo delivery badge */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 border border-gray-100">
            <span className="text-lg">🚚</span>
            <span className="text-sm font-semibold text-gray-700">
              Delivery by <span className="text-orange-600">Liftngo</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
