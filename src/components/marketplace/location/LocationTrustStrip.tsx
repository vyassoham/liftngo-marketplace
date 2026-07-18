import { ShieldCheck, Truck, Clock } from 'lucide-react';

export default function LocationTrustStrip() {
  return (
    <section className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 text-center sm:grid-cols-3 sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Verified Local Brands</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Every business on our marketplace is personally vetted for quality and reliability.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Fast & Safe Delivery</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Our dedicated fleet ensures your items arrive safely and on time, every time.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Real-time Tracking</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Watch your order travel from the store straight to your doorstep with live updates.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
