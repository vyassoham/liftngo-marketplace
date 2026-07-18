'use client';

import { useState, useMemo } from 'react';
import { Plus, Minus, ShoppingCart, Search, Package } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/marketplace/cart.store';
import { CartItem } from '@/lib/marketplace/schemas';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  inStock: boolean;
  preparationMinutes: number;
  maxQuantity: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  imageUrl: string | null;
}

interface StorefrontProductGridProps {
  products: Product[];
  categories: Category[];
  storeId: string;
  storeSlug: string;
  storeName: string;
  storeLogo: string;
  accentColor: string;
  isOpen: boolean;
  minimumOrder: number;
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  quantity,
  accentColor,
  isOpen,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  quantity: number;
  accentColor: string;
  isOpen: boolean;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 sm:h-48">
        {product.image && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-300">
            <Package className="h-12 w-12 text-gray-200" />
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow">
            {discount}% OFF
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-500 shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-inherit transition-colors sm:text-[15px]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3">
          {!isOpen ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-2.5 text-center text-xs font-semibold text-gray-400">
              Store Closed
            </div>
          ) : !product.inStock ? (
            <div className="rounded-xl border-2 border-red-100 bg-red-50 py-2.5 text-center text-xs font-bold text-red-500">
              Out of Stock
            </div>
          ) : quantity > 0 ? (
            <div
              className="flex items-center justify-between rounded-xl border-2 p-1.5"
              style={{ borderColor: accentColor, background: `${accentColor}0e` }}
            >
              <button
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform active:scale-95"
                style={{ background: accentColor }}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-extrabold text-gray-900 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={onIncrease}
                disabled={quantity >= product.maxQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform active:scale-95 disabled:opacity-50"
                style={{ background: accentColor }}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StorefrontProductGrid({
  products,
  categories,
  storeId,
  storeSlug,
  storeName,
  storeLogo,
  accentColor,
  isOpen,
  minimumOrder,
}: StorefrontProductGridProps) {
  const [search, setSearch] = useState('');
  const { cart, addToCart, updateQuantity } = useCartStore();

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getQuantity = (productId: string) => {
    if (!cart) return 0;
    return cart.items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAdd = (product: Product) => {
    const cartItem: CartItem = {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.image,
      unitPrice: product.price,
      quantity: 1,
      subtotal: product.price,
      tax: 0,
      total: product.price,
      variantId: undefined,
      variantName: undefined,
      selectedAddOns: [],
    };
    addToCart(cartItem, storeId, storeSlug, storeName, storeLogo);
  };

  // ── Filter + group ───────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, search]);

  // Build category groups (only categories with matching products)
  const grouped = useMemo(() => {
    const map = new Map<string, { category: Category; products: Product[] }>();

    for (const cat of categories) {
      const prods = filteredProducts.filter((p) => p.categoryId === cat.id);
      if (prods.length > 0) {
        map.set(cat.id, { category: cat, products: prods });
      }
    }

    // Products without a category go into "Other"
    const uncategorized = filteredProducts.filter(
      (p) => !p.categoryId || !categories.find((c) => c.id === p.categoryId)
    );
    if (uncategorized.length > 0) {
      map.set('__other', {
        category: { id: '__other', name: 'Other', slug: 'other', icon: null, imageUrl: null },
        products: uncategorized,
      });
    }

    return Array.from(map.values());
  }, [filteredProducts, categories]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

      {/* Search bar */}
      {products.length > 6 && (
        <div className="mb-8 relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${storeName}…`}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 transition-shadow"
            style={{ ['--tw-ring-color' as string]: `${accentColor}55` }}
          />
        </div>
      )}

      {/* Empty state */}
      {grouped.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-gray-700">No products found</h3>
          <p className="mt-1 text-sm text-gray-400">
            {search ? `No results for "${search}"` : 'This store has no active products yet'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ background: accentColor }}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Category sections */}
      {grouped.map(({ category, products: catProducts }, idx) => (
        <div
          key={category.id}
          id={`section-${category.id}`}
          className={idx > 0 ? 'mt-14 sm:mt-16' : ''}
        >
          {/* Section header */}
          <div className="mb-6 flex items-center gap-3">
            {category.icon && (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl shadow-sm"
                style={{ background: `${accentColor}18` }}
              >
                {category.icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                {category.name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {catProducts.length} item{catProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            {/* Divider line */}
            <div
              className="flex-1 h-px ml-2"
              style={{ background: `linear-gradient(90deg, ${accentColor}44, transparent)` }}
            />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {catProducts.map((product) => {
              const qty = getQuantity(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={qty}
                  accentColor={accentColor}
                  isOpen={isOpen}
                  onAdd={() => handleAdd(product)}
                  onIncrease={() => updateQuantity(product.id, qty + 1)}
                  onDecrease={() => updateQuantity(product.id, qty - 1)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Minimum order notice */}
      {minimumOrder > 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500">
            Minimum order amount:{' '}
            <span className="font-bold text-gray-800">₹{minimumOrder}</span>
          </p>
        </div>
      )}
    </section>
  );
}
