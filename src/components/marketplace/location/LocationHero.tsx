import Image from 'next/image';

interface LocationHeroProps {
  locationName: string;
  description?: string;
  heroImageUrl?: string;
  storeCount: number;
}

export default function LocationHero({ 
  locationName, 
  description, 
  heroImageUrl, 
  storeCount 
}: LocationHeroProps) {
  // Use a sensible default image if none provided
  const bgImage = heroImageUrl || 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=1920&h=600&fit=crop';
  
  const displayDescription = description || 
    `Discover the best food, fashion, and local services in ${locationName}. Top-rated brands delivered fast by Liftngo.`;

  return (
    <section className="relative overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={`${locationName} overview`}
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Softer, more premium gradient than previous simple black overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 text-center sm:text-left">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400 ring-1 ring-inset ring-orange-500/20 backdrop-blur-sm mb-4">
            📍 Liftngo Marketplace
          </span>
          
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {locationName}
          </h1>
          
          <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg lg:text-xl">
            {displayDescription}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center sm:justify-start">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">{storeCount}</span>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Active Brands</span>
            </div>
            
            <div className="hidden sm:block h-10 w-px bg-gray-700" />
            
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">⚡</span>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
