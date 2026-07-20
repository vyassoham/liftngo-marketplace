"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bike,
  ChevronDown,
  Clock3,
  Flame,
  Heart,
  MapPin,
  SearchX,
  Sparkles,
  Star,
  Store as StoreIcon,
  Tag,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LocationStore } from "@/lib/marketplace/location";
import { getStoreAvailability } from "@/lib/marketplace/business-hours";
import motionStyles from "./locationMotion.module.css";

interface LocationStoreGridProps {
  stores: LocationStore[];
  selectedCategorySlug: string;
  locationName: string;
  sectionTitle: string;
  sectionSubtitle: string;
  searchQuery?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

type LocationState = "locating" | "available" | "denied" | "unavailable";

function useCustomerLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [state, setState] = useState<LocationState>("locating");

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState("unavailable");
      return;
    }

    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setState("available");
      },
      (error) => {
        setCoordinates(null);
        setState(
          error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { coordinates, state, requestLocation };
}

function haversineDistanceKm(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function getOfferText(offer: unknown): string | null {
  if (!offer) return null;
  if (typeof offer === "string") return offer;
  if (typeof offer !== "object") return null;

  const value = offer as Record<string, unknown>;
  if (typeof value.title === "string") return value.title;
  if (value.type === "PERCENTAGE" && value.value != null) {
    const maximum = value.maxDiscount ?? value.max_discount;
    return maximum != null
      ? `${value.value}% OFF up to ₹${maximum}`
      : `${value.value}% OFF`;
  }
  if (value.type === "FIXED_AMOUNT" && value.value != null)
    return `₹${value.value} OFF`;
  if (value.type === "FREE_DELIVERY") return "Free delivery";
  return null;
}

function formatMinorAmount(minor: number): string {
  return `₹${(minor / 100).toFixed(0)}`;
}

function formatPrepTime(minutes: number): string {
  if (minutes <= 15) return `${minutes} min`;
  if (minutes <= 30) return `${minutes - 5}-${minutes} min`;
  return `${minutes}-${minutes + 10} min`;
}

function deliveryText(store: LocationStore): string {
  if (!store.delivery_enabled) return "Pickup only";
  if (store.delivery_fee_minor != null && store.delivery_fee_minor > 0) {
    return `${formatMinorAmount(store.delivery_fee_minor)} delivery fee`;
  }
  if (store.minimum_order_minor > 0) {
    return `Free delivery above ${formatMinorAmount(store.minimum_order_minor)}`;
  }
  return "Free delivery";
}

function formatReviewCount(value: number): string {
  if (value < 1000) return String(value);
  const thousands = value / 1000;
  return `${thousands.toFixed(thousands >= 10 ? 0 : 1)}K+`;
}

function StoreCard({
  store,
  distance,
  locationState,
  now,
}: {
  store: LocationStore;
  distance: number | null;
  locationState: LocationState;
  now: Date | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const availability = now
    ? getStoreAvailability(
        {
          status: store.status,
          businessHours: store.business_hours,
          temporarilyClosedUntil: store.temporarily_closed_until,
        },
        now,
      )
    : store.availability;
  const open = availability.isOpen;
  const accent = store.accent_colour || "#FF5A00";
  const offerText = getOfferText(store.offers[0]);
  const prepLabel = formatPrepTime(store.default_preparation_minutes);

  const metadata = [
    store.rating != null
      ? {
          key: "rating",
          icon: Star,
          text: `${store.rating.toFixed(1)}${
            store.review_count != null
              ? ` (${formatReviewCount(store.review_count)})`
              : ""
          }`,
          className: "text-amber-500",
          fill: true,
        }
      : null,
    {
      key: "prep",
      icon: Clock3,
      text: prepLabel,
      className: "text-slate-400",
      fill: false,
    },
    store.latitude != null && store.longitude != null
      ? {
          key: "distance",
          icon: MapPin,
          text:
            distance != null
              ? `${distance.toFixed(1)} km`
              : locationState === "locating"
                ? "Locating…"
                : "Distance unavailable",
          className: "text-slate-400",
          fill: false,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    icon: typeof Star;
    text: string;
    className: string;
    fill: boolean;
  }>;

  return (
    <article
      id={`store-${store.slug}`}
      className={`group relative overflow-hidden rounded-[24px] ring-1 transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:motion-safe:hover:-translate-y-1.5 ${
        open
          ? "bg-white shadow-[0_14px_36px_rgba(15,23,42,0.09)] ring-slate-200/80 md:motion-safe:hover:shadow-[0_20px_44px_rgba(15,23,42,0.13)]"
          : "bg-slate-100 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-slate-300/90 md:motion-safe:hover:shadow-[0_16px_34px_rgba(15,23,42,0.10)]"
      }`}
      data-testid="store-card"
      data-store-open={open ? "true" : "false"}
    >
      <Link
        href={`/store/${store.slug}`}
        className="block h-full rounded-[24px] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.992] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
        aria-label={`View ${store.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {store.thumbnail_url && !imageFailed ? (
            <Image
              src={store.thumbnail_url}
              alt={`${store.name} featured dish`}
              fill
              className={`object-cover transition-[transform,filter,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:motion-safe:group-hover:scale-[1.035] ${
                open ? "" : "grayscale opacity-75"
              }`}
              onError={() => setImageFailed(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ backgroundColor: `${accent}12` }}
            >
              <StoreIcon className="h-16 w-16 text-slate-300" />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
          <div
            className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold shadow-sm backdrop-blur ${
              open ? "bg-white/95 text-[#071632]" : "bg-slate-900/80 text-white"
            }`}
          >
            {store.is_featured ? (
              <>
                <Flame
                  className="marketplace-fire-flicker h-4 w-4 fill-current text-orange-500"
                  aria-hidden="true"
                />
                Highly ordered
              </>
            ) : (
              <>
                <Clock3
                  className={`h-3.5 w-3.5 ${open ? "text-orange-600" : "text-slate-300"}`}
                />
                {prepLabel}
              </>
            )}
          </div>
        </div>

        <div className="relative flex flex-col items-center px-5 pb-4 pt-14 text-center">
          {store.logo_url ? (
            <div className="absolute -top-[50px] h-[96px] w-[96px] overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_8px_22px_rgba(15,23,42,0.16)]">
              <Image
                src={store.logo_url}
                alt={`${store.name} logo`}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-xl font-black tracking-[-0.025em] text-[#071632]">
              {store.name}
            </h3>
            {store.is_verified ? (
              <BadgeCheck
                className="h-5 w-5 fill-emerald-500 text-white"
                aria-label="Verified store"
              />
            ) : null}
          </div>

          {store.usp ? (
            <p className="mt-1.5 line-clamp-1 text-sm font-medium text-slate-500">
              {store.usp}
            </p>
          ) : null}

          <div className="mt-4 flex min-h-5 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600">
            {metadata.map((item, index) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-1.5"
                >
                  {index > 0 ? (
                    <span className="mr-0.5 text-slate-300">|</span>
                  ) : null}
                  <Icon
                    className={`h-3.5 w-3.5 ${item.className} ${item.fill ? "fill-current" : ""}`}
                  />
                  {item.text}
                </span>
              );
            })}
          </div>

          {offerText ? (
            <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-extrabold text-emerald-700">
              <Tag className="h-4 w-4" />
              <span className="truncate">{offerText}</span>
            </div>
          ) : null}

          <div
            id={`store-${store.slug}-availability`}
            className={`mt-5 flex w-full scroll-mt-24 flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t pt-4 text-xs font-semibold ${
              open ? "border-slate-100" : "border-slate-300"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1.5 ${open ? "text-emerald-600" : "text-slate-600"}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {open ? "Open now" : (availability.nextOpenLabel ?? "Closed")}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Bike className="h-4 w-4" />
              {deliveryText(store)}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setFavorite((current) => !current)}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-[transform,color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 motion-reduce:transition-none"
        aria-label={
          favorite
            ? `Remove ${store.name} from favorites`
            : `Add ${store.name} to favorites`
        }
        aria-pressed={favorite}
      >
        <Heart
          className={`${favorite ? motionStyles.favoritePop : ""} h-5 w-5 ${favorite ? "fill-rose-500 text-rose-500" : ""}`}
        />
      </button>
    </article>
  );
}

function EmptyState({
  locationName,
  categoryName,
}: {
  locationName: string;
  categoryName: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-[#071632]">
        No matching stores yet
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        No {categoryName} stores currently match your search in {locationName}.
      </p>
    </div>
  );
}

export default function LocationStoreGrid({
  stores,
  selectedCategorySlug,
  locationName,
  sectionTitle,
  sectionSubtitle,
  searchQuery = "",
}: LocationStoreGridProps) {
  const [sortBy, setSortBy] = useState<
    "recommended" | "rating" | "time" | "distance" | "name"
  >("recommended");
  const [limit, setLimit] = useState(8);
  const [availabilityNow, setAvailabilityNow] = useState<Date | null>(null);
  const [animateGrid, setAnimateGrid] = useState(false);
  const {
    coordinates,
    state: locationState,
    requestLocation,
  } = useCustomerLocation();

  useEffect(() => {
    const refresh = () => setAvailabilityNow(new Date());
    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setAnimateGrid(false);
    const frame = window.requestAnimationFrame(() => setAnimateGrid(true));
    return () => window.cancelAnimationFrame(frame);
  }, [limit, searchQuery, selectedCategorySlug, sortBy]);

  const distanceByStore = useMemo(() => {
    const distances = new Map<string, number>();
    if (!coordinates) return distances;
    stores.forEach((store) => {
      if (store.latitude == null || store.longitude == null) return;
      distances.set(
        store.id,
        haversineDistanceKm(coordinates, {
          latitude: store.latitude,
          longitude: store.longitude,
        }),
      );
    });
    return distances;
  }, [coordinates, stores]);

  const categoryName =
    selectedCategorySlug === "all"
      ? "selected"
      : selectedCategorySlug.replaceAll("-", " ");

  const filteredStores = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const list = stores.filter((store) => {
      const matchesCategory =
        selectedCategorySlug === "all" ||
        store.business_categories?.slug === selectedCategorySlug;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      return [
        store.name,
        store.business_categories?.name,
        store.usp,
        store.description,
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
    });

    return list.sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? -1) - (a.rating ?? -1);
      if (sortBy === "time") {
        return a.default_preparation_minutes - b.default_preparation_minutes;
      }
      if (sortBy === "distance") {
        return (
          (distanceByStore.get(a.id) ?? Number.POSITIVE_INFINITY) -
          (distanceByStore.get(b.id) ?? Number.POSITIVE_INFINITY)
        );
      }
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (
        Number(b.is_featured) - Number(a.is_featured) ||
        a.name.localeCompare(b.name)
      );
    });
  }, [distanceByStore, searchQuery, selectedCategorySlug, sortBy, stores]);

  const visibleStores = filteredStores.slice(0, limit);

  return (
    <div className="px-4 pb-6 pt-7 sm:px-6 sm:pb-8 sm:pt-9">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-[-0.035em] text-[#071632] sm:text-[30px]">
            {sectionTitle}
            <Sparkles
              className="h-6 w-6 fill-orange-500 text-orange-500"
              aria-hidden="true"
            />
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
            {searchQuery
              ? `Search results for “${searchQuery}”`
              : sectionSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {locationState !== "available" ? (
            <button
              type="button"
              onClick={requestLocation}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-extrabold text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 motion-reduce:transition-none"
            >
              <MapPin className="h-4 w-4" />
              {locationState === "locating" ? "Locating…" : "Use my location"}
            </button>
          ) : null}

          <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Star className="h-5 w-5" />
            </span>
            <label htmlFor="sort-stores" className="sr-only">
              Sort stores
            </label>
            <select
              id="sort-stores"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as typeof sortBy);
                setLimit(8);
              }}
              className="min-h-10 appearance-none bg-transparent py-2 pl-3 pr-9 text-xs font-extrabold text-[#071632] outline-none sm:min-w-[210px] sm:text-sm"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="rating">Sort by: Rating</option>
              <option value="time">Sort by: Delivery time</option>
              <option value="distance">Sort by: Distance</option>
              <option value="name">Sort by: Name</option>
            </select>
            <ChevronDown className="pointer-events-none -ml-7 mr-2 h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      {filteredStores.length ? (
        <>
          <div
            className={`${animateGrid ? motionStyles.gridEntrance : ""} grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-4`}
          >
            {visibleStores.map((store) => (
              <div key={store.id} className="h-full">
                <StoreCard
                  store={store}
                  distance={distanceByStore.get(store.id) ?? null}
                  locationState={locationState}
                  now={availabilityNow}
                />
              </div>
            ))}
          </div>

          {limit < filteredStores.length ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit(filteredStores.length)}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-extrabold text-[#071632] shadow-sm transition hover:border-orange-200 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 motion-reduce:transition-none"
              >
                View all stores
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState locationName={locationName} categoryName={categoryName} />
      )}
    </div>
  );
}
