/**
 * Location Data Layer
 * Supabase queries for location/locality-specific marketplace pages.
 * Server-only — do not import from client components.
 */

import { createClient } from '@supabase/supabase-js';

function getServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LocationData {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  is_active: boolean;
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
  is_featured: boolean;
  offers: unknown[];
  business_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  store_count: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetches a single locality by its slug.
 * Returns null if not found or inactive.
 */
export async function getLocationBySlug(slug: string): Promise<LocationData | null> {
  const supabase = getServerClient();

  const { data } = await supabase
    .from('localities')
    .select('id, name, slug, city, state, is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  return data || null;
}

/**
 * Fetches active stores for a given locality id.
 * Optionally filter by business category slug.
 */
export async function getLocationStores(
  localityId: string,
  categorySlug?: string,
): Promise<LocationStore[]> {
  const supabase = getServerClient();

  const { data } = await supabase
    .from('stores')
    .select(`
      id, slug, name, usp, description,
      logo_url, thumbnail_url, banner_url, accent_colour,
      status, temporarily_closed_until,
      default_preparation_minutes, minimum_order_minor,
      is_featured, offers,
      business_categories (id, name, slug)
    `)
    .eq('locality_id', localityId)
    .in('status', ['ACTIVE', 'PAUSED'])
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  if (!data) return [];

  let stores = data.map((s) => ({
    ...s,
    minimum_order_minor: Number(s.minimum_order_minor) || 0,
    business_categories: (Array.isArray(s.business_categories) ? s.business_categories[0] : s.business_categories) as unknown as LocationStore['business_categories'],
  }));

  // Client-side filter by category when provided
  if (categorySlug && categorySlug !== 'all') {
    stores = stores.filter(
      (s) => s.business_categories?.slug === categorySlug,
    );
  }

  return stores;
}

/**
 * Returns store counts grouped by business category for a locality.
 * Used to show "6 stores" badges on category pills.
 */
export async function getLocationCategoryStats(
  localityId: string,
): Promise<CategoryStat[]> {
  const supabase = getServerClient();

  // Fetch all active stores with their category
  const { data: stores } = await supabase
    .from('stores')
    .select('business_category_id, business_categories (id, name, slug, icon_url)')
    .eq('locality_id', localityId)
    .eq('status', 'ACTIVE');

  if (!stores || stores.length === 0) return [];

  // Aggregate counts per category
  const counts = new Map<
    string,
    { category: CategoryStat; count: number }
  >();

  for (const s of stores) {
    const catData = Array.isArray(s.business_categories) ? s.business_categories[0] : s.business_categories;
    const cat = catData as unknown as {
      id: string; name: string; slug: string; icon_url: string | null;
    } | null;

    if (!cat) continue;

    if (!counts.has(cat.id)) {
      counts.set(cat.id, {
        category: { ...cat, store_count: 0 },
        count: 0,
      });
    }
    counts.get(cat.id)!.count++;
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map(({ category, count }) => ({ ...category, store_count: count }));
}

/**
 * Fetches other active localities in the same city (for "Nearby Areas" section).
 * Excludes the current locality.
 */
export async function getNearbyLocations(
  currentLocalityId: string,
  city: string,
  limit = 8,
): Promise<LocationData[]> {
  const supabase = getServerClient();

  const { data } = await supabase
    .from('localities')
    .select('id, name, slug, city, state, is_active')
    .eq('city', city)
    .eq('is_active', true)
    .neq('id', currentLocalityId)
    .limit(limit);

  return data || [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isStoreCurrentlyOpen(store: LocationStore): boolean {
  if (store.status === 'PAUSED') return false;
  if (store.temporarily_closed_until) {
    return new Date(store.temporarily_closed_until) < new Date();
  }
  return store.status === 'ACTIVE';
}

export function formatPrepTime(minutes: number): string {
  if (minutes <= 15) return `${minutes} min`;
  if (minutes <= 30) return `${minutes - 5}–${minutes} min`;
  return `${minutes}–${minutes + 10} min`;
}

export function formatMinorAmount(minor: number): string {
  return `₹${(minor / 100).toFixed(0)}`;
}
