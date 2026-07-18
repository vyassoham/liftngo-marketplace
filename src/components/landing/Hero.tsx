'use client';

import { useState, useCallback, memo } from 'react';
import { useMenu, useLandingPickup } from './PageWrapper';
import HeroPickupAutocomplete from './HeroPickupAutocomplete';
import { getLandingPickupLocation, setLandingPickupLocation, setPostLoginPath } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { trackBookNowClick } from '@/lib/analytics';
import { Truck, MapPin, Search } from 'lucide-react';

export type HeroProps = {
 heroTitleLevel?: 'h1' | 'h2';
 pickupBookingSource?: 'homepage' | 'landing';
};

function Hero({ heroTitleLevel = 'h1', pickupBookingSource }: HeroProps) {
 const { openLogin } = useMenu();
 const { pickupDraft: location, setPickupDraft: setLocation } = useLandingPickup();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');
 const [activeTab, setActiveTab] = useState<'book' | 'track'>('book');

 const handleUseCurrentLocation = useCallback(async () => {
  setError('');
  setIsLoading(true);
  if (!navigator.geolocation) {
   setError('Geolocation is not supported by your browser');
   setIsLoading(false);
   return;
  }
  navigator.geolocation.getCurrentPosition(
   async (position) => {
    const { latitude, longitude } = position.coords;
    const coordsFallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    let resolved = coordsFallback;
    try {
     const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
     );
     const data = await res.json();
     if (data.display_name) {
      const parts = data.display_name.split(',');
      resolved = parts.slice(0, 3).join(',').trim();
     }
    } catch {
     resolved = coordsFallback;
    }
    setLandingPickupLocation(resolved);
    setLocation(resolved);
    setIsLoading(false);
   },
   (err) => {
    setIsLoading(false);
    setError(
     err.code === err.PERMISSION_DENIED
      ? 'Location permission denied. Enable it in browser settings.'
      : 'Location unavailable.'
    );
   },
   { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
 }, [setLocation]);

 const handleContinue = useCallback(() => {
  trackBookNowClick('hero_pickup_continue');
  const fromInput = location.trim();
  const fromDraft = getLandingPickupLocation()?.trim() ?? '';
  const merged = fromInput || fromDraft;
  setLandingPickupLocation(merged || null);
  setPostLoginPath(ROUTES.PICKUP_LOCATION);
  openLogin();
 }, [location, openLogin]);

 const TitleTag = heroTitleLevel === 'h2' ? 'h2' : 'h1';

 return (
  <section className="relative overflow-hidden bg-[var(--color-primary)] pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
   {/* Subtle grid pattern for tech-forward feel */}
   <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
    <div className="absolute inset-0" style={{
     backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
     backgroundSize: '40px 40px',
    }} />
   </div>

   <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
     {/* Left Content */}
     <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0">
      <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-300 backdrop-blur-sm">
       <span className="inline-block h-2 w-2 rounded-full bg-[var(--whatsapp-green)]" aria-hidden />
       Serving Delhi NCR & Rajasthan
      </div>

      <TitleTag className="text-balance text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-white max-w-2xl mx-auto lg:mx-0">
       Instant goods delivery <span className="text-gray-400 font-medium">for your business.</span>
      </TitleTag>

      <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base text-gray-300 sm:text-lg sm:leading-relaxed">
       The digital freight engine for B2B logistics. Book 2W, 3W, or mini-trucks with transparent pricing, verified fleets, and live telemetry.
      </p>

      {/* Stats row integrated into text block for desktop */}
      <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 border-t border-white/10 pt-8">
       <div>
        <p className="text-2xl font-bold text-white">3</p>
        <p className="mt-1 text-xs text-gray-400 font-medium uppercase tracking-wide">Vehicle Classes</p>
       </div>
       <div>
        <p className="text-2xl font-bold text-white">5 min</p>
        <p className="mt-1 text-xs text-gray-400 font-medium uppercase tracking-wide">Avg Match Time</p>
       </div>
       <div>
        <p className="text-2xl font-bold text-white">₹0</p>
        <p className="mt-1 text-xs text-gray-400 font-medium uppercase tracking-wide">Hidden Fees</p>
       </div>
      </div>
     </div>

     {/* Right Content - Utility Engine */}
     <div className="w-full max-w-md mx-auto lg:mx-0 shrink-0">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
       {/* Dual Utility Tabs */}
       <div className="flex border-b border-gray-100 bg-gray-50">
        <button
         type="button"
         onClick={() => setActiveTab('book')}
         className={`flex-1 py-4 px-4 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'book' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
        >
         <Truck className="w-4 h-4" />
         Book Delivery
        </button>
        <button
         type="button"
         onClick={() => setActiveTab('track')}
         className={`flex-1 py-4 px-4 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'track' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
        >
         <Search className="w-4 h-4" />
         Track Shipment
        </button>
       </div>

       <div className="p-6">
        {activeTab === 'book' ? (
         <div className="animate-[fade-in_200ms_ease-out]">
          <label className="block text-sm font-medium text-gray-900 mb-2">
           Pickup Origin
          </label>
          <div className="flex min-h-[52px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 shadow-sm transition-colors focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
           <MapPin className="w-5 h-5 shrink-0 text-gray-400" />
           <HeroPickupAutocomplete
            bookingSource={pickupBookingSource}
            value={location}
            disabled={isLoading}
            onChange={(v) => {
             setLocation(v);
             if (!v.trim()) setLandingPickupLocation(null);
            }}
            onPickSuggestion={(desc) => {
             setLocation(desc);
             setLandingPickupLocation(desc);
            }}
           />
          </div>

          <button
           type="button"
           onClick={handleContinue}
           disabled={isLoading}
           className="mt-4 w-full flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] text-white font-medium transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
           Get Quote & Book
           <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
           </svg>
          </button>

          <div className="mt-4 flex items-center justify-between">
           <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-50"
           >
            {isLoading ? (
             <svg className="h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
             </svg>
            ) : (
             <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
            )}
            {isLoading ? 'Locating…' : 'Use current location'}
           </button>
           
           <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2 py-0.5 rounded-sm">
            First Delivery Free
           </span>
          </div>
          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
         </div>
        ) : (
         <div className="animate-[fade-in_200ms_ease-out]">
          <label className="block text-sm font-medium text-gray-900 mb-2">
           Tracking Number
          </label>
          <div className="flex min-h-[52px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 shadow-sm transition-colors focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
           <Search className="w-5 h-5 shrink-0 text-gray-400" />
           <input 
            type="text" 
            placeholder="e.g. LIFT-12345678" 
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 min-h-full border-none p-0 focus:ring-0"
           />
          </div>
          <button
           type="button"
           onClick={() => alert("Tracking feature coming soon.")}
           className="mt-4 w-full flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] text-white font-medium transition-colors hover:bg-[var(--color-primary-hover)]"
          >
           Track Shipment
          </button>
          <p className="mt-4 text-xs text-gray-500 text-center">
           Enter your 12-digit tracking ID to see live telemetry.
          </p>
         </div>
        )}
       </div>
      </div>
      
      <div id="landing-hero-pickup-end-sentinel" className="pointer-events-none mx-auto h-px w-full shrink-0 mt-4" aria-hidden />
     </div>
    </div>
   </div>
  </section>
 );
}

export default memo(Hero);
