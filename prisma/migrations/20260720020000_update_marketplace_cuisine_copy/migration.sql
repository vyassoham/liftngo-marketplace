UPDATE public.localities
SET
  marketplace_section_title = 'Best Cuisines Near You',
  marketplace_section_subtitle = 'Discover Malviya Nagar''s most-loved flavours, delivered fresh to your doorstep.',
  updated_at = now()
WHERE slug = 'malviya-nagar';
