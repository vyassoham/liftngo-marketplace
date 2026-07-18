/**
 * Payment Provider Interface
 * Defines the contract for payment providers (Razorpay, Stripe, etc.)
 */

export interface PaymentProvider {
  /**
   * Create a payment order
   */
  createOrder(params: CreateOrderParams): Promise<PaymentOrder>;

  /**
   * Verify payment webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean>;

  /**
   * Process refund
   */
  processRefund(params: RefundParams): Promise<RefundResult>;

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}

export interface CreateOrderParams {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  description: string;
  notes?: Record<string, string>;
  callbackUrl?: string;
  idempotencyKey?: string;
}

export interface PaymentOrder {
  orderId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'completed' | 'failed';
  paymentLink?: string;
  paymentKey?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface RefundParams {
  paymentId: string;
  amount: number;
  reason?: string;
  notes?: Record<string, string>;
}

export interface RefundResult {
  refundId: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface PaymentStatus {
  paymentId: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
}

export type PaymentProviderType = 'RAZORPAY' | 'STRIPE' | 'PHONEPE' | 'GPAY';
