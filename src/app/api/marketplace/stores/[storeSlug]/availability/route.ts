import { NextResponse } from 'next/server';
import { getStoreAvailabilityBySlug } from '@/lib/marketplace/storefront';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storeSlug: string }> },
) {
  const { storeSlug } = await params;
  const availability = await getStoreAvailabilityBySlug(storeSlug);

  if (!availability) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  }

  return NextResponse.json(availability, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
