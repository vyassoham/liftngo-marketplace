'use client';

import Link from 'next/link';
import { Package, CalendarClock, RefreshCw, Building2, Users, Headphones } from 'lucide-react';

const SERVICES = [
  { id: 'single', label: 'Single Delivery', description: 'One-time pickup and drop', icon: Package, href: '/pickup-location' },
  { id: 'rent', label: 'Rent', description: 'Short-term vehicle rental', icon: CalendarClock, href: '/plans/rent' },
  { id: 'subscribe', label: 'Subscribe', description: 'Monthly delivery plans', icon: RefreshCw, href: '/plans/subscription' },
  { id: 'lease', label: 'Lease', description: 'Long-term vehicle leasing', icon: Building2, href: '/plans/lease' },
  { id: 'dedicated', label: 'Dedicated Fleet', description: 'Vehicles for your business', icon: Users, href: '/plans/custom' },
  { id: 'expert', label: 'Expert Support', description: 'Talk to our logistics team', icon: Headphones, href: '/contact' },
];

export default function ServiceSection() {
  return (
    <section
      id="service"
      className="page-section w-full bg-white"
      aria-labelledby="service-heading"
    >
      <div className="w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="service-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
          Our services
        </h2>
        <p className="mt-2 text-gray-500 mb-10 sm:mb-12 text-sm sm:text-base">
          Choose the option that fits your needs
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.id}
                href={s.href}
                className="group flex flex-col items-center p-4 sm:p-5 rounded-lg bg-white border border-gray-100 text-center transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
              >
                <div className="grid h-12 w-12 place-items-center rounded-md bg-gray-100 text-gray-700 mb-3 sm:h-14 sm:w-14 transition-colors duration-300 ease-out group-hover:bg-gray-200 group-hover:text-gray-900">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  {s.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug">
                  {s.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
