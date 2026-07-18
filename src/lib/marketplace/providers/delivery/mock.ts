/**
 * Mock Delivery Provider
 * For development and testing purposes
 */

import {
  DeliveryProvider,
  QuoteParams,
  DeliveryQuote,
  BookingParams,
  DeliveryBooking,
  DeliveryStatus,
  CancellationResult,
} from './provider';

export class MockDeliveryProvider implements DeliveryProvider {
  private mockDelay: number;

  constructor(mockDelay: number = 800) {
    this.mockDelay = mockDelay;
  }

  async getQuote(params: QuoteParams): Promise<DeliveryQuote> {
    await this.delay();

    const quoteId = `mock_quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate mock distance and fee
    const distanceKm = this.calculateDistance(
      params.pickup.latitude,
      params.pickup.longitude,
      params.drop.latitude,
      params.drop.longitude
    );

    const baseFee = 30;
    const perKmFee = 8;
    const deliveryFee = Math.round(baseFee + (distanceKm * perKmFee));
    const durationMinutes = Math.round(distanceKm * 10 + 15);

    const now = new Date();
    const estimatedPickupTime = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const estimatedDeliveryTime = new Date(estimatedPickupTime.getTime() + durationMinutes * 60 * 1000);

    return {
      quoteId,
      providerQuoteId: `provider_${quoteId}`,
      serviceable: distanceKm <= 10, // Serviceable within 10km
      deliveryFee,
      estimatedPickupTime,
      estimatedDeliveryTime,
      distanceKm,
      durationMinutes,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000), // 10 minutes
      metadata: {
        mock: true,
        packageType: params.packageType,
        itemCount: params.itemCount,
      },
    };
  }

  async bookDelivery(params: BookingParams): Promise<DeliveryBooking> {
    await this.delay();

    const bookingId = `mock_booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const providerBookingId = `provider_${bookingId}`;

    const now = new Date();
    const estimatedPickupTime = new Date(now.getTime() + 15 * 60 * 1000);
    const estimatedDeliveryTime = new Date(estimatedPickupTime.getTime() + 30 * 60 * 1000);

    return {
      bookingId,
      providerBookingId,
      status: 'BOOKING_CONFIRMED',
      quoteId: params.quoteId,
      pickup: params.pickup,
      drop: params.drop,
      estimatedPickupTime,
      estimatedDeliveryTime,
      metadata: {
        mock: true,
        orderId: params.orderId,
        packageType: params.packageType,
      },
    };
  }

  async getDeliveryStatus(bookingId: string): Promise<DeliveryStatus> {
    await this.delay();

    // Mock status based on bookingId pattern
    if (bookingId.includes('delivered')) {
      return {
        bookingId,
        providerBookingId: bookingId,
        status: 'DELIVERED',
        pickup: {
          name: 'Store',
          phone: '9876543210',
          address: 'Malviya Nagar',
          latitude: 26.9124,
          longitude: 75.7873,
        },
        drop: {
          name: 'Customer',
          phone: '9876543211',
          address: 'Customer Address',
          latitude: 26.9150,
          longitude: 75.7900,
        },
        driver: {
          id: 'driver_123',
          name: 'Rajesh Kumar',
          phone: '9876543212',
          vehicleNumber: 'RJ14AB1234',
          vehicleType: '3W',
        },
        estimatedPickupTime: new Date(Date.now() - 3600000),
        estimatedDeliveryTime: new Date(Date.now() - 1800000),
        actualPickupTime: new Date(Date.now() - 3000000),
        actualDeliveryTime: new Date(Date.now() - 1800000),
        metadata: { mock: true },
      };
    }

    if (bookingId.includes('failed')) {
      return {
        bookingId,
        providerBookingId: bookingId,
        status: 'FAILED',
        pickup: {
          name: 'Store',
          phone: '9876543210',
          address: 'Malviya Nagar',
          latitude: 26.9124,
          longitude: 75.7873,
        },
        drop: {
          name: 'Customer',
          phone: '9876543211',
          address: 'Customer Address',
          latitude: 26.9150,
          longitude: 75.7900,
        },
        metadata: { mock: true, reason: 'No drivers available' },
      };
    }

    // Default to driver assigned
    return {
      bookingId,
      providerBookingId: bookingId,
      status: 'DRIVER_ASSIGNED',
      pickup: {
        name: 'Store',
        phone: '9876543210',
        address: 'Malviya Nagar',
        latitude: 26.9124,
        longitude: 75.7873,
      },
      drop: {
        name: 'Customer',
        phone: '9876543211',
        address: 'Customer Address',
        latitude: 26.9150,
        longitude: 75.7900,
      },
      driver: {
        id: 'driver_123',
        name: 'Rajesh Kumar',
        phone: '9876543212',
        vehicleNumber: 'RJ14AB1234',
        vehicleType: '3W',
        currentLatitude: 26.9130,
        currentLongitude: 75.7880,
      },
      estimatedPickupTime: new Date(Date.now() + 10 * 60 * 1000),
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000),
      metadata: { mock: true },
    };
  }

  async cancelDelivery(bookingId: string, reason?: string): Promise<CancellationResult> {
    await this.delay();

    return {
      bookingId,
      cancelled: true,
      reason: reason || 'Customer cancelled',
      refundAmount: 40,
      metadata: {
        mock: true,
        cancelledAt: new Date(),
      },
    };
  }

  async verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean> {
    await this.delay();

    // In mock mode, accept any signature that starts with 'mock_'
    return signature.startsWith('mock_');
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.mockDelay));
  }
}

// Singleton instance
export const mockDeliveryProvider = new MockDeliveryProvider(500);
