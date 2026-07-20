import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const workspace = process.cwd();
const storeSlug = 'chai-smoker';
const productBucket = 'marketplace-product-assets';
const storeBucket = 'marketplace-store-assets';
const productAssetDirectory = path.join(
  workspace,
  'artifacts',
  'generated',
  'marketplace',
  'products',
  storeSlug,
);
const heroAssetPath = path.join(
  workspace,
  'artifacts',
  'generated',
  'marketplace',
  'storefront',
  storeSlug,
  'hero-v1.webp',
);

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=');
        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        return [key, value];
      }),
  );
}

async function getRequiredConfiguration() {
  const fileEnv = parseEnv(await readFile(path.join(workspace, '.env'), 'utf8'));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return { url, serviceRoleKey };
}

async function ensureProductBucket(supabase) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((bucket) => bucket.id === productBucket)) return;

  const { error: createError } = await supabase.storage.createBucket(productBucket, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/webp'],
  });
  if (createError) throw createError;
}

async function uploadWebp(supabase, bucket, objectPath, filePath) {
  const bytes = await readFile(filePath);
  const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    cacheControl: '31536000',
    contentType: 'image/webp',
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function assertPublicUrl(url) {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) {
    throw new Error(`Asset verification failed (${response.status}): ${url}`);
  }
}

async function main() {
  const { url, serviceRoleKey } = await getRequiredConfiguration();
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, slug')
    .eq('slug', storeSlug)
    .single();
  if (storeError) throw storeError;

  const [{ data: products, error: productError }, { data: categories, error: categoryError }] =
    await Promise.all([
      supabase
        .from('products')
        .select('id, slug, name, category_id, status, is_available')
        .eq('store_id', store.id)
        .order('name', { ascending: true }),
      supabase
        .from('catalogue_categories')
        .select('id, slug, sort_order')
        .eq('store_id', store.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);
  if (productError) throw productError;
  if (categoryError) throw categoryError;

  const expectedNames = new Set(products.map((product) => `${product.slug}-v1.webp`));
  const actualNames = new Set(
    (await readdir(productAssetDirectory)).filter((name) => name.endsWith('-v1.webp')),
  );
  const missing = [...expectedNames].filter((name) => !actualNames.has(name));
  const extra = [...actualNames].filter((name) => !expectedNames.has(name));
  if (missing.length || extra.length) {
    throw new Error(
      `Product asset mismatch. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`,
    );
  }

  for (const product of products) {
    const filePath = path.join(productAssetDirectory, `${product.slug}-v1.webp`);
    const file = await stat(filePath);
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      throw new Error(`Invalid product asset size: ${product.slug} (${file.size} bytes).`);
    }
  }

  await ensureProductBucket(supabase);

  const productUrls = new Map();
  for (const product of products) {
    const objectPath = `${storeSlug}/products/${product.slug}/card-v1.webp`;
    const filePath = path.join(productAssetDirectory, `${product.slug}-v1.webp`);
    const publicUrl = await uploadWebp(
      supabase,
      productBucket,
      objectPath,
      filePath,
    );
    const { error: updateError } = await supabase
      .from('products')
      .update({ images: [publicUrl] })
      .eq('id', product.id);
    if (updateError) throw updateError;
    productUrls.set(product.id, publicUrl);
  }

  for (const category of categories) {
    const representative = products.find(
      (product) =>
        product.category_id === category.id &&
        product.status === 'ACTIVE' &&
        product.is_available,
    );
    if (!representative) continue;

    const imageUrl = productUrls.get(representative.id);
    const { error: updateError } = await supabase
      .from('catalogue_categories')
      .update({ image_url: imageUrl })
      .eq('id', category.id);
    if (updateError) throw updateError;
  }

  const heroUrl = await uploadWebp(
    supabase,
    storeBucket,
    `${storeSlug}/storefront/hero-v1.webp`,
    heroAssetPath,
  );
  const { error: storeUpdateError } = await supabase
    .from('stores')
    .update({ banner_url: heroUrl })
    .eq('id', store.id);
  if (storeUpdateError) throw storeUpdateError;

  await Promise.all([...productUrls.values(), heroUrl].map(assertPublicUrl));

  const { data: verificationRows, error: verificationError } = await supabase
    .from('products')
    .select('id, slug, images')
    .eq('store_id', store.id)
    .order('slug', { ascending: true });
  if (verificationError) throw verificationError;

  const unlinked = verificationRows.filter(
    (product) => !Array.isArray(product.images) || product.images.length !== 1,
  );
  if (unlinked.length) {
    throw new Error(`Unlinked product rows: ${unlinked.map((row) => row.slug).join(', ')}`);
  }

  console.log(
    JSON.stringify(
      {
        bucket: productBucket,
        uploadedProducts: productUrls.size,
        linkedCategories: categories.length,
        heroUrl,
        verifiedProductRows: verificationRows.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
