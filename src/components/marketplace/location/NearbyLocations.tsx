import Link from 'next/link';
import { LocationData } from '@/lib/marketplace/location';
import { MapPin } from 'lucide-react';

interface NearbyLocationsProps {
  locations: LocationData[];
  currentCity: string;
}

export default function NearbyLocations({ locations, currentCity }: NearbyLocationsProps) {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="bg-white border-t border-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Explore more in {currentCity}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Discover marketplace locations near you
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/locations/${location.slug}`}
              className="group flex flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white p-5 hover:border-orange-200 hover:bg-orange-50/50 transition-all hover:-translate-y-1 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-900 transition-colors">
                  {location.name}
                </h3>
                <span className="mt-1 block text-xs font-medium text-gray-500">
                  View Stores &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
