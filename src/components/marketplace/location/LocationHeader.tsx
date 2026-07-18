'use client';

import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('@/components/marketplace/Cart'), { ssr: false });

interface LocationHeaderProps {
  locationName: string;
}

export default function LocationHeader({ locationName }: LocationHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Location */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black text-orange-600 tracking-tight">LIFTNGO</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest -mt-1">Marketplace</span>
          </Link>
          
          <div className="hidden h-6 w-px bg-gray-300 sm:block" />
          
          <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="truncate max-w-[150px]">{locationName}</span>
          </div>
        </div>

        {/* Search Bar - Visual only for now, can be wired up later */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search in ${locationName}...`}
              className="block w-full rounded-full border-0 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 transition-all"
            />
          </div>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-4">
          <Cart />
        </div>
      </div>
      
      {/* Mobile Location Strip */}
      <div className="sm:hidden border-t border-gray-100 bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-orange-500" />
          <span>Browsing {locationName}</span>
        </div>
      </div>
    </header>
  );
}
