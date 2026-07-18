import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { SITE_NAME } from '@/lib/site';
import { Building2, MapPin, Leaf, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Khatu Shyam Ji delivery',
    description: 'Temple-town logistics with patience at narrow gates, transparent pricing during festivals.',
    link: ROUTES.KHATU_SHYAM_LOGISTICS,
    linkText: 'Learn more',
  },
  {
    icon: Building2,
    title: 'B2B logistics — Delhi NCR',
    description: 'Supplier-park shuttles, retail backhaul, and document sprints across Noida and NCR.',
    link: ROUTES.NOIDA_B2B_LOGISTICS,
    linkText: 'Learn more',
  },
  {
    icon: Leaf,
    title: 'EV & smart vehicle choice',
    description: 'Electric cargo when charging fits. Conventional fuel for gradients and peak loads.',
    link: '/services',
    linkText: 'View services',
  },
];

export default function HomeDeepAuthoritySection() {
  return (
    <section
      className="page-section bg-white"
      aria-labelledby="home-authority-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="home-authority-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
          Built for businesses like yours
        </h2>
        <p className="mt-2 text-gray-500 max-w-lg text-sm sm:text-base mb-10 sm:mb-12">
          Focused on <strong className="text-gray-700 font-semibold">intra-city cargo</strong>, not passenger rides. Pick the right vehicle, see estimates upfront, and complete every handoff reliably.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-[var(--landing-bg)] rounded-xl p-5 sm:p-6 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{feature.description}</p>
                <Link 
                  href={feature.link} 
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-light)]"
                >
                  {feature.linkText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
