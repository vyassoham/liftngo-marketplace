import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getStorefrontData,
  getStoreMetadata,
  isStoreOpen,
  getPreparationLabel,
  getStoreTagline,
  getStoreAccentColor,
  minorToCurrency,
} from '@/lib/marketplace/storefront';
import StorefrontHero from '@/components/marketplace/storefront/StorefrontHero';
import StorefrontNav from '@/components/marketplace/storefront/StorefrontNav';
import StorefrontProductGrid from '@/components/marketplace/storefront/StorefrontProductGrid';
import StorefrontAbout from '@/components/marketplace/storefront/StorefrontAbout';
import Cart from '@/components/marketplace/Cart';
import StoreSwitchModal from '@/components/marketplace/StoreSwitchModal';
import BackButton from '@/components/marketplace/BackButton';

interface StorePageProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const store = await getStoreMetadata(storeSlug);

  if (!store) {
    return { title: 'Store Not Found' };
  }

  const title = store.seo_title || `${store.name} | Malviya Nagar Marketplace`;
  const description = store.seo_description || `Shop at ${store.name} on Malviya Nagar Marketplace. Fast delivery in Jaipur.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: store.thumbnail_url ? [store.thumbnail_url] : [],
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;

  const data = await getStorefrontData(storeSlug);

  if (!data) {
    notFound();
  }

  const { store, categories, products } = data;

  // Derived values computed on the server
  const open = isStoreOpen(store);
  const preparationLabel = getPreparationLabel(store);
  const accentColor = getStoreAccentColor(store);
  const tagline = getStoreTagline(store);
  const minimumOrder = minorToCurrency(store.minimum_order_minor);
  const locality = store.localities?.name || 'Malviya Nagar';
  const city = store.localities?.city || 'Jaipur';

  // Normalize products for the client components (convert BigInt prices to plain numbers)
  const normalizedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description || '',
    image: p.images?.[0] || '',
    price: minorToCurrency(p.price_minor),
    originalPrice: p.original_price_minor ? minorToCurrency(p.original_price_minor) : undefined,
    categoryId: p.category_id || '',
    inStock: p.is_available && p.status === 'ACTIVE',
    preparationMinutes: p.preparation_minutes,
    maxQuantity: p.maximum_quantity,
  }));

  const normalizedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: null as string | null, // icon not in DB schema yet, gracefully absent
    imageUrl: c.image_url,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <BackButton href="/malviya-nagar" label="Back to Marketplace" />
      </div>

      {/* Hero Section */}
      <StorefrontHero
        store={{
          name: store.name,
          tagline,
          usp: store.usp || '',
          description: store.description || '',
          logo: store.logo_url || '',
          banner: store.banner_url || '',
          accentColor,
          isOpen: open,
          rating: null, // Not in DB yet — gracefully absent
          preparationLabel,
          minimumOrder,
          supportPhone: store.support_phone,
          locality,
          city,
          businessCategory: store.business_categories?.name || null,
        }}
      />

      {/* Sticky Category Navigation */}
      <StorefrontNav
        categories={normalizedCategories}
        accentColor={accentColor}
      />

      {/* Product Grid */}
      <StorefrontProductGrid
        products={normalizedProducts}
        categories={normalizedCategories}
        storeId={store.id}
        storeSlug={store.slug}
        storeName={store.name}
        storeLogo={store.logo_url || ''}
        accentColor={accentColor}
        isOpen={open}
        minimumOrder={minimumOrder}
      />

      {/* About Section */}
      <StorefrontAbout
        store={{
          name: store.name,
          description: store.description || '',
          address: store.public_address || '',
          landmark: store.landmark || '',
          locality,
          city,
          phone: store.public_phone || '',
          email: store.public_email || '',
          supportPhone: store.support_phone,
          preparationLabel,
          minimumOrder,
          businessCategory: store.business_categories?.name || null,
        }}
      />

      {/* Cart Drawer (client component) */}
      <Cart />
      <StoreSwitchModal />
    </div>
  );
}
