"use client";

import Image from "next/image";
import { CakeSlice, Coffee, Grid2X2, Hamburger, Store } from "lucide-react";
import type { ComponentType } from "react";
import type { CategoryStat } from "@/lib/marketplace/location";

export interface AllCategoryContent {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface LocationCategoryStripProps {
  categories: CategoryStat[];
  allCategory: AllCategoryContent;
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  totalStoreCount: number;
}

const ICON_BY_SLUG: Record<string, ComponentType<{ className?: string }>> = {
  all: Grid2X2,
  cafe: Coffee,
  "cafe-and-beverages": Coffee,
  "fast-food": Hamburger,
  desserts: CakeSlice,
};

interface CategoryCardData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  iconUrl: string | null;
  cardImageUrl: string;
  storeCount: number;
}

function CategoryIcon({ category }: { category: CategoryCardData }) {
  if (category.iconUrl) {
    return (
      <Image
        src={category.iconUrl}
        alt=""
        width={30}
        height={30}
        className="h-7 w-7 object-contain"
      />
    );
  }

  const Icon = ICON_BY_SLUG[category.slug] ?? Store;
  return <Icon className="h-7 w-7 stroke-[1.8]" />;
}

export default function LocationCategoryStrip({
  categories,
  allCategory,
  selectedCategory,
  onCategoryChange,
  totalStoreCount,
}: LocationCategoryStripProps) {
  const categoryCards: CategoryCardData[] = [
    {
      id: "all",
      slug: "all",
      name: allCategory.title,
      subtitle: allCategory.subtitle,
      iconUrl: null,
      cardImageUrl: allCategory.imageUrl,
      storeCount: totalStoreCount,
    },
    ...categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      subtitle: category.subtitle ?? "",
      iconUrl: category.icon_url,
      cardImageUrl: category.card_image_url ?? "",
      storeCount: category.store_count,
    })),
  ];

  return (
    <div className="overflow-x-auto px-4 pb-2 pt-4 [scrollbar-width:none] sm:px-6 sm:pt-6 [&::-webkit-scrollbar]:hidden">
      <div className="grid min-w-[1180px] grid-cols-4 gap-4 xl:min-w-0">
        {categoryCards.map((category) => {
          const selected = selectedCategory === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              aria-pressed={selected}
              aria-label={`${category.name}, ${category.storeCount} stores`}
              className={`group relative min-h-[112px] overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 motion-reduce:transition-none md:motion-safe:hover:-translate-y-1 ${
                selected
                  ? "border-orange-500 shadow-[0_14px_32px_rgba(249,115,22,0.14)]"
                  : "border-slate-200 hover:border-orange-200 hover:shadow-[0_16px_34px_rgba(15,23,42,0.09)]"
              }`}
            >
              {category.cardImageUrl ? (
                <Image
                  src={category.cardImageUrl}
                  alt=""
                  fill
                  priority={category.slug === "all"}
                  sizes="(max-width: 1279px) 295px, 25vw"
                  className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:motion-safe:group-hover:scale-[1.025]"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/0" />
              <div className="relative z-10 flex min-h-[112px] w-[68%] items-center gap-4 px-5 py-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    selected
                      ? "scale-[1.04] bg-orange-500 text-white"
                      : "scale-100 bg-orange-50 text-orange-600 md:group-hover:bg-orange-100"
                  }`}
                >
                  <CategoryIcon category={category} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-extrabold text-[#071632]">
                    {category.name}
                  </span>
                  {category.subtitle ? (
                    <span className="mt-1 block truncate text-xs font-medium text-slate-500">
                      {category.subtitle}
                    </span>
                  ) : null}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
