/**
 * Delivery Provider Interface
 * Defines the contract for delivery providers (Liftngo, Dunzo, etc.)
 */

export interface DeliveryProvider {
  /**
   * Get delivery quote
   */
  getQuote(params: QuoteParams): Promise<DeliveryQuote>;

  /**
   * Book delivery
   */
  bookDelivery(params: BookingParams): Promise<DeliveryBooking>;

  /**
   * Get delivery status
   */
  getDeliveryStatus(bookingId: string): Promise<DeliveryStatus>;

  /**
   * Cancel delivery
   */
  cancelDelivery(bookingId: string, reason?: string): Promise<CancellationResult>;

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean>;
}

export interface QuoteParams {
  pickup: Location;
  drop: Location;
  packageType: PackageType;
  itemCount: number;
  weight: number;
  orderValue: number;
  metadata?: Record<string, any>;
}

export interface Location {
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type PackageType = 'FOOD' | 'CLOTHING' | 'ELECTRONICS' | 'DOCUMENTS' | 'GENERAL';

export interface DeliveryQuote {
  quoteId: string;
  providerQuoteId?: string;
  serviceable: boolean;
  deliveryFee: number;
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  distanceKm: number;
  durationMinutes: number;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface BookingParams {
  quoteId: string;
  pickup: Location;
  drop: Location;
  packageType: PackageType;
  itemCount: number;
  weight: number;
  orderValue: number;
  orderId: string;
  deliveryInstructions?: string;
  metadata?: Record<string, any>;
}

export interface DeliveryBooking {
  bookingId: string;
  providerBookingId: string;
  status: DeliveryStatusType;
  quoteId: string;
  pickup: Location;
  drop: Location;
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  driver?: DriverInfo;
  metadata?: Record<string, any>;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  currentLatitude?: number;
  currentLongitude?: number;
}

export type DeliveryStatusType =
  | 'QUOTE_REQUESTED'
  | 'QUOTE_RECEIVED'
  | 'BOOKING_REQUESTED'
  | 'BOOKING_CONFIRMED'
  | 'DRIVER_SEARCHING'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_EN_ROUTE_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'ARRIVED_AT_DROP'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface DeliveryStatus {
  bookingId: string;
  providerBookingId: string;
  status: DeliveryStatusType;
  pickup: Location;
  drop: Location;
  driver?: DriverInfo;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  metadata?: Record<string, any>;
}

export interface CancellationResult {
  bookingId: string;
  cancelled: boolean;
  reason?: string;
  refundAmount?: number;
  metadata?: Record<string, any>;
}

export type DeliveryProviderType = 'LIFTNGO' | 'DUNZO' | 'SWIGGY_GENIE';
