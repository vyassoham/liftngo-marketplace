import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cart from "@/components/marketplace/Cart";
import StoreSwitchModal from "@/components/marketplace/StoreSwitchModal";
import StorefrontAbout from "@/components/marketplace/storefront/StorefrontAbout";
import StorefrontHero from "@/components/marketplace/storefront/StorefrontHero";
import StorefrontNav from "@/components/marketplace/storefront/StorefrontNav";
import StorefrontProductGrid from "@/components/marketplace/storefront/StorefrontProductGrid";
import StorefrontMobileUtility from "@/components/marketplace/storefront/StorefrontMobileUtility";
import { StoreAvailabilityProvider } from "@/components/marketplace/storefront/StoreAvailabilityProvider";
import {
  getPreparationLabel,
  getStoreAccentColor,
  getStorefrontAvailability,
  getStorefrontData,
  getStoreMetadata,
  minorToCurrency,
} from "@/lib/marketplace/storefront";

interface StorePageProps {
  params: Promise<{ storeSlug: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const store = await getStoreMetadata(storeSlug);

  if (!store) return { title: "Store Not Found" };

  const title = store.seo_title || `${store.name} | Malviya Nagar Marketplace`;
  const description =
    store.seo_description ||
    `Shop at ${store.name} on Malviya Nagar Marketplace.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: store.thumbnail_url ? [store.thumbnail_url] : [],
      type: "website",
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const data = await getStorefrontData(storeSlug);
  if (!data) notFound();

  const { store, categories, products } = data;
  const initialAvailability = getStorefrontAvailability(store);
  const availabilitySource = {
    status: store.status,
    businessHours: store.business_hours,
    temporarilyClosedUntil: store.temporarily_closed_until,
  };
  const preparationLabel = getPreparationLabel(store);
  const accentColor = getStoreAccentColor(store);
  const minimumOrder = minorToCurrency(store.minimum_order_minor);
  const deliveryFee =
    store.delivery_fee_minor === null
      ? null
      : minorToCurrency(store.delivery_fee_minor);
  const locality = store.localities?.name || "";
  const city = store.localities?.city || "";

  const normalizedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description || "",
    image: product.images?.[0] || "",
    price: minorToCurrency(product.price_minor),
    originalPrice: product.original_price_minor
      ? minorToCurrency(product.original_price_minor)
      : undefined,
    categoryId: product.category_id || "",
    inStock: product.is_available && product.status === "ACTIVE",
    preparationMinutes: product.preparation_minutes,
    maxQuantity: product.maximum_quantity,
  }));

  const allCategory = categories.find((category) => category.slug === "all");
  const normalizedCategories = categories
    .filter((category) => category.slug !== "all")
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.image_url,
    }));

  return (
    <div className="min-h-screen bg-[#fffdfb]">
      <StoreAvailabilityProvider
        source={availabilitySource}
        initialAvailability={initialAvailability}
      >
        <StorefrontHero
          store={{
            name: store.name,
            usp: store.usp || "",
            description: store.description || "",
            logo: store.logo_url || "",
            banner: store.banner_url || "",
            accentColor,
            rating: store.rating,
            reviewCount: store.review_count,
            preparationLabel,
            minimumOrder,
            deliveryFee,
            supportPhone: store.support_phone,
            locality,
            city,
            businessCategory: store.business_categories?.name || null,
            isVerified: store.is_verified,
          }}
        />

        <StorefrontNav
          categories={normalizedCategories}
          accentColor={accentColor}
          allImageUrl={
            allCategory?.image_url ||
            normalizedProducts[0]?.image ||
            store.logo_url ||
            null
          }
        />

        <StorefrontProductGrid
          products={normalizedProducts}
          categories={normalizedCategories}
          storeId={store.id}
          storeSlug={store.slug}
          storeName={store.name}
          storeLogo={store.logo_url || ""}
          accentColor={accentColor}
          minimumOrder={minimumOrder}
        />

        <StorefrontAbout
          store={{
            name: store.name,
            description: store.description || "",
            address: store.public_address || "",
            landmark: store.landmark || "",
            locality,
            city,
            phone: store.public_phone || "",
            email: store.public_email || "",
            supportPhone: store.support_phone,
            preparationLabel,
            minimumOrder,
            businessCategory: store.business_categories?.name || null,
          }}
        />

        <StorefrontMobileUtility />

        <Cart />
        <StoreSwitchModal />
      </StoreAvailabilityProvider>
    </div>
  );
}
