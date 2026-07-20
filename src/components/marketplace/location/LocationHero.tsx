"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import motionStyles from "./locationMotion.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface CampaignBanner {
  src: string;
  mobileSrc?: string;
  headline: string;
  tagline: string;
}

interface LocationHeroProps {
  locationName: string;
  description?: string | null;
  heroImageUrl?: string | null;
  generatedBanners: CampaignBanner[];
}

export default function LocationHero({
  locationName,
  description,
  heroImageUrl,
  generatedBanners,
}: LocationHeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const slides = useMemo<CampaignBanner[]>(() => {
    if (generatedBanners.length) return generatedBanners;
    const supplied =
      heroImageUrl
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [];
    return Array.from(new Set(supplied)).map((src) => ({
      src,
      headline: `${locationName} Marketplace`,
      tagline:
        description || `Discover trusted local businesses in ${locationName}.`,
    }));
  }, [description, generatedBanners, heroImageUrl, locationName]);

  const next = useCallback(() => {
    if (!slides.length) return;
    setCurrent((value) => (value + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setCurrent((value) => (value - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [next, paused, reducedMotion, slides.length]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current == null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) next();
    else prev();
  };

  if (!slides.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
      <div
        className={`${motionStyles.heroEntrance} group/location-hero relative isolate aspect-[1004/1568] w-full touch-pan-y rounded-[24px] border border-orange-100 bg-[#fff7ed] shadow-[0_20px_70px_rgba(34,39,65,0.08)] sm:aspect-[2048/704]`}
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
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[23px]">
          {slides.map((slide, index) => {
            const stateClasses =
              index === current
                ? "scale-100 opacity-100"
                : "scale-[1.018] opacity-0";

            return (
              <div key={slide.src} className="absolute inset-0">
                <Image
                  src={slide.mobileSrc || slide.src}
                  alt={`${slide.headline} ${slide.tagline}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 639px) 100vw"
                  className={`object-cover object-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none sm:hidden ${stateClasses}`}
                />
                <Image
                  src={slide.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className={`hidden object-cover object-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none sm:block ${stateClasses}`}
                />
              </div>
            );
          })}
        </div>

        <h1 className="sr-only">{locationName}</h1>
        {description && <p className="sr-only">{description}</p>}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-40 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/95 text-slate-800 shadow-lg backdrop-blur transition-[transform,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:scale-105 motion-safe:hover:bg-white motion-safe:hover:shadow-xl active:scale-[0.97] motion-reduce:transition-none sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-40 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/95 text-slate-800 shadow-lg backdrop-blur transition-[transform,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:scale-105 motion-safe:hover:bg-white motion-safe:hover:shadow-xl active:scale-[0.97] motion-reduce:transition-none sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/80 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur">
              <span className="sr-only" aria-live="polite">
                {slides[current].headline}. Banner {current + 1} of{" "}
                {slides.length}
              </span>
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Show banner ${index + 1}: ${slide.headline}`}
                  aria-current={index === current ? "true" : undefined}
                  className={`relative h-2.5 overflow-hidden rounded-full bg-slate-200 transition-[width,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    index === current
                      ? "w-8 bg-orange-100"
                      : "w-2.5 hover:bg-slate-300"
                  }`}
                >
                  {index === current && (
                    <span
                      key={current}
                      className={[
                        "location-hero-progress absolute inset-y-0 left-0 rounded-full bg-orange-500",
                        paused ? "[animation-play-state:paused]" : null,
                        reducedMotion ? "w-full [animation:none]" : null,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
