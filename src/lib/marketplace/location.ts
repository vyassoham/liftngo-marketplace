/**
 * Location marketplace data layer.
 * Server-only: do not import this module from client components at runtime.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resolveStoreImageUrl } from './store-image-url';
import {
  getStoreAvailability,
  type StoreAvailability,
} from './business-hours';

export interface MarketplaceTrustItem {
  id: string;
  title: string;
}

export interface LocationData {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  is_active: boolean;
  description: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  marketplace_section_title: string | null;
  marketplace_section_subtitle: string | null;
  all_category_title: string | null;
  all_category_subtitle: string | null;
  all_category_image_url: string | null;
  marketplace_trust_items: MarketplaceTrustItem[];
}

interface LocalityRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  is_active: unknown;
  description?: string | null;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  marketplace_section_title?: string | null;
  marketplace_section_subtitle?: string | null;
  all_category_title?: string | null;
  all_category_subtitle?: string | null;
  all_category_image_url?: string | null;
  marketplace_trust_items?: unknown;
}

export interface LocationStore {
  id: string;
  slug: string;
  name: string;
  usp: string | null;
  description: string | null;
  logo_url: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  accent_colour: string | null;
  status: string;
  temporarily_closed_until: string | null;
  default_preparation_minutes: number;
  minimum_order_minor: number;
  delivery_fee_minor: number | null;
  delivery_enabled: boolean;
  is_featured: boolean;
  is_verified: boolean;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  business_hours: Record<string, unknown>;
  availability: StoreAvailability;
  offers: unknown[];
  business_categories: {
    id: string;
    name: string;
    slug: string;
    icon_url: string | null;
  } | null;
}

interface StoreRow extends Record<string, unknown> {
  id: string;
  slug: string;
  name: string;
  usp?: string | null;
  description?: string | null;
  logo_url?: string | null;
  thumbnail_url?: string | null;
  banner_url?: string | null;
  accent_colour?: string | null;
  status: string;
  temporarily_closed_until?: Date | string | null;
  default_preparation_minutes: unknown;
  minimum_order_minor: unknown;
  delivery_fee_minor?: unknown;
  delivery_enabled?: unknown;
  is_featured: unknown;
  is_verified?: unknown;
  rating?: unknown;
  review_count?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  business_hours?: unknown;
  offers?: unknown;
  bc_id?: string | null;
  bc_name?: string | null;
  bc_slug?: string | null;
  bc_icon_url?: string | null;
}

export interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  icon_url: string | null;
  card_image_url: string | null;
  store_count: number;
}

interface CategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  icon_url?: string | null;
  card_image_url?: string | null;
  sort_order?: unknown;
  store_count: unknown;
}

export async function getLocationBySlug(slug: string): Promise<LocationData | null> {
  const rows = await prisma.$queryRaw<LocalityRow[]>(
    Prisma.sql`SELECT * FROM public.localities WHERE slug = ${slug} AND is_active = true LIMIT 1`,
  );

  if (!rows.length) return null;

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city ?? 'Jaipur',
    state: row.state ?? 'Rajasthan',
    is_active: Boolean(row.is_active),
    description: row.description ?? null,
    hero_image_url: resolveStoreImageUrl(row.hero_image_url) || null,
    seo_title: row.seo_title ?? null,
    seo_description: row.seo_description ?? null,
    marketplace_section_title: row.marketplace_section_title ?? null,
    marketplace_section_subtitle: row.marketplace_section_subtitle ?? null,
    all_category_title: row.all_category_title ?? null,
    all_category_subtitle: row.all_category_subtitle ?? null,
    all_category_image_url: resolveStoreImageUrl(row.all_category_image_url) || null,
    marketplace_trust_items: parseTrustItems(row.marketplace_trust_items),
  };
}

export async function getLocationStores(
  localityId: string,
  categorySlug?: string,
): Promise<LocationStore[]> {
  const rows = await prisma.$queryRaw<StoreRow[]>(
    Prisma.sql`
      SELECT
        s.*,
        bc.id AS "bc_id",
        bc.name AS "bc_name",
        bc.slug AS "bc_slug",
        bc.icon_url AS "bc_icon_url"
      FROM public.stores s
      LEFT JOIN public.business_categories bc ON s.business_category_id = bc.id
      WHERE s.locality_id = ${localityId}::uuid
        AND s.status IN ('ACTIVE', 'PUBLISHED', 'PAUSED')
      ORDER BY s.is_featured DESC, s.popularity_score DESC, s.name ASC
    `,
  );

  const stores = rows.map(parseStoreRow);
  if (categorySlug && categorySlug !== 'all') {
    return stores.filter((store) => store.business_categories?.slug === categorySlug);
  }
  return stores;
}

export async function getLocationCategoryStats(
  localityId: string,
): Promise<CategoryStat[]> {
  const rows = await prisma.$queryRaw<CategoryRow[]>(
    Prisma.sql`
      SELECT
        bc.id,
        bc.name,
        bc.slug,
        bc.subtitle,
        bc.icon_url,
        bc.card_image_url,
        bc.sort_order,
        COUNT(s.id)::int AS store_count
      FROM public.business_categories bc
      LEFT JOIN public.stores s
        ON s.business_category_id = bc.id
        AND s.locality_id = ${localityId}::uuid
        AND s.status IN ('ACTIVE', 'PUBLISHED', 'PAUSED')
      WHERE bc.is_active = true
      GROUP BY
        bc.id,
        bc.name,
        bc.slug,
        bc.subtitle,
        bc.icon_url,
        bc.card_image_url,
        bc.sort_order
      ORDER BY bc.sort_order ASC, bc.name ASC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle ?? null,
    icon_url: resolveStoreImageUrl(row.icon_url) || null,
    card_image_url: resolveStoreImageUrl(row.card_image_url) || null,
    store_count: toNumber(row.store_count),
  }));
}

export async function getNearbyLocations(
  currentLocalityId: string,
  city: string,
  limit = 8,
): Promise<LocationData[]> {
  const rows = await prisma.$queryRaw<LocalityRow[]>(
    Prisma.sql`
      SELECT *
      FROM public.localities
      WHERE city = ${city}
        AND is_active = true
        AND id <> ${currentLocalityId}::uuid
      ORDER BY name ASC
      LIMIT ${limit}
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city ?? 'Jaipur',
    state: row.state ?? 'Rajasthan',
    is_active: Boolean(row.is_active),
    description: row.description ?? null,
    hero_image_url: resolveStoreImageUrl(row.hero_image_url) || null,
    seo_title: row.seo_title ?? null,
    seo_description: row.seo_description ?? null,
    marketplace_section_title: row.marketplace_section_title ?? null,
    marketplace_section_subtitle: row.marketplace_section_subtitle ?? null,
    all_category_title: row.all_category_title ?? null,
    all_category_subtitle: row.all_category_subtitle ?? null,
    all_category_image_url: resolveStoreImageUrl(row.all_category_image_url) || null,
    marketplace_trust_items: parseTrustItems(row.marketplace_trust_items),
  }));
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value) || 0;
  if (
    typeof value === 'object' &&
    'toNumber' in value &&
    typeof (value as { toNumber: () => number }).toNumber === 'function'
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value) || 0;
}

function nullableNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : toNumber(value);
}

function parseStoreRow(row: StoreRow): LocationStore {
  const businessHours =
    row.business_hours && typeof row.business_hours === 'object'
      ? (row.business_hours as Record<string, unknown>)
      : {};
  const temporarilyClosedUntil = row.temporarily_closed_until
    ? new Date(row.temporarily_closed_until).toISOString()
    : null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    usp: row.usp ?? null,
    description: row.description ?? null,
    logo_url: resolveStoreImageUrl(row.logo_url) || null,
    thumbnail_url: resolveStoreImageUrl(row.thumbnail_url) || null,
    banner_url: resolveStoreImageUrl(row.banner_url) || null,
    accent_colour: row.accent_colour ?? null,
    status: row.status,
    temporarily_closed_until: temporarilyClosedUntil,
    default_preparation_minutes: toNumber(row.default_preparation_minutes) || 20,
    minimum_order_minor: toNumber(row.minimum_order_minor),
    delivery_fee_minor: nullableNumber(row.delivery_fee_minor),
    delivery_enabled: row.delivery_enabled !== false,
    is_featured: Boolean(row.is_featured),
    is_verified: Boolean(row.is_verified),
    rating: nullableNumber(row.rating),
    review_count: nullableNumber(row.review_count),
    latitude: nullableNumber(row.latitude),
    longitude: nullableNumber(row.longitude),
    business_hours: businessHours,
    availability: getStoreAvailability({
      status: row.status,
      businessHours,
      temporarilyClosedUntil,
    }),
    offers: parseOffers(row.offers),
    business_categories: row.bc_id
      ? {
          id: row.bc_id,
          name: row.bc_name ?? '',
          slug: row.bc_slug ?? '',
          icon_url: resolveStoreImageUrl(row.bc_icon_url) || null,
        }
      : null,
  };
}

function parseOffers(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function parseTrustItems(value: unknown): MarketplaceTrustItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || typeof candidate.title !== 'string') return [];
    return [{ id: candidate.id, title: candidate.title }];
  });
}

export function isStoreCurrentlyOpen(store: LocationStore): boolean {
  if (store.status === 'PAUSED') return false;
  if (store.temporarily_closed_until) {
    return new Date(store.temporarily_closed_until).getTime() < Date.now();
  }
  return store.status === 'ACTIVE' || store.status === 'PUBLISHED';
}

export function formatPrepTime(minutes: number): string {
  if (minutes <= 15) return `${minutes} min`;
  if (minutes <= 30) return `${minutes - 5}-${minutes} min`;
  return `${minutes}-${minutes + 10} min`;
}

export function formatMinorAmount(minor: number): string {
  return `₹${(minor / 100).toFixed(0)}`;
}
