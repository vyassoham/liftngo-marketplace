'use client';

import Link from 'next/link';
import { Calculator, ArrowRight, Store, Truck } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const QUICK_SERVICES = [
  {
    id: 'jaipur-marketplace',
    title: 'Jaipur Marketplace',
    description: '50+ local businesses in Malviya Nagar — food, fashion, and more.',
    icon: Store,
    href: '/malviya-nagar',
  },
  {
    id: 'fare-calculator',
    title: 'Fare Calculator',
    description: 'Get an estimated delivery fare before you book.',
    icon: Calculator,
    href: ROUTES.FARE_CALCULATOR,
  },
  {
    id: 'fleet-branding',
    title: 'Fleet Branding',
    description: 'Advertise your brand on Liftngo vehicles across Delhi NCR.',
    icon: Truck,
    href: ROUTES.FLEET_BRANDING,
  },
];

export default function QuickServicesSection() {
  return (
    <section
      id="quick-services"
      className="page-section w-full bg-white"
      aria-labelledby="quick-services-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2
            id="quick-services-heading"
            className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight"
          >
            Quick access
          </h2>
          <p className="mt-2 text-gray-500 max-w-lg text-sm sm:text-base">
            Popular tools and services to get you started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {QUICK_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg hover:bg-white"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-700 transition-colors duration-300 ease-out group-hover:bg-gray-200 group-hover:text-gray-900">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-300 ease-out group-hover:text-[var(--color-primary)] sm:text-base">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-all duration-300 ease-out group-hover:text-[var(--color-primary)] group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
