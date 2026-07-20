'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Heart, MapPin, Search, UserRound } from 'lucide-react';
import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('@/components/marketplace/Cart'), { ssr: false });

interface LocationHeaderProps {
  locationName: string;
}

export default function LocationHeader({ locationName }: LocationHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = value.trim();
    if (normalized) params.set('q', normalized);
    else params.delete('q');
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateSearch(query);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-5">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black tracking-[-0.05em] text-orange-600">LIFTNGO</span>
            <span className="-mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-600">Marketplace</span>
          </Link>
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />
          <button type="button" className="hidden h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm sm:flex">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="truncate max-w-[150px]">{locationName}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-[480px] md:block">
          <label className="relative block">
            <button type="submit" aria-label="Search" className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-600">
              <Search className="h-5 w-5" />
            </button>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                updateSearch(event.target.value);
              }}
              placeholder={`Search in ${locationName}...`}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button type="button" aria-label="Favorites" className="grid h-10 w-10 place-items-center rounded-full text-slate-900 transition hover:bg-slate-50"><Heart className="h-5 w-5" /></button>
          <Cart />
          <Link href="/login" aria-label="Account" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-900"><UserRound className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 sm:hidden">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-orange-500" />
          <span>{locationName}</span>
        </div>
      </div>
    </header>
  );
}
