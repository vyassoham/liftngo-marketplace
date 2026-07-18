'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, Package, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/lib/marketplace/constants';

interface OrderTrackingProps {
  trackingToken: string;
}

// Mock order data - will be replaced with real data from API
const MOCK_ORDER = {
  publicOrderNumber: 'ORD-2024-001234',
  publicTrackingToken: 'ABC123XYZ',
  storeName: 'Spice Kitchen',
  storeLogo: '/images/marketplace/stores/spice-kitchen/logo.png',
  status: 'OUT_FOR_DELIVERY',
  paymentStatus: 'PAID',
  deliveryStatus: 'OUT_FOR_DELIVERY',
  total: 590,
  currency: 'INR',
  items: [
    {
      productName: 'Dal Baati Churma',
      quantity: 2,
      total: 500,
    },
    {
      productName: 'Tandoori Roti',
      quantity: 4,
      total: 48,
    },
  ],
  deliveryAddress: {
    name: 'Rahul Sharma',
    phone: '9876543210',
    address: '123, Main Street, Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302017',
  },
  driver: {
    name: 'Rajesh Kumar',
    phone: '9876543212',
    vehicleNumber: 'RJ14AB1234',
    vehicleType: '3W',
  },
  timeline: [
    {
      status: 'PAYMENT_CONFIRMED',
      timestamp: new Date(Date.now() - 3600000),
      title: 'Payment Confirmed',
      description: 'Your payment was successful',
    },
    {
      status: 'ORDER_SENT_TO_STORE',
      timestamp: new Date(Date.now() - 3300000),
      title: 'Order Sent to Store',
      description: 'Order sent to Spice Kitchen',
    },
    {
      status: 'MERCHANT_ACCEPTED',
      timestamp: new Date(Date.now() - 3000000),
      title: 'Merchant Accepted',
      description: 'Store accepted your order',
    },
    {
      status: 'PREPARING',
      timestamp: new Date(Date.now() - 2400000),
      title: 'Preparing',
      description: 'Your order is being prepared',
    },
    {
      status: 'DRIVER_ASSIGNED',
      timestamp: new Date(Date.now() - 1200000),
      title: 'Driver Assigned',
      description: 'Rajesh Kumar assigned for delivery',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      timestamp: new Date(Date.now() - 600000),
      title: 'Out for Delivery',
      description: 'Driver is on the way to your location',
    },
  ],
  createdAt: new Date(Date.now() - 3600000),
  estimatedDeliveryTime: new Date(Date.now() + 1800000),
};

export default function OrderTracking({ trackingToken }: OrderTrackingProps) {
  const [order, setOrder] = useState(MOCK_ORDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [trackingToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = order.timeline.findIndex(
    (t) => t.status === order.status
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Track Your Order</h1>
        <p className="mt-2 text-gray-600">Order #{order.publicOrderNumber}</p>
      </div>

      {/* Status Card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {order.deliveryStatus === 'DELIVERED'
                ? 'Delivered successfully'
                : `Estimated delivery by ${order.estimatedDeliveryTime.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Truck className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Timeline</h3>
        <div className="space-y-4">
          {order.timeline.map((event, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={event.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-orange-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  {index < order.timeline.length - 1 && (
                    <div
                      className={`h-12 w-0.5 ${
                        index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {event.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Details</h3>

        {/* Store Info */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
            <img
              src={order.storeLogo}
              alt={order.storeName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.storeName}</p>
            <p className="text-sm text-gray-500">Malviya Nagar, Jaipur</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.productName} x {item.quantity}
              </span>
              <span className="font-medium text-gray-900">₹{item.total}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Delivery Address</h3>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{order.deliveryAddress.name}</p>
          <p className="text-gray-600">{order.deliveryAddress.address}</p>
          <p className="text-gray-600">
            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
          </p>
          <p className="text-gray-600">{order.deliveryAddress.phone}</p>
        </div>
      </div>

      {/* Driver Info */}
      {order.driver && order.status !== 'DELIVERED' && (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Delivery Partner</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{order.driver.name}</p>
              <p className="text-sm text-gray-600">
                {order.driver.vehicleType} - {order.driver.vehicleNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${order.driver.phone}`}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a
                href={`https://wa.me/91${order.driver.phone}`}
                className="flex items-center gap-2 rounded-full border border-green-500 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Contact our support at{' '}
              <a href="tel:7891880088" className="font-medium text-orange-600 hover:underline">
                7891880088
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
