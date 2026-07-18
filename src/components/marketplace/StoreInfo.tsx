'use client';

import { Clock, MapPin, Phone, Info } from 'lucide-react';

interface StoreInfoProps {
  store: {
    name: string;
    description: string;
    minimumOrderAmount: number;
    preparationTime: string;
  };
}

export default function StoreInfo({ store }: StoreInfoProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">About {store.name}</h2>
        <p className="mt-4 text-gray-600">{store.description}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <Clock className="h-5 w-5 flex-shrink-0 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Preparation Time</h3>
              <p className="text-sm text-gray-600">{store.preparationTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <Info className="h-5 w-5 flex-shrink-0 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Minimum Order</h3>
              <p className="text-sm text-gray-600">₹{store.minimumOrderAmount}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <MapPin className="h-5 w-5 flex-shrink-0 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-sm text-gray-600">Malviya Nagar, Jaipur</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 flex-shrink-0 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Contact our support at{' '}
                <a href="tel:7891880088" className="font-medium text-orange-600 hover:underline">
                  7891880088
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
