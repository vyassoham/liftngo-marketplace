'use client';

import { Clock, Star, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

interface StoreHeaderProps {
  store: {
    name: string;
    tagline: string;
    usp: string;
    description: string;
    logo: string;
    banner: string;
    thumbnail: string;
    accentColor: string;
    isOpen: boolean;
    rating: number;
    preparationTime: string;
    minimumOrderAmount: number;
  };
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50">
        {store.banner ? (
          <Image
            src={store.banner}
            alt={store.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-6xl">🍽️</div>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Store Info Card */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:-mt-20 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Logo and Name */}
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">
                    🏪
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {store.name}
                  </h1>
                  {store.isOpen ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Open
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                      Closed
                  </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-600">{store.tagline}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{store.preparationTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">₹{store.minimumOrderAmount}</span>
                    <span>min order</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:flex-col">
              <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Store</span>
                </div>
              </button>
              <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
              </button>
            </div>
          </div>

          {/* USP */}
          <div className="mt-4 rounded-lg bg-orange-50 p-3">
            <p className="text-sm font-medium text-orange-800">{store.usp}</p>
          </div>

          {/* Liftngo Badge */}
          <div className="mt-4 flex items-center justify-center rounded-lg bg-orange-100 py-2">
            <span className="text-sm font-semibold text-orange-700">
              🚚 Delivery by Liftngo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
