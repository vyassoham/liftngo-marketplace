"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const MERCHANT_BANNERS = [
  {
    src: "/marketplace/merchant-banners/repeat-customers-v1.webp",
    alt: "LiftNGo helps restaurants turn walk-ins into repeat customers.",
  },
  {
    src: "/marketplace/merchant-banners/list-restaurant-v1.webp",
    alt: "List your restaurant with LiftNGo.",
  },
  {
    src: "/marketplace/merchant-banners/online-menu-v1.webp",
    alt: "Launch your restaurant menu online with LiftNGo.",
  },
];

export default function RestaurantPartnerBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const goTo = useCallback((index: number) => {
    setCurrent((index + MERCHANT_BANNERS.length) % MERCHANT_BANNERS.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [next, paused, reducedMotion]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) next();
    else previous();
  };

  return (
    <section
      aria-label="LiftNGo merchant benefits"
      className="bg-white px-4 pb-10 pt-2 sm:px-6 lg:px-8"
    >
      <div
        className="group relative mx-auto aspect-[1916/821] max-w-7xl touch-pan-y overflow-hidden rounded-[22px] border border-orange-100 bg-[#fff7eb] shadow-[0_20px_60px_rgba(91,52,23,0.13)] sm:rounded-[28px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPaused(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        {MERCHANT_BANNERS.map((banner, index) => (
          <Image
            key={banner.src}
            src={banner.src}
            alt={index === current ? banner.alt : ""}
            aria-hidden={index === current ? undefined : true}
            fill
            priority={index === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className={`object-contain transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
              index === current
                ? "scale-100 opacity-100"
                : "scale-[1.01] opacity-0"
            }`}
          />
        ))}

        <button
          type="button"
          onClick={previous}
          aria-label="Previous merchant banner"
          className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-slate-950/65 text-white opacity-0 shadow-lg transition-[opacity,transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:bg-slate-950/85 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none group-hover:opacity-100 sm:left-4 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next merchant banner"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-slate-950/65 text-white opacity-0 shadow-lg transition-[opacity,transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:bg-slate-950/85 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none group-hover:opacity-100 sm:right-4 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-950/65 px-2 py-1.5 sm:bottom-4">
          <span className="sr-only" aria-live="polite">
            Merchant banner {current + 1} of {MERCHANT_BANNERS.length}
          </span>
          {MERCHANT_BANNERS.map((banner, index) => (
            <button
              key={banner.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show merchant banner ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                index === current
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/55 hover:bg-white/85"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
