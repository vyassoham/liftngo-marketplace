'use client';

import { Clock, MapPin, Phone, Mail, Tag, Info } from 'lucide-react';

interface StorefrontAboutProps {
  store: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    locality: string;
    city: string;
    phone: string;
    email: string;
    supportPhone: string;
    preparationLabel: string;
    minimumOrder: number;
    businessCategory: string | null;
  };
}

export default function StorefrontAbout({ store }: StorefrontAboutProps) {
  const hasContactInfo = store.phone || store.email || store.address;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          About {store.name}
        </h2>

        {store.description && (
          <p className="mt-3 text-gray-600 leading-relaxed">
            {store.description}
          </p>
        )}

        {/* Info grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<Clock className="h-5 w-5" />}
            label="Preparation Time"
            value={store.preparationLabel}
            color="#3B82F6"
          />

          <InfoCard
            icon={<Tag className="h-5 w-5" />}
            label="Minimum Order"
            value={`₹${store.minimumOrder}`}
            color="#10B981"
          />

          {(store.address || store.locality) && (
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={[store.address, store.landmark, store.locality, store.city]
                .filter(Boolean)
                .join(', ')}
              color="#F59E0B"
            />
          )}

          {store.phone && (
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              label="Store Phone"
              value={store.phone}
              href={`tel:${store.phone}`}
              color="#8B5CF6"
            />
          )}

          {store.email && (
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={store.email}
              href={`mailto:${store.email}`}
              color="#EC4899"
            />
          )}

          {store.businessCategory && (
            <InfoCard
              icon={<Info className="h-5 w-5" />}
              label="Category"
              value={store.businessCategory}
              color="#6B7280"
            />
          )}
        </div>

        {/* Support box */}
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Need Help with Your Order?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Contact Liftngo support at{' '}
                <a
                  href={`tel:${store.supportPhone}`}
                  className="font-bold text-orange-600 hover:underline"
                >
                  {store.supportPhone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({
  icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  color: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
      {href ? (
        <a href={href} className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
