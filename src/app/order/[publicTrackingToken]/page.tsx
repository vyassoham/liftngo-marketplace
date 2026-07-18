import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import OrderTracking from '@/components/marketplace/OrderTracking';

interface OrderTrackingPageProps {
  params: {
    publicTrackingToken: string;
  };
}

export async function generateMetadata({ params }: OrderTrackingPageProps): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Track Your Order | Malviya Nagar Marketplace',
    description: 'Track your order status in real-time',
    path: `/order/${params.publicTrackingToken}`,
  });
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  // Validate tracking token format
  if (!params.publicTrackingToken || params.publicTrackingToken.length < 8) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderTracking trackingToken={params.publicTrackingToken} />
    </div>
  );
}
