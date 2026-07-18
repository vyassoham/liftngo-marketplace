import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { 
  getLocationBySlug, 
  getLocationStores, 
  getLocationCategoryStats, 
  getNearbyLocations 
} from '@/lib/marketplace/location';

import LocationHeader from '@/components/marketplace/location/LocationHeader';
import LocationBreadcrumbs from '@/components/marketplace/location/LocationBreadcrumbs';
import LocationHero from '@/components/marketplace/location/LocationHero';
import LocationContent from '@/components/marketplace/location/LocationContent';
import NearbyLocations from '@/components/marketplace/location/NearbyLocations';
import LocationTrustStrip from '@/components/marketplace/location/LocationTrustStrip';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

type Props = { params: Promise<{ locationSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  
  if (!location) return { title: 'Location Not Found' };
  
  // Need to cast to any to access dynamic fields since we haven't updated the DB types yet
  const loc = location as any;
  
  return generatePageMetadata({
    title: loc.seo_title || `${location.name} Marketplace`,
    description: loc.seo_description || `Discover local businesses, food, and shopping in ${location.name}. Delivered by Liftngo.`,
    path: `/locations/${locationSlug}`,
    keywords: [location.name, 'marketplace', 'food delivery', 'local stores', location.city],
  });
}

export default async function LocationMarketplacePage({ params }: Props) {
  const { locationSlug } = await params;
  
  // 1. Fetch location details
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  // 2. Parallel fetch for performance: Stores, Category Stats, and Nearby Locations
  const [stores, categoryStats, nearbyLocations] = await Promise.all([
    getLocationStores(location.id),
    getLocationCategoryStats(location.id),
    getNearbyLocations(location.id, location.city)
  ]);

  const loc = location as any; // Cast for dynamic fields (hero_image_url, description)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LocationHeader locationName={location.name} />
      <LocationBreadcrumbs locationName={location.name} />
      
      <main className="flex-1 flex flex-col">
        <LocationHero 
          locationName={location.name}
          description={loc.description}
          heroImageUrl={loc.hero_image_url}
          storeCount={stores.length}
        />
        
        <LocationContent 
          stores={stores}
          categories={categoryStats}
          locationName={location.name}
        />
        
        <NearbyLocations 
          locations={nearbyLocations}
          currentCity={location.city}
        />
        
        <LocationTrustStrip />
      </main>

      <MarketplaceFooter locationName={location.name} />
    </div>
  );
}
