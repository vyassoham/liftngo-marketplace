import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import {
  getLocationBySlug,
  getLocationStores,
  getLocationCategoryStats,
} from "@/lib/marketplace/location";

import LocationHero from "@/components/marketplace/location/LocationHero";
import LocationContent from "@/components/marketplace/location/LocationContent";
import RestaurantPartnerBanner from "@/components/marketplace/location/RestaurantPartnerBanner";
import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";
import { Header, PageWrapper } from "@/components/landing";

type Props = { params: Promise<{ locationSlug: string }> };

const MARKETPLACE_BANNERS = [
  {
    src: "/marketplace/banners/chai-smoker-chai-break.png",
    mobileSrc: "/marketplace/banners/chai-smoker-chai-break-mobile.png",
    headline: "Jaipur Needs a Chai Break.",
    tagline: "Kulhad chai, cold coffee and comfort bites, delivered fast.",
  },
  {
    src: "/marketplace/banners/chai-smoker-campus-cravings.png",
    mobileSrc: "/marketplace/banners/chai-smoker-campus-cravings-mobile.png",
    headline: "Campus Cravings? Solved.",
    tagline:
      "Maggi, sandwiches and fries for lectures, hostels and late study sessions.",
  },
  {
    src: "/marketplace/banners/chai-smoker-counter-price.png",
    mobileSrc: "/marketplace/banners/chai-smoker-counter-price-mobile.png",
    headline: "Counter-Price Cravings Solved.",
    tagline: "Chai Smoker x LiftnGo brings cafe favourites to NIT Jaipur.",
  },
  {
    src: "/marketplace/banners/chai-smoker-open-early.png",
    mobileSrc: "/marketplace/banners/chai-smoker-open-early-mobile.png",
    headline: "Open Early. Crave Late.",
    tagline: "Chai, shakes and snacks for every mood.",
  },
  {
    src: "/marketplace/banners/chai-smoker-comfort.png",
    mobileSrc: "/marketplace/banners/chai-smoker-comfort-mobile.png",
    headline: "Counter-Price Comfort, Delivered.",
    tagline: "From chai to pizza, cafe cravings come easy.",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);

  if (!location) return { title: "Location Not Found" };

  return generatePageMetadata({
    title: location.seo_title || `${location.name} Marketplace`,
    description:
      location.seo_description ||
      `Discover local businesses, food, and shopping in ${location.name}. Delivered by Liftngo.`,
    path: `/locations/${locationSlug}`,
    keywords: [
      location.name,
      "marketplace",
      "food delivery",
      "local stores",
      location.city,
    ],
  });
}

export default async function LocationMarketplacePage({ params }: Props) {
  const { locationSlug } = await params;

  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const [stores, categoryStats] = await Promise.all([
    getLocationStores(location.id),
    getLocationCategoryStats(location.id),
  ]);

  return (
    <PageWrapper headerSlot={<Header />}>
      <div className="flex min-h-screen flex-col bg-white">
        <main className="flex flex-1 flex-col">
          <LocationHero
            locationName={location.name}
            description={location.description}
            heroImageUrl={location.hero_image_url}
            generatedBanners={MARKETPLACE_BANNERS}
          />

          <LocationContent
            stores={stores}
            categories={categoryStats}
            locationName={location.name}
            sectionTitle={location.marketplace_section_title ?? ""}
            sectionSubtitle={location.marketplace_section_subtitle ?? ""}
            allCategory={{
              title: location.all_category_title ?? "",
              subtitle: location.all_category_subtitle ?? "",
              imageUrl: location.all_category_image_url ?? "",
            }}
            trustItems={location.marketplace_trust_items}
          />
        </main>

        {location.slug === "malviya-nagar" ? (
          <RestaurantPartnerBanner />
        ) : null}

        <MarketplaceFooter locationName={location.name} />
      </div>
    </PageWrapper>
  );
}
