'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Navigation,
  Phone,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/store/marketplace/cart.store';
import { validateCustomerAddress, validatePhoneNumber } from '@/lib/marketplace/utils/validation';
import { useRazorpay } from '@/lib/razorpay';

type PaymentMethodType = 'upi' | 'cards' | 'cod';

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { openPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    houseNumber: '',
    addressLine: '',
    landmark: '',
    deliveryInstructions: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deliveryQuote, setDeliveryQuote] = useState<{ fee: number; eta: string } | null>(null);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push('/malviya-nagar');
    }
  }, [cart, router]);

  const handleGetLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationLoading(false);

        // Mock delivery quote
        setDeliveryQuote({
          fee: 40,
          eta: '25-30 min',
        });
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enter your address manually.');
        setLocationLoading(false);
      }
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House number is required';
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Address is required';
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      newErrors.location = 'Please provide your location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const totalAmount = cart.total + (deliveryQuote?.fee || 0);
    const trackingToken = `LNG${Date.now().toString().slice(-6)}`;

    // If Cash on Delivery is selected
    if (paymentMethod === 'cod') {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        clearCart();
        router.push(`/order/${trackingToken}?payment=cod`);
      } catch (err) {
        setErrors({ form: 'Failed to place COD order. Please try again.' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online / UPI payment via Razorpay
    try {
      openPayment({
        amountInr: totalAmount,
        receipt: `store_${Date.now()}`,
        description: `Order from ${cart.storeName} (${cart.items.length} items)`,
        preferredMethod: paymentMethod === 'upi' ? 'upi' : 'card',
        notes: {
          flow: 'marketplace_store',
          storeSlug: cart.storeSlug,
          storeName: cart.storeName,
          paymentMethod,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: `${formData.houseNumber}, ${formData.addressLine}`,
        },
        prefill: {
          name: formData.name,
          contact: formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone}`,
        },
        onSuccess: ({ paymentId, orderId }) => {
          clearCart();
          router.push(`/order/${orderId || trackingToken}?paymentId=${paymentId}`);
        },
        onError: (err) => {
          setLoading(false);
          if (err === 'Payment cancelled') {
            return;
          }
          console.warn('[Checkout] Payment error:', err);
          setErrors({
            form: `Payment Error: ${err}. You can also choose Cash on Delivery (COD) to place your order now.`,
          });
        },
      });
    } catch (err: any) {
      setLoading(false);
      setErrors({
        form: err?.message || 'Unable to initialize online payment. Please try Cash on Delivery.',
      });
    }
  };

  if (!cart) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const totalWithDelivery = cart.total + (deliveryQuote?.fee || 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-gray-600">Complete your order from {cart.storeName}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Address */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <MapPin className="h-5 w-5 text-orange-600" />
                Delivery Address
              </h2>

              {/* Get Location Button */}
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-orange-500 bg-orange-50 py-3 font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-50"
              >
                <Navigation className="h-5 w-5" />
                {locationLoading ? 'Getting Location...' : 'Use Current Location'}
              </button>

              {locationError && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{locationError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">
                    House/Flat Number *
                  </label>
                  <input
                    type="text"
                    id="houseNumber"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter house/flat number"
                  />
                  {errors.houseNumber && <p className="mt-1 text-sm text-red-600">{errors.houseNumber}</p>}
                </div>

                <div>
                  <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700">
                    Address Line *
                  </label>
                  <input
                    type="text"
                    id="addressLine"
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter street address"
                  />
                  {errors.addressLine && <p className="mt-1 text-sm text-red-600">{errors.addressLine}</p>}
                </div>

                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Nearby landmark"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any special instructions for delivery"
                  />
                </div>

                {formData.latitude !== 0 && formData.longitude !== 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
                  </div>
                )}

                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center justify-between text-xl font-semibold text-gray-900">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Select Payment Method
                </span>
                <span className="flex items-center gap-1 text-xs font-normal text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  100% Secure Checkout
                </span>
              </h2>

              <div className="space-y-3">
                {/* 1. UPI Payment Option (Default / Primary) */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">UPI</span>
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            Fastest & Zero Fee
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-600">
                          Google Pay, PhonePe, Paytm, BHIM, CRED & any UPI App / QR
                        </p>
                        {/* UPI Brand Badges */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                          <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-gray-700 shadow-xs">
                            GPay
                          </span>
                          <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-purple-700 shadow-xs">
                            PhonePe
                          </span>
                          <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-700 shadow-xs">
                            Paytm
                          </span>
                          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800 shadow-xs">
                            BHIM UPI
                          </span>
                          <span className="rounded-md border border-orange-200 bg-orange-100/60 px-2 py-0.5 text-orange-800 shadow-xs">
                            Scan QR
                          </span>
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                        <CheckCircle className="h-4 w-4" />
                        Selected
                      </span>
                    )}
                  </div>
                </label>

                {/* 2. Cards & NetBanking */}
                <label
                  onClick={() => setPaymentMethod('cards')}
                  className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === 'cards'
                      ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cards"
                        checked={paymentMethod === 'cards'}
                        onChange={() => setPaymentMethod('cards')}
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">Cards & Net Banking</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-600">
                          Visa, MasterCard, RuPay Debit/Credit Cards & Net Banking via Razorpay
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'cards' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                        <CheckCircle className="h-4 w-4" />
                        Selected
                      </span>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">Cash on Delivery (Pay on Delivery)</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-600">
                          Pay cash or scan UPI QR code with delivery partner upon arrival
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                        <CheckCircle className="h-4 w-4" />
                        Selected
                      </span>
                    )}
                  </div>
                </label>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                🔒 All transactions are encrypted and secured with RBI-compliant payment standard.
              </p>
            </div>

            {errors.form && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{errors.form}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange-500 py-4 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'upi'
                  ? `Pay ₹${totalWithDelivery} via UPI`
                  : paymentMethod === 'cards'
                    ? `Pay ₹${totalWithDelivery} Online`
                    : `Place Order (Cash on Delivery) • ₹${totalWithDelivery}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Summary</h2>

            {/* Store Info */}
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={cart.storeLogo}
                  alt={cart.storeName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{cart.storeName}</p>
                <p className="text-sm text-gray-500">{cart.items.length} items</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">₹{item.total}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{cart.discount}</span>
                </div>
              )}
              {cart.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{cart.tax}</span>
                </div>
              )}
              {deliveryQuote && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryQuote.fee}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{totalWithDelivery}</span>
              </div>
            </div>

            {/* Delivery Info */}
            {deliveryQuote && (
              <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-orange-700">
                  <Navigation className="h-4 w-4" />
                  <span className="font-medium">Estimated Delivery: {deliveryQuote.eta}</span>
                </div>
                <p className="mt-1 text-orange-600">by Liftngo</p>
              </div>
            )}

            {/* Help */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
              <p className="font-medium text-gray-900">Need Help?</p>
              <p className="text-gray-600">
                Call us at{' '}
                <a href="tel:7891880088" className="font-medium text-orange-600 hover:underline">
                  7891880088
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
