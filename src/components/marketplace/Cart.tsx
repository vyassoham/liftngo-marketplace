"use client";

import { X, Plus, Minus, ShoppingBag, Trash2, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/marketplace/cart.store";
import { useEffect } from "react";
import { useOptionalStoreAvailability } from "./storefront/StoreAvailabilityProvider";

export default function Cart() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();
  const availability = useOptionalStoreAvailability();
  const canOrder = availability?.canOrder ?? true;

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add("cart-open");
    } else {
      document.body.classList.remove("cart-open");
    }
    return () => {
      document.body.classList.remove("cart-open");
    };
  }, [isCartOpen]);

  if (!cart) return null;

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className={`fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full px-4 py-3 font-semibold text-white shadow-lg transition-colors md:bottom-8 md:right-8 md:flex ${
          canOrder
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-slate-500 hover:bg-slate-600"
        }`}
      >
        <ShoppingBag className="h-5 w-5" />
        <span>Cart</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-orange-500">
          {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </button>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end overflow-hidden sm:items-center sm:justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity overflow-hidden"
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className="relative z-10 h-[90vh] w-full max-w-md bg-white shadow-xl flex flex-col sm:h-[90vh] sm:rounded-l-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={cart.storeLogo}
                    alt={cart.storeName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {cart.storeName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {cart.items.length} items
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
              {cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || ""}`}
                  className="mb-4 flex gap-4 rounded-lg border border-gray-200 p-3"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">
                          {item.variantName}
                        </p>
                      )}
                      {item.selectedAddOns &&
                        item.selectedAddOns.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.selectedAddOns.map((addOn) => (
                              <span key={addOn.optionId} className="mr-1">
                                + {addOn.optionName}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        ₹{item.total}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId,
                            )
                          }
                          disabled={!canOrder}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
                          aria-label={
                            canOrder
                              ? "Increase quantity"
                              : "Ordering is closed"
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantId)
                    }
                    className="flex-shrink-0 self-start rounded-full p-1 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 sm:p-6">
              {!canOrder && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-600">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Ordering is closed</p>
                    <p className="mt-0.5 text-xs">
                      {availability?.nextOpenLabel ??
                        "Please check back when the store reopens."}
                    </p>
                  </div>
                </div>
              )}
              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{cart.discount}</span>
                  </div>
                )}
                {cart.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{cart.tax}</span>
                  </div>
                )}
                {cart.deliveryFee !== undefined && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{cart.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{cart.total}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                {canOrder ? (
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block w-full rounded-full bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="block w-full cursor-not-allowed rounded-full bg-slate-300 py-3 text-center font-semibold text-slate-600"
                  >
                    Ordering closed
                  </button>
                )}
                <button
                  onClick={clearCart}
                  className="w-full rounded-full border border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
