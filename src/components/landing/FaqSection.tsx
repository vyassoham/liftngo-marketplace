'use client';

import Link from 'next/link';
import { HOMEPAGE_FAQ_PREVIEW } from '@/data/faq';
import FaqAccordionList from './FaqAccordionList';

export default function FaqSection() {
 return (
  <section id="faq" className="page-section w-full bg-white" aria-labelledby="faq-heading">
   <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
    <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight mb-2">
     Frequently asked questions
    </h2>
    <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">
     Quick answers to common questions
    </p>
    <FaqAccordionList items={HOMEPAGE_FAQ_PREVIEW} className="max-w-2xl" analyticsScope="homepage_faq" />
    <Link
     href="/faq"
     className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 "
    >
     View all FAQs
    </Link>
   </div>
  </section>
 );
}
