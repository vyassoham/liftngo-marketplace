const STOREFRONT_ASSET_BUCKET = 'storefront-assets';

/**
 * Converts a Storage object key saved by the marketplace admin into the public URL
 * required by next/image. Existing absolute and site-relative URLs are left intact.
 */
export function resolveStoreImageUrl(
  value: string | null | undefined,
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
): string {
  const source = value?.trim() ?? '';

  if (!source || source.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(source) || !supabaseUrl) {
    return source;
  }

  const objectPath = source.split('/').map(encodeURIComponent).join('/');
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${STOREFRONT_ASSET_BUCKET}/${objectPath}`;
}
