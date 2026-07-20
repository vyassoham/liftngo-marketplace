BEGIN;

ALTER TABLE public.business_categories
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS card_image_url text;

ALTER TABLE public.localities
  ADD COLUMN IF NOT EXISTS marketplace_section_title text,
  ADD COLUMN IF NOT EXISTS marketplace_section_subtitle text,
  ADD COLUMN IF NOT EXISTS all_category_title text,
  ADD COLUMN IF NOT EXISTS all_category_subtitle text,
  ADD COLUMN IF NOT EXISTS all_category_image_url text,
  ADD COLUMN IF NOT EXISTS marketplace_trust_items jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS rating numeric(2, 1),
  ADD COLUMN IF NOT EXISTS review_count integer,
  ADD COLUMN IF NOT EXISTS delivery_fee_minor bigint,
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  ALTER TABLE public.stores
    ADD CONSTRAINT stores_rating_range_check
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.stores
    ADD CONSTRAINT stores_review_count_nonnegative_check
    CHECK (review_count IS NULL OR review_count >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.stores
    ADD CONSTRAINT stores_delivery_fee_nonnegative_check
    CHECK (delivery_fee_minor IS NULL OR delivery_fee_minor >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

UPDATE public.localities
SET
  marketplace_section_title = 'Top businesses near you',
  marketplace_section_subtitle = 'Handpicked stores delivering to Malviya Nagar',
  all_category_title = 'All',
  all_category_subtitle = 'Explore all',
  all_category_image_url = 'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-category-assets/categories/all-v1.webp',
  marketplace_trust_items = '[
    {"id":"safe-packaging","title":"Safe & hygienic packaging"},
    {"id":"on-time-delivery","title":"On-time delivery"},
    {"id":"local-favourites","title":"Made for local favourites"}
  ]'::jsonb,
  updated_at = now()
WHERE slug = 'malviya-nagar';

UPDATE public.business_categories
SET
  name = 'Cafe & Beverages',
  subtitle = 'Coffee, tea & more',
  card_image_url = 'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-category-assets/categories/cafe-v1.webp',
  sort_order = 1,
  is_active = true,
  updated_at = now()
WHERE slug = 'cafe';

INSERT INTO public.business_categories (
  id,
  name,
  slug,
  subtitle,
  card_image_url,
  sort_order,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'Fast Food',
    'fast-food',
    'Burgers, wraps & bites',
    'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-category-assets/categories/fast-food-v1.webp',
    2,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Desserts',
    'desserts',
    'Cakes, ice cream & more',
    'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-category-assets/categories/desserts-v1.webp',
    3,
    true,
    now(),
    now()
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  card_image_url = EXCLUDED.card_image_url,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();

UPDATE public.stores
SET
  usp = 'Speciality tea, coffee, quick bites',
  latitude = 26.856178,
  longitude = 75.806933,
  logo_url = 'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-store-assets/chai-smoker/logo-v1.webp',
  banner_url = 'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-store-assets/chai-smoker/card-cover-v1.webp',
  thumbnail_url = 'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/marketplace-store-assets/chai-smoker/card-cover-v1.webp',
  accent_colour = '#FF5A00',
  delivery_fee_minor = 0,
  is_featured = true,
  updated_at = now()
WHERE slug = 'chai-smoker';

COMMIT;
