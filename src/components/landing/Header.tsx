'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMenu, useLandingPickup } from './PageWrapper';
import HeroPickupAutocomplete from './HeroPickupAutocomplete';
import { SITE_NAME, LOGO_PATH } from '@/lib/site';
import { getAuthToken, getLandingPickupLocation, setLandingPickupLocation, setPostLoginPath } from '@/lib/storage';
import TrackedLink from '@/components/TrackedLink';
import { trackEvent, trackBookNowClick } from '@/lib/analytics';
import { ROUTES } from '@/lib/constants';

const HEADER_BAR_HEIGHT = 64;
const HEADER_TOP_GAP = 16;
const HEADER_TOTAL_HEIGHT = HEADER_TOP_GAP + HEADER_BAR_HEIGHT;

const DESKTOP_NAV_LINKS: { label: string; href: string; trackAs?: 'book_now_click' }[] = [
 { label: 'Book Delivery', href: ROUTES.BOOK_DELIVERY, trackAs: 'book_now_click' },
 { label: 'Services', href: '/services' },
 { label: 'Plans', href: '/plans' },
 { label: 'B2B', href: ROUTES.B2B_TRANSPORT },
 { label: 'About', href: '/about' },
 { label: 'Contact', href: ROUTES.CONTACT },
];

const navLinkClass =
 'rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-100/60';

const SENTINEL_ID = 'landing-hero-pickup-end-sentinel';
const SENTINEL_MOUNT_MAX_FRAMES = 90;

export default function Header() {
 const pathname = usePathname();
 const isHome = pathname === '/';
 const { openMenu, openLogin } = useMenu();
 const { pickupDraft, setPickupDraft } = useLandingPickup();
 const [hasAuthToken, setHasAuthToken] = useState(false);
 const [compactPickup, setCompactPickup] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
  setHasAuthToken(Boolean(getAuthToken()));
 }, []);

 /* Track scroll for subtle header shadow */
 useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
 }, []);

 useEffect(() => {
  if (!isHome) {
   setCompactPickup(false);
   return;
  }

  setCompactPickup(false);

  let cancelled = false;
  let observer: IntersectionObserver | null = null;
  let frames = 0;
  let sentinelOutOfView = false;

  const handleScroll = () => {
   if (cancelled) return;
   if (window.scrollY > 100 && sentinelOutOfView) {
    setCompactPickup(true);
   } else if (window.scrollY <= 50) {
    setCompactPickup(false);
   }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  const tryObserve = () => {
   if (cancelled) return;
   const el = document.getElementById(SENTINEL_ID);
   if (!el) {
    frames += 1;
    if (frames < SENTINEL_MOUNT_MAX_FRAMES) {
     requestAnimationFrame(tryObserve);
    }
    return;
   }
   observer = new IntersectionObserver(
    ([entry]) => {
     if (!cancelled) {
      sentinelOutOfView = !entry.isIntersecting;
      if (sentinelOutOfView && window.scrollY > 100) {
       setCompactPickup(true);
      } else if (entry.isIntersecting) {
       setCompactPickup(false);
      }
     }
    },
    { root: null, threshold: 0, rootMargin: '0px' }
   );
   observer.observe(el);
  };

  tryObserve();

  return () => {
   cancelled = true;
   observer?.disconnect();
   window.removeEventListener('scroll', handleScroll);
  };
 }, [isHome]);

 const hideLoginForStickyPickup = isHome && compactPickup;

 const handleHeaderPickupContinue = () => {
  trackBookNowClick('header_pickup_continue');
  const merged = pickupDraft.trim() || getLandingPickupLocation()?.trim() || '';
  setLandingPickupLocation(merged || null);
  setPostLoginPath(ROUTES.PICKUP_LOCATION);
  openLogin();
 };

 return (
  <>
   <div style={{ height: HEADER_TOTAL_HEIGHT }} aria-hidden />

   <header
    className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 pointer-events-none"
    style={{ paddingBottom: 0 }}
   >
    <div
     className={`liftngo-header-glass pointer-events-auto mx-auto flex h-14 min-w-0 max-w-6xl items-center justify-between gap-2 rounded-2xl py-1.5 pe-2 sm:h-[3.5rem] sm:gap-3 sm:pe-3 md:pe-4 transition-shadow duration-200 ${
      scrolled ? 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''
     } ${hideLoginForStickyPickup ? 'ps-2 sm:ps-3' : 'ps-3 sm:ps-4'}`}
    >
     {/* Logo */}
     {!hideLoginForStickyPickup && (
      <Link
       href="/"
       className="inline-flex shrink-0 items-center"
       aria-label={`${SITE_NAME} home`}
      >
       <Image
        src={LOGO_PATH}
        alt={SITE_NAME}
        width={188}
        height={54}
        className="h-7 w-auto max-w-[min(48vw,180px)] object-contain object-left sm:h-8"
        priority
       />
      </Link>
     )}

     {/* Compact pickup (shows on scroll past hero) */}
     {hideLoginForStickyPickup && (
      <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
       <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 shadow-sm sm:min-h-11 sm:px-2.5">
        <span className="flex shrink-0 items-center ps-1 text-gray-400" aria-hidden>
         <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
         </svg>
        </span>
        <HeroPickupAutocomplete
         bookingSource="landing"
         value={pickupDraft}
         onChange={setPickupDraft}
         onPickSuggestion={(desc) => {
          setPickupDraft(desc);
          setLandingPickupLocation(desc);
         }}
        />
        <button
         type="button"
         onClick={handleHeaderPickupContinue}
         className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
         aria-label="Continue to book"
        >
         <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
         </svg>
        </button>
       </div>
      </div>
     )}

     {/* Desktop nav */}
     <nav
      className={`mx-2 hidden min-w-0 flex-1 items-center justify-end gap-1 lg:flex ${hideLoginForStickyPickup ? 'lg:hidden' : ''}`}
      aria-label="Main"
     >
      {DESKTOP_NAV_LINKS.map((item) =>
       item.trackAs ? (
        <TrackedLink
         key={item.href}
         href={item.href}
         trackAs={item.trackAs}
         trackSource="header_nav"
         className={navLinkClass}
        >
         {item.label}
        </TrackedLink>
       ) : (
        <Link key={item.href} href={item.href} className={navLinkClass}>
         {item.label}
        </Link>
       ),
      )}
     </nav>

     {/* Right controls */}
     <div className="flex shrink-0 items-center gap-2">
      {!hasAuthToken && !hideLoginForStickyPickup && (
       <button
        type="button"
        onClick={() => {
         trackEvent('login_click', { source: 'header' });
         openLogin();
        }}
        className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] sm:px-5 sm:py-2.5"
       >
        Login
       </button>
      )}
      <button
       type="button"
       onClick={openMenu}
       className="grid h-10 w-10 place-items-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
       aria-label="Open menu"
      >
       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
       </svg>
      </button>
     </div>
    </div>
   </header>
  </>
 );
}
