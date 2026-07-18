'use client';

import Link from 'next/link';
import { Zap, IndianRupee, MapPin, Clock, Shield, Truck } from 'lucide-react';

const FEATURES = [
 {
  icon: Zap,
  title: 'Book in 60 seconds',
  description: 'Enter locations, pick vehicle, confirm. No waiting.',
 },
 {
  icon: IndianRupee,
  title: 'Transparent pricing',
  description: 'See the fare upfront. No hidden charges or surprises.',
 },
 {
  icon: MapPin,
  title: 'Live tracking',
  description: 'Follow your delivery on the map from pickup to drop.',
 },
 {
  icon: Clock,
  title: 'On-time delivery',
  description: 'Drivers committed to delivering on schedule, every time.',
 },
 {
  icon: Shield,
  title: 'Verified drivers',
  description: 'Background-checked partners for your peace of mind.',
 },
 {
  icon: Truck,
  title: 'Right-sized vehicles',
  description: '2-wheeler to mini-truck — match vehicle to your cargo.',
 },
];

export default function QuickRidesSection() {
 return (
  <section
   id="why-liftngo"
   className="page-section w-full bg-[var(--landing-bg)]"
   aria-labelledby="why-liftngo-heading"
  >
   <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    <h2 id="why-liftngo-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
     Why Liftngo
    </h2>
    <p className="mt-2 text-gray-500 mb-10 sm:mb-12 text-sm sm:text-base max-w-lg">
     Fast, affordable, and reliable delivery for all your logistics needs
    </p>

    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
     {FEATURES.map((feature) => {
      const Icon = feature.icon;
      return (
       <div
        key={feature.title}
        className="flex gap-4 p-5 rounded-lg bg-white border border-gray-100 transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-lg hover:-translate-y-1"
       >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-700">
         <Icon className="w-5 h-5" />
        </div>
        <div>
         <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
          {feature.title}
         </h3>
         <p className="text-sm text-gray-500 leading-relaxed">
          {feature.description}
         </p>
        </div>
       </div>
      );
     })}
    </div>

    <div className="flex justify-center mt-10 sm:mt-12">
     <Link
      href="/pickup-location"
      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] "
     >
      Book your first delivery
     </Link>
    </div>
   </div>
  </section>
 );
}
