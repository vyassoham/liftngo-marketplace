/**
 * Storefront Data Layer
 * All Supabase queries for the public-facing store pages.
 * This module runs ONLY on the server (Next.js Server Components).
 */

import { createClient } from '@supabase/supabase-js';

// Server-side client (uses service role or anon key — no cookies needed for public data)
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export interface StorefrontProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  price_minor: number;          // stored as paise/cents
  original_price_minor: number | null;
  category_id: string | null;
  is_available: boolean;
  status: string;
  attributes: Record<string, unknown>;
  preparation_minutes: number;
  maximum_quantity: number;
}

export interface StorefrontStore {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  usp: string | null;
  logo_url: string | null;
  banner_url: string | null;
  thumbnail_url: string | null;
  accent_colour: string | null;
  status: string;
  public_phone: string | null;
  public_email: string | null;
  public_address: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  minimum_order_minor: number;
  default_preparation_minutes: number;
  business_hours: Record<string, unknown>;
  offers: unknown[];
  seo_title: string | null;
  seo_description: string | null;
  support_phone: string;
  is_featured: boolean;
  temporarily_closed_until: string | null;
  tagline: string | null; // derived from seo_title or name
  business_categories: {
    id: string;
    name: string;
    slug: string;
    icon_url: string | null;
  } | null;
  localities: {
    id: string;
    name: string;
    city: string | null;
  } | null;
}

export interface StorefrontData {
  store: StorefrontStore;
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
}

// ─── Computed helpers ─────────────────────────────────────────────────────────

export function isStoreOpen(store: StorefrontStore): boolean {
  if (store.status !== 'ACTIVE') return false;
  if (store.temporarily_closed_until) {
    return new Date(store.temporarily_closed_until) < new Date();
  }
  return true;
}

export function getPreparationLabel(store: StorefrontStore): string {
  const mins = store.default_preparation_minutes || 20;
  if (mins <= 15) return `${mins} min`;
  if (mins <= 30) return `${mins - 5}–${mins} min`;
  return `${mins}–${mins + 10} min`;
}

export function minorToCurrency(minor: number): number {
  return minor / 100;
}

export function getStoreAccentColor(store: StorefrontStore): string {
  return store.accent_colour || '#FF6B35';
}

export function getStoreTagline(store: StorefrontStore): string {
  return store.seo_title || `${store.name} – ${store.business_categories?.name || 'Marketplace'}`;
}

// ─── Main Fetch Functions ─────────────────────────────────────────────────────

/**
 * Fetches full storefront data for a given slug.
 * Returns null if the store doesn't exist or is not publicly visible.
 */
export async function getStorefrontData(slug: string): Promise<StorefrontData | null> {
  const supabase = getServerClient();

  // 1. Fetch store with category + locality in a single query
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select(`
      id, slug, name, description, usp,
      logo_url, banner_url, thumbnail_url, accent_colour,
      status, public_phone, public_email, public_address, landmark,
      latitude, longitude, minimum_order_minor, default_preparation_minutes,
      business_hours, offers, seo_title, seo_description,
      support_phone, is_featured, temporarily_closed_until,
      business_categories (id, name, slug, icon_url),
      localities (id, name, city)
    `)
    .eq('slug', slug)
    .in('status', ['ACTIVE', 'PAUSED'])  // Paused = visible but closed
    .maybeSingle();

  if (storeError || !store) {
    return null;
  }

  // 2. Fetch categories for this store
  const { data: categories } = await supabase
    .from('catalogue_categories')
    .select('id, name, slug, image_url, sort_order')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // 3. Fetch products (only ACTIVE and available)
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, slug, name, description, images,
      price_minor, original_price_minor, category_id,
      is_available, status, attributes,
      preparation_minutes, maximum_quantity
    `)
    .eq('store_id', store.id)
    .eq('status', 'ACTIVE')
    .eq('is_available', true)
    .order('name', { ascending: true });

  // Normalize BigInt/Decimal fields returned by Supabase (they come as strings for large values)
  const normalizedStore: StorefrontStore = {
    ...store,
    minimum_order_minor: Number(store.minimum_order_minor) || 0,
    latitude: store.latitude ? Number(store.latitude) : null,
    longitude: store.longitude ? Number(store.longitude) : null,
    tagline: null,
    business_categories: (Array.isArray(store.business_categories) ? store.business_categories[0] : store.business_categories) as unknown as StorefrontStore['business_categories'],
    localities: (Array.isArray(store.localities) ? store.localities[0] : store.localities) as unknown as StorefrontStore['localities'],
  };

  const normalizedProducts: StorefrontProduct[] = (products || []).map((p) => ({
    ...p,
    price_minor: Number(p.price_minor),
    original_price_minor: p.original_price_minor ? Number(p.original_price_minor) : null,
    images: Array.isArray(p.images) ? p.images : [],
    description: p.description || null,
  }));

  return {
    store: normalizedStore,
    categories: categories || [],
    products: normalizedProducts,
  };
}

/**
 * Fetch minimal store data for metadata generation only (fast, no product joins)
 */
export async function getStoreMetadata(slug: string): Promise<Pick<StorefrontStore, 'name' | 'seo_title' | 'seo_description' | 'slug' | 'thumbnail_url'> | null> {
  const supabase = getServerClient();

  const { data } = await supabase
    .from('stores')
    .select('name, seo_title, seo_description, slug, thumbnail_url')
    .eq('slug', slug)
    .in('status', ['ACTIVE', 'PAUSED'])
    .maybeSingle();

  return data || null;
}

// ─── Marketplace Listing ──────────────────────────────────────────────────────

export interface MarketplaceStore {
  id: string;
  slug: string;
  name: string;
  usp: string | null;
  thumbnail_url: string | null;
  logo_url: string | null;
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
  localities: {
    id: string;
    name: string;
  } | null;
}

/**
 * Fetch all publicly listed stores for the marketplace listing page.
 * Optionally filter by business category slug.
 */
export async function getMarketplaceStores(
  categorySlugs?: string[],
  localitySlug?: string,
): Promise<MarketplaceStore[]> {
  const supabase = getServerClient();

  let query = supabase
    .from('stores')
    .select(`
      id, slug, name, usp,
      thumbnail_url, logo_url, accent_colour,
      status, temporarily_closed_until,
      default_preparation_minutes, minimum_order_minor,
      is_featured, offers,
      business_categories (id, name, slug),
      localities (id, name)
    `)
    .in('status', ['ACTIVE', 'PAUSED'])
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  const { data } = await query;

  if (!data) return [];

  let stores = data.map((s) => ({
    ...s,
    minimum_order_minor: Number(s.minimum_order_minor) || 0,
    business_categories: (Array.isArray(s.business_categories) ? s.business_categories[0] : s.business_categories) as unknown as MarketplaceStore['business_categories'],
    localities: (Array.isArray(s.localities) ? s.localities[0] : s.localities) as unknown as MarketplaceStore['localities'],
  }));

  // Filter by category slug if provided (client-side, since Supabase doesn't support nested where easily)
  if (categorySlugs && categorySlugs.length > 0 && !categorySlugs.includes('all')) {
    stores = stores.filter(
      (s) => s.business_categories && categorySlugs.includes(s.business_categories.slug)
    );
  }

  if (localitySlug) {
    stores = stores.filter(
      (s) => s.localities && s.localities.name.toLowerCase().replace(/\s+/g, '-') === localitySlug
    );
  }

  return stores;
}

