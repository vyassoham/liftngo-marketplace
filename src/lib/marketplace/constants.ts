/**
 * Marketplace Constants
 * Centralized configuration for the marketplace feature
 */

import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Marketplace Storage Keys
 */
export const MARKETPLACE_STORAGE_KEYS = {
  CART: 'liftngo_marketplace_cart',
  CHECKOUT_DRAFT: 'liftngo_marketplace_checkout_draft',
  RECENT_STORES: 'liftngo_marketplace_recent_stores',
  SEARCH_HISTORY: 'liftngo_marketplace_search_history',
  PREFERENCES: 'liftngo_marketplace_preferences',
} as const;

/**
 * Marketplace Support Configuration
 */
export const MARKETPLACE_SUPPORT = {
  PHONE: '7891880088',
  WHATSAPP: '917891880088',
  EMAIL: 'support@goliftngo.com',
} as const;

/**
 * Marketplace Configuration
 */
export const MARKETPLACE_CONFIG = {
  // Cart configuration
  MAX_CART_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 99,
  CART_EXPIRY_HOURS: 24,
  
  // Order configuration
  MIN_ORDER_AMOUNT: 50,
  MAX_ORDER_AMOUNT: 50000,
  ORDER_VALIDITY_MINUTES: 30,
  
  // Delivery configuration
  DEFAULT_PREPARATION_MINUTES: 30,
  MAX_PREPARATION_MINUTES: 180,
  DELIVERY_RADIUS_KM: 10,
  
  // Payment configuration
  PAYMENT_TIMEOUT_MINUTES: 15,
  REFUND_PROCESSING_DAYS: 7,
  
  // Merchant configuration
  MERCHANT_RESPONSE_TIMEOUT_SECONDS: 120,
  MERCHANT_REMINDER_DELAY_SECONDS: 120,
  
  // Pagination
  STORES_PER_PAGE: 12,
  PRODUCTS_PER_PAGE: 20,
  
  // Image dimensions
  STORE_BANNER_WIDTH: 1600,
  STORE_BANNER_HEIGHT: 600,
  PRODUCT_IMAGE_SIZE: 1000,
  LOGO_SIZE: 800,
} as const;

/**
 * Business Categories (Malviya Nagar, Jaipur)
 */
export const BUSINESS_CATEGORIES = [
  {
    id: 'food',
    name: 'Food',
    slug: 'food',
    description: 'Restaurants, cafes, and food outlets',
    icon: '🍔',
    order: 1,
  },
  {
    id: 'cafes',
    name: 'Cafés',
    slug: 'cafes',
    description: 'Coffee shops and bakeries',
    icon: '☕',
    order: 2,
  },
  {
    id: 'bakery',
    name: 'Bakery',
    slug: 'bakery',
    description: 'Fresh baked goods and confectionery',
    icon: '🥐',
    order: 3,
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion apparel and accessories',
    icon: '👔',
    order: 4,
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Gold, silver, and fashion jewellery',
    icon: '💎',
    order: 5,
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Cosmetics, skincare, and salons',
    icon: '💄',
    order: 6,
  },
  {
    id: 'grocery',
    name: 'Grocery',
    slug: 'grocery',
    description: 'Daily essentials and groceries',
    icon: '🛒',
    order: 7,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets and electronic accessories',
    icon: '📱',
    order: 8,
  },
  {
    id: 'home-decor',
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Furniture and home accessories',
    icon: '🏠',
    order: 9,
  },
  {
    id: 'gifts',
    name: 'Gifts',
    slug: 'gifts',
    description: 'Gifts and specialty items',
    icon: '🎁',
    order: 10,
  },
  {
    id: 'services',
    name: 'Services',
    slug: 'services',
    description: 'Local services and professionals',
    icon: '🔧',
    order: 11,
  },
] as const;

/**
 * Order Status Flow
 * Defines valid state transitions
 */
export const ORDER_STATUS_FLOW = {
  CART: ['ADDRESS_ADDED', 'CUSTOMER_CANCELLED'],
  ADDRESS_ADDED: ['DELIVERY_QUOTED', 'CUSTOMER_CANCELLED'],
  DELIVERY_QUOTED: ['PAYMENT_PENDING', 'CUSTOMER_CANCELLED'],
  PAYMENT_PENDING: ['PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'CUSTOMER_CANCELLED'],
  PAYMENT_CONFIRMED: ['ORDER_SENT_TO_STORE', 'REFUND_PENDING'],
  PAYMENT_FAILED: ['PAYMENT_PENDING', 'CUSTOMER_CANCELLED'],
  ORDER_SENT_TO_STORE: ['MERCHANT_ACCEPTED', 'MERCHANT_REJECTED', 'OUT_OF_STOCK', 'REFUND_PENDING'],
  MERCHANT_ACCEPTED: ['PREPARING'],
  MERCHANT_REJECTED: ['REFUND_PENDING'],
  OUT_OF_STOCK: ['REFUND_PENDING'],
  PREPARING: ['READY_FOR_PICKUP', 'MERCHANT_CANCELLED'],
  READY_FOR_PICKUP: ['DRIVER_SEARCHING', 'DRIVER_ASSIGNED', 'DELIVERY_BOOKING_FAILED'],
  DRIVER_SEARCHING: ['DRIVER_ASSIGNED', 'DRIVER_NOT_FOUND'],
  DRIVER_ASSIGNED: ['DRIVER_EN_ROUTE_TO_PICKUP'],
  DRIVER_EN_ROUTE_TO_PICKUP: ['ARRIVED_AT_PICKUP'],
  ARRIVED_AT_PICKUP: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELIVERY_FAILED'],
  DELIVERED: [],
  DELIVERY_BOOKING_FAILED: ['DRIVER_SEARCHING', 'REFUND_PENDING'],
  DRIVER_NOT_FOUND: ['DRIVER_SEARCHING', 'REFUND_PENDING'],
  CUSTOMER_CANCELLED: ['REFUND_PENDING'],
  MERCHANT_CANCELLED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
  DELIVERY_FAILED: ['REFUND_PENDING'],
} as const;

/**
 * Payment Status Flow
 */
export const PAYMENT_STATUS_FLOW = {
  NOT_STARTED: ['PENDING'],
  PENDING: ['AUTHORIZED', 'FAILED'],
  AUTHORIZED: ['PAID', 'FAILED'],
  PAID: ['REFUND_PENDING', 'PARTIALLY_REFUNDED'],
  FAILED: ['NOT_STARTED'],
  REFUND_PENDING: ['PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED'],
  PARTIALLY_REFUNDED: ['REFUNDED'],
  REFUNDED: [],
} as const;

/**
 * Delivery Status Flow
 */
export const DELIVERY_STATUS_FLOW = {
  NOT_STARTED: ['QUOTE_REQUESTED'],
  QUOTE_REQUESTED: ['QUOTE_RECEIVED', 'FAILED'],
  QUOTE_RECEIVED: ['BOOKING_REQUESTED'],
  BOOKING_REQUESTED: ['BOOKING_CONFIRMED', 'FAILED'],
  BOOKING_CONFIRMED: ['DRIVER_SEARCHING'],
  DRIVER_SEARCHING: ['DRIVER_ASSIGNED', 'FAILED'],
  DRIVER_ASSIGNED: ['DRIVER_EN_ROUTE_TO_PICKUP'],
  DRIVER_EN_ROUTE_TO_PICKUP: ['ARRIVED_AT_PICKUP'],
  ARRIVED_AT_PICKUP: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['ARRIVED_AT_DROP'],
  ARRIVED_AT_DROP: ['DELIVERED'],
  DELIVERED: [],
  FAILED: ['CANCELLED'],
  CANCELLED: [],
} as const;

/**
 * Order Status Labels (for display)
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  CART: 'Cart',
  ADDRESS_ADDED: 'Address Added',
  DELIVERY_QUOTED: 'Delivery Quoted',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_CONFIRMED: 'Payment Confirmed',
  ORDER_SENT_TO_STORE: 'Order Sent to Store',
  MERCHANT_ACCEPTED: 'Merchant Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  DRIVER_SEARCHING: 'Finding Driver',
  DRIVER_ASSIGNED: 'Driver Assigned',
  DRIVER_EN_ROUTE_TO_PICKUP: 'Driver En Route',
  ARRIVED_AT_PICKUP: 'Driver Arrived',
  PICKED_UP: 'Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  PAYMENT_FAILED: 'Payment Failed',
  MERCHANT_REJECTED: 'Merchant Rejected',
  OUT_OF_STOCK: 'Out of Stock',
  DELIVERY_BOOKING_FAILED: 'Delivery Failed',
  DRIVER_NOT_FOUND: 'Driver Not Found',
  CUSTOMER_CANCELLED: 'Cancelled by Customer',
  MERCHANT_CANCELLED: 'Cancelled by Merchant',
  REFUND_PENDING: 'Refund Pending',
  REFUNDED: 'Refunded',
  DELIVERY_FAILED: 'Delivery Failed',
} as const;

/**
 * Marketplace Error Messages
 */
export const MARKETPLACE_ERRORS = {
  CART_STORE_MISMATCH: 'Your cart contains products from another store. Starting a new order will clear your current cart.',
  STORE_CLOSED: 'This store is currently not accepting orders.',
  MIN_ORDER_AMOUNT: (min: number) => `Minimum order amount is ₹${min}`,
  MAX_ORDER_AMOUNT: (max: number) => `Maximum order amount is ₹${max}`,
  OUT_OF_STOCK: 'This product is currently out of stock.',
  INVALID_ADDRESS: 'Please provide a valid delivery address.',
  ADDRESS_NOT_SERVICEABLE: 'This address is not serviceable for delivery.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  PAYMENT_TIMEOUT: 'Payment timed out. Please try again.',
  DELIVERY_FAILED: 'Delivery booking failed. Please try again.',
  ORDER_NOT_FOUND: 'Order not found.',
  INVALID_TRACKING_TOKEN: 'Invalid tracking token.',
  MERCHANT_TIMEOUT: 'Merchant did not respond. Our team is assisting.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

/**
 * Marketplace Success Messages
 */
export const MARKETPLACE_SUCCESS = {
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_CONFIRMED: 'Payment confirmed!',
  ORDER_ACCEPTED: 'Your order has been accepted by the store.',
  ORDER_READY: 'Your order is ready for pickup.',
  DRIVER_ASSIGNED: 'Driver has been assigned to your order.',
  ORDER_DELIVERED: 'Your order has been delivered!',
  REFUND_INITIATED: 'Refund has been initiated.',
  REFUND_PROCESSED: 'Refund has been processed successfully.',
} as const;

/**
 * Marketplace Analytics Events
 */
export const MARKETPLACE_ANALYTICS_EVENTS = {
  MARKETPLACE_VIEWED: 'marketplace_viewed',
  BUSINESS_CATEGORY_SELECTED: 'business_category_selected',
  STORE_VIEWED: 'store_viewed',
  STORE_SEARCH_USED: 'store_search_used',
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED: 'product_added',
  PRODUCT_REMOVED: 'product_removed',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  LOCATION_PERMISSION_REQUESTED: 'location_permission_requested',
  LOCATION_ADDED: 'location_added',
  DELIVERY_QUOTE_REQUESTED: 'delivery_quote_requested',
  DELIVERY_QUOTE_RECEIVED: 'delivery_quote_received',
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  MERCHANT_NOTIFIED: 'merchant_notified',
  MERCHANT_ACCEPTED: 'merchant_accepted',
  DRIVER_SEARCHING: 'driver_searching',
  DRIVER_ASSIGNED: 'driver_assigned',
  ORDER_PICKED_UP: 'order_picked_up',
  ORDER_DELIVERED: 'order_delivered',
  REFUND_REQUESTED: 'refund_requested',
  REFUND_COMPLETED: 'refund_completed',
  REPEAT_ORDER: 'repeat_order',
} as const;

/**
 * Marketplace Rollout Cohorts
 */
export const MARKETPLACE_ROLLOUT_COHORTS = {
  PILOT: 'pilot',
  WAVE_1: 'wave_1',
  WAVE_2: 'wave_2',
  WAVE_3: 'wave_3',
} as const;

/**
 * Marketplace Admin Roles
 */
export const MARKETPLACE_ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MARKETPLACE_ADMIN: 'MARKETPLACE_ADMIN',
  RELATIONSHIP_MANAGER: 'RELATIONSHIP_MANAGER',
  CATALOGUE_MANAGER: 'CATALOGUE_MANAGER',
  OPERATIONS: 'OPERATIONS',
  SUPPORT: 'SUPPORT',
  FINANCE: 'FINANCE',
  VIEW_ONLY: 'VIEW_ONLY',
} as const;

/**
 * Marketplace Permissions
 */
export const MARKETPLACE_PERMISSIONS = {
  // Store management
  CREATE_STORE: 'create_store',
  EDIT_STORE: 'edit_store',
  DELETE_STORE: 'delete_store',
  VIEW_STORE: 'view_store',
  PUBLISH_STORE: 'publish_store',
  
  // Catalogue management
  ADD_PRODUCT: 'add_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  BULK_IMPORT: 'bulk_import',
  
  // Order management
  VIEW_ORDERS: 'view_orders',
  MANAGE_ORDERS: 'manage_orders',
  REFUND_ORDERS: 'refund_orders',
  
  // Delivery management
  VIEW_DELIVERY: 'view_delivery',
  MANAGE_DELIVERY: 'manage_delivery',
  
  // Payment management
  VIEW_PAYMENTS: 'view_payments',
  MANAGE_REFUNDS: 'manage_refunds',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  
  // Notifications
  SEND_NOTIFICATIONS: 'send_notifications',
} as const;

/**
 * Role Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: Object.values(MARKETPLACE_PERMISSIONS),
  MARKETPLACE_ADMIN: [
    MARKETPLACE_PERMISSIONS.CREATE_STORE,
    MARKETPLACE_PERMISSIONS.EDIT_STORE,
    MARKETPLACE_PERMISSIONS.VIEW_STORE,
    MARKETPLACE_PERMISSIONS.PUBLISH_STORE,
    MARKETPLACE_PERMISSIONS.ADD_PRODUCT,
    MARKETPLACE_PERMISSIONS.EDIT_PRODUCT,
    MARKETPLACE_PERMISSIONS.DELETE_PRODUCT,
    MARKETPLACE_PERMISSIONS.BULK_IMPORT,
    MARKETPLACE_PERMISSIONS.VIEW_ORDERS,
    MARKETPLACE_PERMISSIONS.MANAGE_ORDERS,
    MARKETPLACE_PERMISSIONS.REFUND_ORDERS,
    MARKETPLACE_PERMISSIONS.VIEW_DELIVERY,
    MARKETPLACE_PERMISSIONS.MANAGE_DELIVERY,
    MARKETPLACE_PERMISSIONS.VIEW_PAYMENTS,
    MARKETPLACE_PERMISSIONS.MANAGE_REFUNDS,
    MARKETPLACE_PERMISSIONS.VIEW_ANALYTICS,
    MARKETPLACE_PERMISSIONS.SEND_NOTIFICATIONS,
  ],
  RELATIONSHIP_MANAGER: [
    MARKETPLACE_PERMISSIONS.VIEW_STORE,
    MARKETPLACE_PERMISSIONS.PUBLISH_STORE,
    MARKETPLACE_PERMISSIONS.VIEW_ORDERS,
    MARKETPLACE_PERMISSIONS.MANAGE_ORDERS,
    MARKETPLACE_PERMISSIONS.VIEW_ANALYTICS,
  ],
  CATALOGUE_MANAGER: [
    MARKETPLACE_PERMISSIONS.VIEW_STORE,
    MARKETPLACE_PERMISSIONS.ADD_PRODUCT,
    MARKETPLACE_PERMISSIONS.EDIT_PRODUCT,
    MARKETPLACE_PERMISSIONS.DELETE_PRODUCT,
    MARKETPLACE_PERMISSIONS.BULK_IMPORT,
  ],
  OPERATIONS: [
    MARKETPLACE_PERMISSIONS.VIEW_ORDERS,
    MARKETPLACE_PERMISSIONS.MANAGE_ORDERS,
    MARKETPLACE_PERMISSIONS.VIEW_DELIVERY,
    MARKETPLACE_PERMISSIONS.MANAGE_DELIVERY,
    MARKETPLACE_PERMISSIONS.VIEW_ANALYTICS,
  ],
  SUPPORT: [
    MARKETPLACE_PERMISSIONS.VIEW_ORDERS,
    MARKETPLACE_PERMISSIONS.VIEW_DELIVERY,
    MARKETPLACE_PERMISSIONS.VIEW_PAYMENTS,
  ],
  FINANCE: [
    MARKETPLACE_PERMISSIONS.VIEW_PAYMENTS,
    MARKETPLACE_PERMISSIONS.MANAGE_REFUNDS,
    MARKETPLACE_PERMISSIONS.VIEW_ANALYTICS,
  ],
  VIEW_ONLY: [
    MARKETPLACE_PERMISSIONS.VIEW_STORE,
    MARKETPLACE_PERMISSIONS.VIEW_ORDERS,
    MARKETPLACE_PERMISSIONS.VIEW_DELIVERY,
    MARKETPLACE_PERMISSIONS.VIEW_PAYMENTS,
    MARKETPLACE_PERMISSIONS.VIEW_ANALYTICS,
  ],
} as const;
