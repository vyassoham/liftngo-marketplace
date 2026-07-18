import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MARKETPLACE_STORAGE_KEYS, MARKETPLACE_CONFIG } from '@/lib/marketplace/constants';
import { CartItem, Cart } from '@/lib/marketplace/schemas';

interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  storeSwitchWarning: { newStoreId: string; newStoreName: string } | null;
  
  // Actions
  addToCart: (item: CartItem, storeId: string, storeSlug: string, storeName: string, storeLogo: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  confirmStoreSwitch: () => void;
  cancelStoreSwitch: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartEmpty: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      storeSwitchWarning: null,

      addToCart: (item, storeId, storeSlug, storeName, storeLogo) => {
        const state = get();
        
        // Check if cart exists and has items from a different store
        if (state.cart && state.cart.storeId !== storeId && state.cart.items.length > 0) {
          // Show store switch warning
          set({
            storeSwitchWarning: {
              newStoreId: storeId,
              newStoreName: storeName,
            },
          });
          return;
        }

        // Create new cart if it doesn't exist
        if (!state.cart) {
          set({
            cart: {
              cartId: `cart_${Date.now()}`,
              storeId,
              storeSlug,
              storeName,
              storeLogo,
              items: [item],
              subtotal: item.total,
              discount: 0,
              tax: item.tax,
              deliveryFee: undefined,
              total: item.total,
              currency: 'INR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
          return;
        }

        // Update existing cart
        const existingItemIndex = state.cart.items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId &&
            JSON.stringify(i.selectedAddOns) === JSON.stringify(item.selectedAddOns)
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          newItems = state.cart.items.map((i, index) =>
            index === existingItemIndex
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  subtotal: i.subtotal + item.subtotal,
                  tax: i.tax + item.tax,
                  total: i.total + item.total,
                }
              : i
          );
        } else {
          // Add new item
          newItems = [...state.cart.items, item];
        }

        // Check max cart items
        if (newItems.length > MARKETPLACE_CONFIG.MAX_CART_ITEMS) {
          console.warn('Maximum cart items reached');
          return;
        }

        const subtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = newItems.reduce((sum, item) => sum + item.tax, 0);
        const total = subtotal + state.cart.discount + tax + (state.cart.deliveryFee || 0);

        set({
          cart: {
            ...state.cart,
            items: newItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      removeFromCart: (productId, variantId) => {
        const state = get();
        if (!state.cart) return;

        const newItems = state.cart.items.filter(
          (item) =>
            !(item.productId === productId && item.variantId === variantId)
        );

        if (newItems.length === 0) {
          // Clear cart if no items left
          set({ cart: null });
          return;
        }

        const subtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = newItems.reduce((sum, item) => sum + item.tax, 0);
        const total = subtotal + state.cart.discount + tax + (state.cart.deliveryFee || 0);

        set({
          cart: {
            ...state.cart,
            items: newItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const state = get();
        if (!state.cart) return;

        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }

        if (quantity > MARKETPLACE_CONFIG.MAX_QUANTITY_PER_ITEM) {
          console.warn('Maximum quantity per item reached');
          return;
        }

        const newItems = state.cart.items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const newQuantity = quantity;
            const newSubtotal = (item.unitPrice * newQuantity);
            const newTax = (item.tax / item.quantity) * newQuantity;
            const newTotal = newSubtotal + newTax;

            return {
              ...item,
              quantity: newQuantity,
              subtotal: newSubtotal,
              tax: newTax,
              total: newTotal,
            };
          }
          return item;
        });

        const subtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = newItems.reduce((sum, item) => sum + item.tax, 0);
        const total = subtotal + state.cart.discount + tax + (state.cart.deliveryFee || 0);

        set({
          cart: {
            ...state.cart,
            items: newItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearCart: () => {
        set({ cart: null });
      },

      setCartOpen: (isOpen) => {
        set({ isCartOpen: isOpen });
      },

      confirmStoreSwitch: () => {
        const state = get();
        if (!state.storeSwitchWarning) return;

        // Clear cart and allow switch
        set({
          cart: null,
          storeSwitchWarning: null,
        });
      },

      cancelStoreSwitch: () => {
        set({ storeSwitchWarning: null });
      },

      getCartTotal: () => {
        const state = get();
        return state.cart?.total || 0;
      },

      getCartItemCount: () => {
        const state = get();
        return state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      },

      isCartEmpty: () => {
        const state = get();
        return !state.cart || state.cart.items.length === 0;
      },
    }),
    {
      name: MARKETPLACE_STORAGE_KEYS.CART,
    }
  )
);
