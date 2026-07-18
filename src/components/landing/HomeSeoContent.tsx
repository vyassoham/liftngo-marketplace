import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const SEO_LINKS: { href: string; label: string }[] = [
  { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji logistics' },
  { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida B2B logistics' },
  { href: '/logistics-khatu', label: 'Logistics in Khatu' },
  { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport India' },
  { href: ROUTES.FARE_CALCULATOR, label: 'Fare calculator' },
  { href: ROUTES.FLEET_BRANDING, label: 'Fleet branding' },
  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
  { href: '/services', label: 'Services (2W–4W)' },
  { href: '/same-day-delivery-khatu', label: 'Same day delivery Khatu' },
  { href: '/hyperlocal-delivery-service', label: 'Hyperlocal delivery' },
  { href: '/whatsapp-delivery-service', label: 'WhatsApp delivery' },
  { href: '/b2b-logistics-rajasthan', label: 'B2B logistics Rajasthan' },
  { href: '/hotel-logistics-partner', label: 'Hotel logistics partner' },
  { href: '/restaurant-delivery-partner', label: 'Restaurant delivery' },
  { href: ROUTES.CONTACT, label: 'Contact & support' },
];

/** SEO internal links section — visible for users and crawlers, visually subtle. */
export default function HomeSeoContent() {
  return (
    <section
      className="py-10 sm:py-12 border-t border-gray-100 bg-[var(--landing-bg)]"
      aria-labelledby="seo-intro-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Where we operate
          </p>
          <h2
            id="seo-intro-heading"
            className="text-lg font-bold text-gray-900 sm:text-xl mb-3"
          >
            Khatu Shyam Ji hyperlocal · Noida &amp; Delhi NCR B2B
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Liftngo delivers reliable{' '}
            <strong className="font-medium text-gray-700">logistics in Khatu Shyam Ji</strong> for vendors, food outlets, and shops, and{' '}
            <strong className="font-medium text-gray-700">B2B logistics in Noida</strong> &amp; the wider{' '}
            <strong className="font-medium text-gray-700">Delhi NCR</strong> corridor.
          </p>

          <nav
            className="flex flex-wrap gap-2"
            aria-label="Key service pages"
          >
            {SEO_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
