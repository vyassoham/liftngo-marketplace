import { z } from 'zod';

/**
 * Order Status Enum
 */
export const OrderStatusSchema = z.enum([
  'CART',
  'ADDRESS_ADDED',
  'DELIVERY_QUOTED',
  'PAYMENT_PENDING',
  'PAYMENT_CONFIRMED',
  'ORDER_SENT_TO_STORE',
  'MERCHANT_ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'DRIVER_SEARCHING',
  'DRIVER_ASSIGNED',
  'DRIVER_EN_ROUTE_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  // Exception statuses
  'PAYMENT_FAILED',
  'MERCHANT_REJECTED',
  'OUT_OF_STOCK',
  'DELIVERY_BOOKING_FAILED',
  'DRIVER_NOT_FOUND',
  'CUSTOMER_CANCELLED',
  'MERCHANT_CANCELLED',
  'REFUND_PENDING',
  'REFUNDED',
  'DELIVERY_FAILED',
]);

/**
 * Payment Status Enum
 */
export const PaymentStatusSchema = z.enum([
  'NOT_STARTED',
  'PENDING',
  'AUTHORIZED',
  'PAID',
  'FAILED',
  'REFUND_PENDING',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
]);

/**
 * Delivery Status Enum
 */
export const DeliveryStatusSchema = z.enum([
  'NOT_STARTED',
  'QUOTE_REQUESTED',
  'QUOTE_RECEIVED',
  'BOOKING_REQUESTED',
  'BOOKING_CONFIRMED',
  'DRIVER_SEARCHING',
  'DRIVER_ASSIGNED',
  'DRIVER_EN_ROUTE_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'ARRIVED_AT_DROP',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]);

/**
 * Customer Address Schema
 */
export const CustomerAddressSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  houseNumber: z.string().min(1).max(100),
  addressLine: z.string().min(1).max(300),
  landmark: z.string().max(100).optional(),
  deliveryInstructions: z.string().max(300).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().max(100),
  state: z.string().max(100),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/),
});

/**
 * Cart Item Schema
 */
export const CartItemSchema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  productImage: z.string().url(),
  quantity: z.number().int().min(1).max(99),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  variantPrice: z.number().min(0).optional(),
  selectedAddOns: z.array(z.object({
    groupId: z.string(),
    groupName: z.string(),
    optionId: z.string(),
    optionName: z.string(),
    price: z.number().min(0),
  })).optional(),
  unitPrice: z.number().min(0),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
});

/**
 * Cart Schema
 */
export const CartSchema = z.object({
  cartId: z.string().optional(),
  storeId: z.string(),
  storeSlug: z.string(),
  storeName: z.string(),
  storeLogo: z.string().url(),
  items: z.array(CartItemSchema),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  deliveryFee: z.number().min(0).optional(),
  total: z.number().min(0),
  currency: z.string().default('INR'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Order Item Schema (Immutable Snapshot)
 */
export const OrderItemSchema = z.object({
  orderItemId: z.string(),
  productId: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  productImage: z.string().url(),
  quantity: z.number().int().min(1),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  variantPrice: z.number().min(0).optional(),
  selectedAddOns: z.array(z.object({
    groupId: z.string(),
    groupName: z.string(),
    optionId: z.string(),
    optionName: z.string(),
    price: z.number().min(0),
  })).optional(),
  unitPrice: z.number().min(0),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  taxPercentage: z.number().min(0).max(100),
  total: z.number().min(0),
  // Snapshot at order time - never changes
  productSnapshot: z.object({
    name: z.string(),
    image: z.string().url(),
    price: z.number().min(0),
    taxPercentage: z.number().min(0).max(100),
  }),
});

/**
 * Order Schema
 */
export const OrderSchema = z.object({
  orderId: z.string(),
  publicOrderNumber: z.string(),
  publicTrackingToken: z.string(),
  storeId: z.string(),
  storeSlug: z.string(),
  storeName: z.string(),
  customerId: z.string().optional(),
  
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  deliveryStatus: DeliveryStatusSchema.optional(),
  
  // Encrypted customer data
  encryptedCustomerName: z.string().optional(),
  encryptedCustomerPhone: z.string().optional(),
  
  // Delivery address
  dropAddress: CustomerAddressSchema,
  
  // Order items
  items: z.array(OrderItemSchema),
  
  // Pricing
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  deliveryFee: z.number().min(0).optional(),
  total: z.number().min(0),
  currency: z.string().default('INR'),
  
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  placedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  
  // Metadata
  notes: z.string().max(500).optional(),
  source: z.enum(['WEB', 'MOBILE', 'WHATSAPP']).default('WEB'),
  utmParameters: z.record(z.string(), z.string()).optional(),
});

/**
 * Payment Transaction Schema
 */
export const PaymentTransactionSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  provider: z.enum(['RAZORPAY', 'STRIPE', 'PHONEPE', 'GPAY']),
  providerTxnId: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().default('INR'),
  status: PaymentStatusSchema,
  
  // Webhook verification
  webhookVerified: z.boolean().default(false),
  webhookSignature: z.string().optional(),
  webhookReceivedAt: z.string().optional(),
  
  // Idempotency
  idempotencyKey: z.string().optional(),
  
  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),
  
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  
  // Refund information
  refundAmount: z.number().min(0).optional(),
  refundReason: z.string().optional(),
  refundId: z.string().optional(),
  refundStatus: z.enum(['NONE', 'REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED']).default('NONE'),
});

/**
 * Delivery Quote Schema
 */
export const DeliveryQuoteSchema = z.object({
  quoteId: z.string(),
  orderId: z.string(),
  provider: z.enum(['LIFTNGO', 'DUNZO', 'SWIGGY_GENIE']),
  
  // Request
  pickup: z.object({
    name: z.string(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  drop: z.object({
    name: z.string(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  packageType: z.enum(['FOOD', 'CLOTHING', 'ELECTRONICS', 'DOCUMENTS', 'GENERAL']),
  itemCount: z.number().int().min(1),
  weight: z.number().min(0.1).max(50),
  orderValue: z.number().min(0),
  
  // Response
  serviceable: z.boolean(),
  deliveryFee: z.number().min(0).optional(),
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  quoteExpiry: z.string().optional(),
  
  // Metadata
  providerQuoteId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  
  // Timestamps
  createdAt: z.string(),
  expiresAt: z.string().optional(),
});

/**
 * Delivery Job Schema
 */
export const DeliveryJobSchema = z.object({
  deliveryJobId: z.string(),
  orderId: z.string(),
  provider: z.enum(['LIFTNGO', 'DUNZO', 'SWIGGY_GENIE']),
  
  // Booking
  providerBookingId: z.string().optional(),
  status: DeliveryStatusSchema,
  
  // Quote reference
  quoteId: z.string().optional(),
  
  // Driver information (when available)
  driver: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
    vehicleNumber: z.string().optional(),
    vehicleType: z.string().optional(),
  }).optional(),
  
  // ETAs
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  actualPickupTime: z.string().optional(),
  actualDeliveryTime: z.string().optional(),
  
  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),
  
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Order Event Schema
 */
export const OrderEventSchema = z.object({
  eventId: z.string(),
  orderId: z.string(),
  eventType: z.string(),
  previousStatus: z.string().optional(),
  newStatus: z.string(),
  
  // Actor information
  actor: z.object({
    type: z.enum(['CUSTOMER', 'MERCHANT', 'DRIVER', 'SYSTEM', 'ADMIN']),
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  
  // Event details
  metadata: z.record(z.string(), z.any()).optional(),
  reason: z.string().optional(),
  
  // Timestamps
  createdAt: z.string(),
});

/**
 * Merchant Acknowledgement Schema
 */
export const MerchantAcknowledgementSchema = z.object({
  acknowledgementId: z.string(),
  orderId: z.string(),
  storeId: z.string(),
  
  action: z.enum(['ACCEPTED', 'REJECTED', 'OUT_OF_STOCK', 'READY']),
  responseTimeSeconds: z.number().min(0),
  
  // Response details
  reason: z.string().optional(),
  notes: z.string().max(500).optional(),
  estimatedPreparationMinutes: z.number().min(1).max(180).optional(),
  
  // Timestamps
  createdAt: z.string(),
});

/**
 * Refund Schema
 */
export const RefundSchema = z.object({
  refundId: z.string(),
  orderId: z.string(),
  paymentId: z.string(),
  
  amount: z.number().min(0),
  reason: z.string(),
  status: z.enum(['REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED']),
  
  // Provider reference
  providerRefundId: z.string().optional(),
  
  // Processing
  initiatedBy: z.enum(['CUSTOMER', 'MERCHANT', 'ADMIN', 'SYSTEM']),
  initiatedAt: z.string(),
  processedAt: z.string().optional(),
  
  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * Notification Log Schema
 */
export const NotificationLogSchema = z.object({
  notificationId: z.string(),
  orderId: z.string(),
  recipient: z.enum(['CUSTOMER', 'MERCHANT', 'DRIVER', 'ADMIN']),
  
  channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'PUSH']),
  provider: z.string(),
  
  template: z.string(),
  status: z.enum(['PENDING', 'SENT', 'DELIVERED', 'FAILED']),
  
  // Content
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/).optional(),
  email: z.string().email().optional(),
  
  // Provider reference
  providerMessageId: z.string().optional(),
  
  // Timestamps
  createdAt: z.string(),
  sentAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  failedAt: z.string().optional(),
  
  // Error handling
  errorMessage: z.string().optional(),
  retryCount: z.number().int().min(0).default(0),
});

/**
 * Audit Log Schema
 */
export const AuditLogSchema = z.object({
  auditId: z.string(),
  entityType: z.enum(['ORDER', 'PAYMENT', 'DELIVERY', 'STORE', 'PRODUCT', 'REFUND']),
  entityId: z.string(),
  
  action: z.string(),
  actor: z.object({
    type: z.enum(['CUSTOMER', 'MERCHANT', 'DRIVER', 'ADMIN', 'SYSTEM']),
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  
  // Change details
  previousState: z.record(z.string(), z.any()).optional(),
  newState: z.record(z.string(), z.any()).optional(),
  changes: z.array(z.object({
    field: z.string(),
    oldValue: z.any(),
    newValue: z.any(),
  })).optional(),
  
  // Context
  reason: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  
  // Timestamps
  createdAt: z.string(),
});

// Export types
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;
export type CustomerAddress = z.infer<typeof CustomerAddressSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
export type DeliveryQuote = z.infer<typeof DeliveryQuoteSchema>;
export type DeliveryJob = z.infer<typeof DeliveryJobSchema>;
export type OrderEvent = z.infer<typeof OrderEventSchema>;
export type MerchantAcknowledgement = z.infer<typeof MerchantAcknowledgementSchema>;
export type Refund = z.infer<typeof RefundSchema>;
export type NotificationLog = z.infer<typeof NotificationLogSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
