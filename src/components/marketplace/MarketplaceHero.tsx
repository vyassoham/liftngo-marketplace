'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';

export default function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=600&fit=crop"
          alt="Marketplace background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Malviya Nagar Businesses
          </h1>
          <p className="mt-3 text-base text-white/90 sm:text-lg lg:text-xl">
            Discover 50+ local businesses in Jaipur. Food, fashion, jewellery, and more - all delivered by Liftngo.
          </p>
          
          <div className="mt-6 flex justify-center sm:mt-8">
            <div className="relative w-full max-w-2xl px-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search for stores, products, or categories..."
                className="block w-full rounded-full border-0 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-lg ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 text-sm sm:py-4 sm:pl-12 sm:text-base"
                aria-label="Search marketplace"
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:mt-6 sm:gap-2 sm:text-sm">
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 font-medium text-white border border-white/30 sm:px-4 sm:py-2">
              🍔 Food
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 font-medium text-white border border-white/30 sm:px-4 sm:py-2">
              👔 Clothing
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 font-medium text-white border border-white/30 sm:px-4 sm:py-2">
              💎 Jewellery
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 font-medium text-white border border-white/30 sm:px-4 sm:py-2">
              ☕ Cafés
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 font-medium text-white border border-white/30 sm:px-4 sm:py-2">
              🛒 Grocery
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
