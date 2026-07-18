/**
 * Mock Payment Provider
 * For development and testing purposes
 */

import {
  PaymentProvider,
  CreateOrderParams,
  PaymentOrder,
  RefundParams,
  RefundResult,
  PaymentStatus,
} from './provider';

export class MockPaymentProvider implements PaymentProvider {
  private mockDelay: number;

  constructor(mockDelay: number = 1000) {
    this.mockDelay = mockDelay;
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    await this.delay();

    const providerOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      orderId: params.orderId,
      providerOrderId,
      amount: params.amount,
      currency: params.currency,
      status: 'created',
      paymentLink: `https://mock-payment.example.com/pay/${providerOrderId}`,
      paymentKey: 'mock_key_test',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      metadata: {
        mock: true,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
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

  async processRefund(params: RefundParams): Promise<RefundResult> {
    await this.delay();

    const refundId = `mock_refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      refundId,
      paymentId: params.paymentId,
      amount: params.amount,
      status: 'processed',
      createdAt: new Date(),
      metadata: {
        mock: true,
        reason: params.reason,
      },
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    await this.delay();

    // Mock payment status based on paymentId pattern
    if (paymentId.includes('failed')) {
      return {
        paymentId,
        providerPaymentId: paymentId,
        amount: 0,
        currency: 'INR',
        status: 'failed',
        failedAt: new Date(),
        metadata: { mock: true },
      };
    }

    if (paymentId.includes('refunded')) {
      return {
        paymentId,
        providerPaymentId: paymentId,
        amount: 0,
        currency: 'INR',
        status: 'refunded',
        paidAt: new Date(Date.now() - 3600000),
        refundedAt: new Date(),
        metadata: { mock: true },
      };
    }

    // Default to paid
    return {
      paymentId,
      providerPaymentId: paymentId,
      amount: 500,
      currency: 'INR',
      status: 'paid',
      paidAt: new Date(),
      metadata: { mock: true },
    };
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.mockDelay));
  }
}

// Singleton instance
export const mockPaymentProvider = new MockPaymentProvider(500);
