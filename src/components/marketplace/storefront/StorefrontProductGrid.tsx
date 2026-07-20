"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Heart,
  ImageIcon,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/marketplace/cart.store";
import type { CartItem } from "@/lib/marketplace/schemas";
import { useStoreAvailability } from "./StoreAvailabilityProvider";

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
  minimumOrder: number;
}

type SortMode = "recommended" | "price-asc" | "price-desc";

export default function StorefrontProductGrid({
  products,
  categories,
  storeId,
  storeSlug,
  storeName,
  storeLogo,
  accentColor,
  minimumOrder,
}: StorefrontProductGridProps) {
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const { cart, addToCart, updateQuantity } = useCartStore();
  const availability = useStoreAvailability();

  const getQuantity = (productId: string) =>
    cart?.items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleAdd = (product: Product) => {
    if (!availability.canOrder || !product.inStock) return;
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

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (availableOnly && !product.inStock) return false;
      return (
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });

    if (sortMode === "price-asc")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sortMode === "price-desc")
      return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [availableOnly, products, search, sortMode]);

  const grouped = useMemo(() => {
    const groups = categories.flatMap((category) => {
      const categoryProducts = visibleProducts.filter(
        (product) => product.categoryId === category.id,
      );
      return categoryProducts.length
        ? [{ category, products: categoryProducts }]
        : [];
    });

    const uncategorized = visibleProducts.filter(
      (product) =>
        !categories.some((category) => category.id === product.categoryId),
    );
    if (uncategorized.length) {
      groups.push({
        category: { id: "__menu", name: "Menu", slug: "menu", imageUrl: null },
        products: uncategorized,
      });
    }
    return groups;
  }, [categories, visibleProducts]);

  return (
    <section
      id="storefront-products"
      className="mx-auto max-w-7xl scroll-mt-40 px-3 py-4 md:px-6 md:py-9 lg:px-8"
    >
      {!availability.canOrder ? (
        <div
          role="status"
          className="mb-4 flex items-start gap-2.5 rounded-[16px] border border-slate-200 bg-slate-100 px-3 py-3 text-slate-700 md:mb-6 md:items-center md:gap-3 md:rounded-2xl md:px-5 md:py-3.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 md:h-10 md:w-10">
            <Clock3 className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-xs font-extrabold md:text-sm">
              {availability.nextOpenLabel ?? "This store is currently closed"}
            </p>
            <p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-500 md:text-sm">
              The menu remains available to browse; ordering resumes when the
              store opens.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_76px_48px] gap-2 md:mb-8 md:grid-cols-[minmax(0,1fr)_240px_54px] md:gap-3">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9a8b7e] md:left-4 md:h-5 md:w-5" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search in ${storeName}…`}
            className="h-12 w-full rounded-[13px] border border-[#e6ddd4] bg-white pl-10 pr-3 text-[12px] font-medium text-[#211713] shadow-sm outline-none transition placeholder:text-[#a99d93] focus:border-transparent focus:ring-2 md:h-[54px] md:rounded-xl md:pl-12 md:pr-4 md:text-sm"
            style={{ ["--tw-ring-color" as string]: `${accentColor}4d` }}
          />
        </label>

        <label className="relative hidden md:block">
          <span className="sr-only">Sort products</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-[54px] w-full appearance-none rounded-xl border border-[#e6ddd4] bg-white px-4 pr-11 text-sm font-bold text-[#2b211c] shadow-sm outline-none focus:border-transparent focus:ring-2"
            style={{ ["--tw-ring-color" as string]: `${accentColor}4d` }}
          >
            <option value="recommended">Sort by: Recommended</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65584e]" />
        </label>

        <label className="relative block md:hidden">
          <span className="sr-only">Sort products</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-12 w-full appearance-none rounded-[13px] border border-[#e6ddd4] bg-white px-3 pr-8 text-[12px] font-black text-[#2b211c] shadow-sm outline-none focus:border-transparent focus:ring-2"
            style={{ ["--tw-ring-color" as string]: `${accentColor}4d` }}
          >
            <option value="recommended">Sort</option>
            <option value="price-asc">Low-high</option>
            <option value="price-desc">High-low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65584e]" />
        </label>

        <button
          type="button"
          aria-label="Show available products only"
          aria-pressed={availableOnly}
          onClick={() => setAvailableOnly((value) => !value)}
          className="flex h-12 items-center justify-center rounded-[13px] border bg-white shadow-sm transition hover:bg-[#fff7ef] md:h-[54px] md:rounded-xl"
          style={{
            borderColor: availableOnly ? accentColor : "#e6ddd4",
            color: availableOnly ? accentColor : "#5f5248",
          }}
        >
          <SlidersHorizontal className="h-[18px] w-[18px]" />
        </button>
      </div>

      {!grouped.length ? (
        <div className="rounded-2xl border border-[#e8dfd6] bg-white px-6 py-20 text-center shadow-sm">
          <h2 className="text-lg font-extrabold text-[#251b16]">
            No products found
          </h2>
          <p className="mt-1 text-sm text-[#8b7d72]">
            {search
              ? `No results for “${search}”`
              : "No active products are available."}
          </p>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-full px-4 py-2 text-sm font-bold text-white"
              style={{ background: accentColor }}
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : null}

      {grouped.map(({ category, products: categoryProducts }, index) => (
        <div
          key={category.id}
          id={`section-${category.id}`}
          className={`scroll-mt-44 ${index ? "mt-9 md:mt-14" : ""}`}
        >
          <div className="mb-3.5 flex items-end gap-3 md:mb-5 md:gap-4">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#17110e] md:text-2xl">
                {category.name}
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold text-[#95877b] md:mt-1 md:text-xs">
                {categoryProducts.length} item
                {categoryProducts.length === 1 ? "" : "s"}
              </p>
            </div>
            <div
              className="mb-2 h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${accentColor}a8, transparent)`,
              }}
            />
            <button
              type="button"
              onClick={() =>
                setExpandedCategories((current) => {
                  const next = new Set(current);
                  if (next.has(category.id)) next.delete(category.id);
                  else next.add(category.id);
                  return next;
                })
              }
              className="mb-0.5 inline-flex items-center gap-1 text-[12px] font-black md:hidden"
              style={{ color: accentColor }}
            >
              {expandedCategories.has(category.id) ? "Show less" : "View all"}
              <ChevronRight
                className={`h-4 w-4 transition ${
                  expandedCategories.has(category.id) ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product, productIndex) => {
              const quantity = getQuantity(product.id);
              return (
                <div
                  key={product.id}
                  className={
                    productIndex >= 4 && !expandedCategories.has(category.id)
                      ? "hidden md:block"
                      : ""
                  }
                >
                  <ProductCard
                    product={product}
                    quantity={quantity}
                    accentColor={accentColor}
                    canOrder={availability.canOrder}
                    onAdd={() => handleAdd(product)}
                    onIncrease={() => {
                      if (availability.canOrder)
                        updateQuantity(product.id, quantity + 1);
                    }}
                    onDecrease={() => updateQuantity(product.id, quantity - 1)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {minimumOrder > 0 ? (
        <p className="mt-9 rounded-xl border border-dashed border-[#dfd4c8] bg-[#fffaf5] px-4 py-3 text-center text-sm font-medium text-[#786a5e]">
          Minimum order amount:{" "}
          <strong className="text-[#2b211c]">₹{minimumOrder}</strong>
        </p>
      ) : null}
    </section>
  );
}

function ProductCard({
  product,
  quantity,
  accentColor,
  canOrder,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  quantity: number;
  accentColor: string;
  canOrder: boolean;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[17px] border border-[#eadfd5] bg-white shadow-[0_8px_24px_rgba(70,43,23,.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(70,43,23,.13)] md:rounded-[20px] md:shadow-[0_10px_32px_rgba(70,43,23,.07)]">
      <div className="relative aspect-[1.6] overflow-hidden bg-[#f6eee6] md:aspect-[4/3]">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (min-width: 1280px) 290px, (min-width: 1024px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#b5a89c]">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {discount > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
            {discount}% OFF
          </span>
        ) : null}
        {!product.inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-slate-600 shadow">
              Out of stock
            </span>
          </div>
        ) : null}
        <button
          type="button"
          aria-label={
            favorite
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
          aria-pressed={favorite}
          onClick={() => setFavorite((value) => !value)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#675b51] shadow-md backdrop-blur transition active:scale-95 md:hidden"
        >
          <Heart
            className={`h-4 w-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2.5 md:p-4">
        <h3 className="line-clamp-2 text-[13px] font-black leading-[1.2] tracking-[-0.015em] text-[#241a15] md:text-base md:leading-snug">
          {product.name}
        </h3>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-[10px] leading-[1.35] text-[#786b61] md:mt-1.5 md:text-sm md:leading-5">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-baseline gap-1.5 pt-2 md:gap-2 md:pt-4">
          <span
            className="text-[18px] font-black md:text-xl"
            style={{ color: accentColor }}
          >
            ₹{product.price}
          </span>
          {product.originalPrice ? (
            <span className="text-[10px] font-medium text-[#aa9d92] line-through md:text-sm">
              ₹{product.originalPrice}
            </span>
          ) : null}
        </div>

        <div className="mt-2 md:mt-3">
          {!canOrder ? (
            <div className="rounded-[10px] border border-slate-200 bg-slate-100 py-2 text-center text-[10px] font-bold text-slate-500 md:rounded-xl md:py-2.5 md:text-xs">
              Ordering closed
            </div>
          ) : !product.inStock ? (
            <div className="rounded-[10px] border border-slate-200 bg-slate-50 py-2 text-center text-[10px] font-bold text-slate-500 md:rounded-xl md:py-2.5 md:text-xs">
              Out of stock
            </div>
          ) : quantity > 0 ? (
            <div
              className="flex items-center justify-between rounded-xl border p-1.5"
              style={{
                borderColor: accentColor,
                background: `${accentColor}0d`,
              }}
            >
              <button
                type="button"
                onClick={onDecrease}
                aria-label={`Remove one ${product.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition active:scale-95"
                style={{ background: accentColor }}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-black tabular-nums text-[#241a15]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= product.maxQuantity}
                aria-label={`Add one more ${product.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition active:scale-95 disabled:opacity-40"
                style={{ background: accentColor }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="flex w-full items-center justify-center gap-1.5 rounded-[10px] py-2 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,90,0,.22)] transition hover:brightness-105 active:scale-[.99] md:gap-2 md:rounded-xl md:py-2.5 md:text-sm"
              style={{ background: accentColor }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
