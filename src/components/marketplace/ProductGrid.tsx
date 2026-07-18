'use client';

import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/marketplace/cart.store';
import { CartItem } from '@/lib/marketplace/schemas';

interface ProductGridProps {
  products: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    price: number;
    originalPrice?: number;
    categoryId: string;
    inStock: boolean;
    featured: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string;
  }>;
  storeSlug: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
}

export default function ProductGrid({ products, categories, storeSlug, storeId, storeName, storeLogo }: ProductGridProps) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCartStore();

  const getCartItemQuantity = (productId: string) => {
    if (!cart) return 0;
    return cart.items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddToCart = (product: any) => {
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

  // Group products by category
  const groupedProducts = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        category,
        products: categoryProducts
      };
    }
    return acc;
  }, {} as Record<string, { category: typeof categories[0]; products: typeof products }>);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mb-8 text-center sm:mb-12">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl xl:text-5xl tracking-tight">
          Our Menu
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:mt-4 sm:text-base sm:text-lg max-w-2xl mx-auto">
          Explore our delicious offerings organized by category
        </p>
      </div>

      {Object.entries(groupedProducts).map(([categoryId, { category, products: categoryProducts }], index) => (
        <div key={categoryId} className={index > 0 ? 'mt-12 sm:mt-16' : ''}>
          {/* Category Header */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl shadow-lg sm:h-16 sm:w-16 sm:rounded-2xl sm:text-3xl">
              {category.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => {
              const quantity = getCartItemQuantity(product.id);
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 sm:h-48">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-lg sm:top-3 sm:left-3 sm:px-3 sm:py-1.5">
                        {discount}% OFF
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-2 right-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1.5">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 sm:p-5">
                    <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 sm:text-lg">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 sm:mt-2 sm:text-sm">{product.description}</p>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2 sm:mt-4">
                      <span className="text-xl font-bold text-gray-900 sm:text-2xl">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through sm:text-sm">₹{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    {product.inStock ? (
                      quantity > 0 ? (
                        <div className="mt-3 flex items-center justify-between rounded-xl border-2 border-orange-500 bg-orange-50 p-2 sm:mt-4">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all sm:h-9 sm:w-9"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-base font-bold text-gray-900 sm:text-lg">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all sm:h-9 sm:w-9"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 sm:mt-4 sm:py-3 sm:text-base"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <div className="mt-3 rounded-xl border-2 border-red-200 bg-red-50 py-2.5 text-center text-xs font-bold text-red-600 sm:mt-4 sm:py-3 sm:text-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
