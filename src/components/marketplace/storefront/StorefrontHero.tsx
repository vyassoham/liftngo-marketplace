"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  IndianRupee,
  MapPin,
  Phone,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useStoreAvailability } from "./StoreAvailabilityProvider";

interface StorefrontHeroProps {
  store: {
    name: string;
    usp: string;
    description: string;
    logo: string;
    banner: string;
    accentColor: string;
    rating: number | null;
    reviewCount: number | null;
    preparationLabel: string;
    minimumOrder: number;
    deliveryFee: number | null;
    supportPhone: string;
    locality: string;
    city: string;
    businessCategory: string | null;
    isVerified: boolean;
  };
}

export default function StorefrontHero({ store }: StorefrontHeroProps) {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const availability = useStoreAvailability();
  const accent = store.accentColor || "#FF5A00";
  const supportingCopy = store.usp || store.description;

  return (
    <section className="relative isolate overflow-hidden bg-[#080b0d] text-white">
      <div className="absolute inset-0">
        {store.banner && !bannerError ? (
          <Image
            src={store.banner}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center transition duration-500 ${
              availability.isOpen ? "" : "grayscale opacity-60"
            }`}
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="h-full w-full bg-[#080b0d]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,8,.98)_0%,rgba(3,6,8,.92)_36%,rgba(3,6,8,.42)_68%,rgba(3,6,8,.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.54)_0%,transparent_34%,rgba(0,0,0,.34)_100%)]" />
      </div>

      <div className="relative px-3 pb-3 pt-3 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <Link
            href="/locations/malviya-nagar"
            className="inline-flex min-h-9 items-center gap-2 rounded-full bg-black/30 px-2.5 text-[12px] font-bold text-white/95 backdrop-blur-md"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
            <span>Back to Marketplace</span>
          </Link>

          <div className="flex min-h-10 max-w-[47%] flex-col items-center justify-center rounded-full border border-white/35 bg-black/45 px-3 text-center text-[9px] font-bold leading-3.5 backdrop-blur-md">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  availability.isOpen ? "bg-emerald-400" : "bg-slate-400"
                }`}
              />
              <span
                className={
                  availability.isOpen ? "text-emerald-300" : "text-slate-200"
                }
              >
                {availability.isOpen ? "Open now" : "Closed"}
              </span>
            </span>
            <span className="max-w-full truncate text-white/85">
              {availability.isOpen
                ? availability.closesLabel
                : availability.nextOpenLabel}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[86px_minmax(0,1fr)_42px] items-center gap-3">
          <div className="relative h-[96px] overflow-hidden rounded-[17px] border border-[#ead9c6] bg-[#fff8ec] shadow-xl">
            {store.logo && !logoError ? (
              <Image
                src={store.logo}
                alt={`${store.name} logo`}
                fill
                sizes="86px"
                className="object-contain p-2.5"
                onError={() => setLogoError(true)}
              />
            ) : null}
          </div>

          <div className="min-w-0 self-center">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[20px] font-black tracking-[-0.035em] text-white">
                {store.name}
              </h1>
              {store.isVerified ? (
                <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : null}
            </div>
            {store.businessCategory ? (
              <span
                className="mt-1.5 inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ background: `${accent}50`, color: "#ffd1b7" }}
              >
                {store.businessCategory}
              </span>
            ) : null}
            {supportingCopy ? (
              <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-[1.4] text-white/80">
                {supportingCopy}
              </p>
            ) : null}
          </div>

          {store.supportPhone ? (
            <a
              href={`tel:${store.supportPhone}`}
              aria-label={`Call ${store.name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md"
            >
              <Phone className="h-[19px] w-[19px]" />
            </a>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-4 divide-x divide-white/15 overflow-hidden rounded-[18px] border border-white/20 bg-[#2a1a11]/75 shadow-xl backdrop-blur-md">
          <MobileHeroFact
            icon={<Clock3 className="h-5 w-5" />}
            value={store.preparationLabel}
            label="Delivery"
            accent={accent}
          />
          <MobileHeroFact
            icon={<IndianRupee className="h-5 w-5" />}
            value={`₹${store.minimumOrder}`}
            label="Order min."
            accent={accent}
          />
          <MobileHeroFact
            icon={<MapPin className="h-5 w-5" />}
            value={store.locality}
            label={store.city}
            accent={accent}
          />
          {store.rating !== null ? (
            <MobileHeroFact
              icon={<Star className="h-5 w-5 fill-current" />}
              value={String(store.rating)}
              label={
                store.reviewCount === null
                  ? "Rating"
                  : `${store.reviewCount} reviews`
              }
              accent={accent}
            />
          ) : (
            <MobileHeroFact
              icon={<Truck className="h-5 w-5" />}
              value={
                store.deliveryFee === 0 ? "Free" : `₹${store.deliveryFee ?? 0}`
              }
              label="Delivery fee"
              accent={accent}
            />
          )}
        </div>

        <div className="mt-2 flex min-h-10 items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-black/35 px-4 text-[12px] font-bold text-white/90 backdrop-blur-md">
          <Truck className="h-[18px] w-[18px]" style={{ color: accent }} />
          Delivery by LiftNgo
        </div>
      </div>

      <div className="relative mx-auto hidden min-h-[430px] max-w-7xl px-4 pb-7 pt-5 sm:px-6 sm:pb-8 md:block lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <Link
            href="/locations/malviya-nagar"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:bg-black/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>

          <div className="inline-flex min-w-0 max-w-[58%] items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-black/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md sm:max-w-[55%]">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                availability.isOpen ? "bg-emerald-400" : "bg-slate-400"
              }`}
            />
            <span
              className={
                availability.isOpen ? "text-emerald-300" : "text-slate-200"
              }
            >
              {availability.isOpen ? "Open now" : "Closed"}
            </span>
            {(
              availability.isOpen
                ? availability.closesLabel
                : availability.nextOpenLabel
            ) ? (
              <>
                <span className="h-4 w-px bg-white/20" />
                <span className="truncate text-white/80">
                  {availability.isOpen
                    ? availability.closesLabel
                    : availability.nextOpenLabel}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-7 w-full rounded-[24px] border border-white/15 bg-[linear-gradient(135deg,rgba(25,18,17,.90),rgba(18,18,18,.78))] p-4 shadow-2xl backdrop-blur-xl sm:mt-10 sm:max-w-[790px] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-24 w-full max-w-[190px] shrink-0 overflow-hidden rounded-2xl border border-[#ead9c6] bg-[#fff8ec] shadow-xl sm:h-28 sm:w-52">
              {store.logo && !logoError ? (
                <Image
                  src={store.logo}
                  alt={`${store.name} logo`}
                  fill
                  sizes="144px"
                  className="object-contain p-3"
                  onError={() => setLogoError(true)}
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                  {store.name}
                </h1>
                {store.isVerified ? (
                  <BadgeCheck className="h-5 w-5 text-emerald-400" />
                ) : null}
                {store.businessCategory ? (
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: `${accent}28`, color: "#ffb184" }}
                  >
                    {store.businessCategory}
                  </span>
                ) : null}
              </div>

              {supportingCopy ? (
                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-white/76 sm:text-[15px]">
                  {supportingCopy}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <HeroFact
                  icon={<Clock3 className="h-5 w-5" />}
                  value={store.preparationLabel}
                  label="Preparation"
                  accent={accent}
                />
                <HeroFact
                  icon={<IndianRupee className="h-5 w-5" />}
                  value={`₹${store.minimumOrder}`}
                  label="Minimum order"
                  accent={accent}
                />
                <HeroFact
                  icon={<MapPin className="h-5 w-5" />}
                  value={store.locality}
                  label={store.city}
                  accent={accent}
                />
                {store.rating !== null ? (
                  <HeroFact
                    icon={<Star className="h-5 w-5 fill-current" />}
                    value={String(store.rating)}
                    label={
                      store.reviewCount === null
                        ? "Store rating"
                        : `${store.reviewCount} review${store.reviewCount === 1 ? "" : "s"}`
                    }
                    accent={accent}
                  />
                ) : store.deliveryFee !== null ? (
                  <HeroFact
                    icon={<Truck className="h-5 w-5" />}
                    value={
                      store.deliveryFee === 0 ? "Free" : `₹${store.deliveryFee}`
                    }
                    label="Delivery fee"
                    accent={accent}
                  />
                ) : null}
              </div>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <div className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white/85">
                  <Truck className="h-4 w-4" style={{ color: accent }} />
                  Delivery by LiftNgo
                </div>
                {store.supportPhone ? (
                  <a
                    href={`tel:${store.supportPhone}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFact({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex min-h-[66px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5">
      <span className="shrink-0" style={{ color: accent }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold text-white">
          {value}
        </span>
        <span className="mt-0.5 block truncate text-[11px] font-medium text-white/55">
          {label}
        </span>
      </span>
    </div>
  );
}

function MobileHeroFact({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 px-2 py-2.5">
      <span className="shrink-0" style={{ color: accent }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-black leading-4 text-white">
          {value}
        </span>
        <span className="block truncate text-[8px] font-semibold leading-3 text-white/60">
          {label}
        </span>
      </span>
    </div>
  );
}
