import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import CheckoutForm from '@/components/marketplace/CheckoutForm';
import { useCartStore } from '@/store/marketplace/cart.store';

export const metadata: Metadata = generatePageMetadata({
  title: 'Checkout | Malviya Nagar Marketplace',
  description: 'Complete your order from local Malviya Nagar businesses',
  path: '/checkout',
});

export default function CheckoutPage() {
  // This is a server component, so we can't use the store directly
  // The client component will handle the cart check
  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutForm />
    </div>
  );
}
