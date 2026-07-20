import { ShieldCheck, Truck, MapPinCheck } from 'lucide-react';

export default function LocationTrustStrip() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified Local Brands',
      description:
        'Every business on our marketplace is verified for quality and reliability.',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
    {
      icon: Truck,
      title: 'Fast & Safe Delivery',
      description:
        'Our dedicated fleet ensures your items arrive safely and on time, every time.',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      icon: MapPinCheck,
      title: 'Real-time Tracking',
      description:
        'Watch your order travel from the store straight to your doorstep with live updates.',
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
    },
  ];

  return (
    <section className="bg-white pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 p-6 ${idx > 0 ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${feature.bg} ${feature.text}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div><h3 className="text-sm font-extrabold text-slate-900">{feature.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{feature.description}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
