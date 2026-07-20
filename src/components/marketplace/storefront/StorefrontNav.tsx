"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface StorefrontNavProps {
  categories: Category[];
  accentColor: string;
  allImageUrl: string | null;
}

export default function StorefrontNav({
  categories,
  accentColor,
  allImageUrl,
}: StorefrontNavProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      ) {
        setActiveCategory(categories.at(-1)?.id ?? "all");
        return;
      }

      const activationLine = window.innerWidth < 768 ? 140 : 190;
      for (let index = categories.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(
          `section-${categories[index].id}`,
        );
        if (section && section.getBoundingClientRect().top <= activationLine) {
          setActiveCategory(categories[index].id);
          return;
        }
      }
      setActiveCategory("all");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  useEffect(() => {
    const active = scrollRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    const section = document.getElementById(
      id === "all" ? "storefront-products" : `section-${id}`,
    );
    if (!section) return;
    const offset = window.innerWidth < 768 ? 126 : 170;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <nav className="sticky top-0 z-30 border-b border-[#eadfd5] bg-white/95 shadow-[0_8px_22px_rgba(71,45,23,.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 md:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto py-2 scrollbar-none md:gap-3 md:py-3"
        >
          <CategoryTile
            name="All"
            imageUrl={allImageUrl}
            active={activeCategory === "all"}
            accentColor={accentColor}
            onClick={() => scrollToSection("all")}
          />
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              active={activeCategory === category.id}
              accentColor={accentColor}
              onClick={() => scrollToSection(category.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function CategoryTile({
  name,
  imageUrl,
  active,
  accentColor,
  onClick,
}: {
  name: string;
  imageUrl: string | null;
  active: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      className="group flex h-[80px] w-[58px] shrink-0 flex-col items-center rounded-[14px] border bg-white px-1 pb-1 pt-1 text-center shadow-[0_7px_22px_rgba(60,38,20,.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_11px_28px_rgba(60,38,20,.11)] md:h-[132px] md:w-[106px] md:rounded-2xl md:px-2 md:pb-2.5 md:pt-2"
      style={{
        borderColor: active ? accentColor : "#eee4da",
        boxShadow: active ? `0 10px 28px ${accentColor}1f` : undefined,
      }}
      aria-pressed={active}
    >
      <span className="relative block h-[51px] w-full overflow-hidden rounded-[10px] bg-[#f8f1ea] md:h-[84px] md:rounded-xl">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 767px) 58px, 106px"
            className="object-contain p-0.5 transition duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[#a6978a]">
            <ImageIcon className="h-6 w-6" />
          </span>
        )}
      </span>
      <span
        className="mt-1 line-clamp-2 text-[8px] font-bold leading-[1.05] md:mt-2 md:text-xs md:leading-[1.15]"
        style={{ color: active ? accentColor : "#261c17" }}
      >
        {name}
      </span>
    </button>
  );
}
