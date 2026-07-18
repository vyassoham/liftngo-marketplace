'use client';

import { AlertCircle, X } from 'lucide-react';
import { useCartStore } from '@/store/marketplace/cart.store';

export default function StoreSwitchModal() {
  const { storeSwitchWarning, confirmStoreSwitch, cancelStoreSwitch } = useCartStore();

  if (!storeSwitchWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={cancelStoreSwitch}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={cancelStoreSwitch}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Switch Store?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your cart contains items from another store. Starting a new order will clear your current cart.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={cancelStoreSwitch}
            className="flex-1 rounded-full border border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Keep Current Cart
          </button>
          <button
            onClick={confirmStoreSwitch}
            className="flex-1 rounded-full bg-orange-500 py-2 font-medium text-white hover:bg-orange-600"
          >
            Switch Store
          </button>
        </div>
      </div>
    </div>
  );
}
