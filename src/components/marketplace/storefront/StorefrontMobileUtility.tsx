"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Bike,
  Headphones,
  House,
  Package,
  ShoppingCart,
  Tag,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useCartStore } from "@/store/marketplace/cart.store";

const trustItems = [
  { icon: Bike, title: "Fast Delivery", subtitle: "On time, every time" },
  { icon: BadgeCheck, title: "Best Quality", subtitle: "Fresh & hygienic" },
  {
    icon: WalletCards,
    title: "No Hidden Charges",
    subtitle: "Transparent pricing",
  },
  { icon: Headphones, title: "24/7 Support", subtitle: "We are here to help" },
];

export default function StorefrontMobileUtility() {
  const { cart, setCartOpen } = useCartStore();
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const openCart = () => {
    if (cart) {
      setCartOpen(true);
      return;
    }
    document
      .getElementById("storefront-products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pb-24 md:hidden">
      <section
        aria-label="LiftNgo marketplace benefits"
        className="mx-3 grid grid-cols-4 divide-x divide-[#ece3da] overflow-hidden rounded-[18px] border border-[#eadfd5] bg-white px-1 py-3 shadow-[0_8px_24px_rgba(70,43,23,.08)]"
      >
        {trustItems.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="flex min-w-0 flex-col items-center px-1 text-center"
          >
            <Icon
              className="h-[18px] w-[18px] text-[#ff5a00]"
              aria-hidden="true"
            />
            <span className="mt-1 truncate text-[8px] font-black text-[#251b16]">
              {title}
            </span>
            <span className="mt-0.5 line-clamp-2 text-[7px] leading-[1.15] text-[#887a6f]">
              {subtitle}
            </span>
          </div>
        ))}
      </section>

      <nav
        aria-label="Storefront mobile navigation"
        className="fixed inset-x-3 bottom-2 z-40 grid h-[68px] grid-cols-5 rounded-[28px] border border-[#e8dfd6] bg-white/95 px-2 shadow-[0_14px_38px_rgba(44,31,22,.18)] backdrop-blur-xl"
      >
        <MobileNavLink
          href="/locations/malviya-nagar"
          icon={House}
          label="Home"
          active
        />
        <MobileNavLink href="/history" icon={Package} label="Orders" />
        <button
          type="button"
          onClick={openCart}
          className="relative flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] font-bold text-[#302923]"
        >
          <span className="relative">
            <ShoppingCart className="h-[22px] w-[22px]" aria-hidden="true" />
            {cartCount > 0 ? (
              <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff5a00] px-1 text-[9px] font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </span>
          Cart
        </button>
        <MobileNavLink
          href="/offers/first-business-delivery-free"
          icon={Tag}
          label="Offers"
        />
        <MobileNavLink href="/my-details" icon={UserRound} label="Account" />
      </nav>
    </div>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: typeof House;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] font-bold ${
        active ? "text-[#ff5a00]" : "text-[#302923]"
      }`}
    >
      <Icon
        className={`h-[22px] w-[22px] ${active ? "fill-current" : ""}`}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}
