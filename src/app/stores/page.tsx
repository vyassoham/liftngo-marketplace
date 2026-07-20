import { Header, PageWrapper } from '@/components/landing';
import StoresDirectory from '@/components/marketplace/StoresDirectory';
import { getMarketplaceStores } from '@/lib/marketplace/storefront';

export const metadata = {
  title: 'Stores',
  description: 'Discover local stores available for delivery with Liftngo.',
};

export default async function StoresPage() {
  const stores = await getMarketplaceStores();

  return (
    <PageWrapper headerSlot={<Header />}>
      <main className="min-h-screen bg-[#fffdf9] pb-16">
        <StoresDirectory stores={stores} />
      </main>
    </PageWrapper>
  );
}
