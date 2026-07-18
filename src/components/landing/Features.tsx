'use client';

import { MapPin, Truck, Package, Navigation, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    icon: MapPin,
    title: 'Enter pickup & drop',
    description: 'Open the app, set your pickup address and destination.',
  },
  {
    icon: Truck,
    title: 'Choose your vehicle',
    description: 'Pick 2-wheeler, 3-wheeler, or mini-truck based on cargo size.',
  },
  {
    icon: Package,
    title: 'Driver picks up goods',
    description: 'A nearby driver arrives at your location. Hand over goods securely.',
  },
  {
    icon: Navigation,
    title: 'Track in real-time',
    description: 'Follow your delivery live on the map until it arrives.',
  },
  {
    icon: CheckCircle,
    title: 'Delivered',
    description: 'Goods arrive at the destination. Get confirmation and receipt.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="page-section w-full bg-[var(--landing-bg)]"
      aria-labelledby="features-heading"
    >
      <div className="w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
          How it works
        </h2>
        <p className="mt-2 text-gray-500 mb-10 sm:mb-12 text-sm sm:text-base">
          Book your delivery in 5 simple steps
        </p>

        <div className="mx-auto max-w-2xl">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <div key={s.title} className="flex gap-4">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gray-900 text-white font-medium text-sm sm:h-11 sm:w-11">
                    {i + 1}
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 min-h-[32px] bg-gray-200 my-1.5" aria-hidden />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-gray-100 text-gray-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 sm:text-base">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed ml-11">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
