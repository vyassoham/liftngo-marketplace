/**
 * Marketplace Validation Utilities
 * Helper functions for data validation
 */

import { z } from 'zod';
import {
  StorePublicConfigSchema,
  StorePrivateProfileSchema,
  CartSchema,
  OrderSchema,
  CustomerAddressSchema,
} from '../schemas';

/**
 * Validate store public configuration
 */
export function validateStorePublicConfig(data: unknown) {
  return StorePublicConfigSchema.safeParse(data);
}

/**
 * Validate store private profile
 */
export function validateStorePrivateProfile(data: unknown) {
  return StorePrivateProfileSchema.safeParse(data);
}

/**
 * Validate cart data
 */
export function validateCart(data: unknown) {
  return CartSchema.safeParse(data);
}

/**
 * Validate order data
 */
export function validateOrder(data: unknown) {
  return OrderSchema.safeParse(data);
}

/**
 * Validate customer address
 */
export function validateCustomerAddress(data: unknown) {
  return CustomerAddressSchema.safeParse(data);
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate GSTIN (Indian GST identification number)
 */
export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

/**
 * Validate postal code (Indian PIN code)
 */
export function validatePostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9][0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Validate latitude
 */
export function validateLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90;
}

/**
 * Validate longitude
 */
export function validateLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180;
}

/**
 * Validate URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate time format (HH:MM)
 */
export function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validate slug format
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Validate store is currently open based on business hours
 */
export function isStoreOpen(businessHours: Array<{ dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }>): boolean {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = businessHours.find((bh) => bh.dayOfWeek === currentDay);
  
  if (!todayHours || todayHours.isClosed) {
    return false;
  }

  const [openHour, openMinute] = todayHours.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.closeTime.split(':').map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  // Handle overnight closing (e.g., 22:00 to 02:00)
  if (closeMinutes < openMinutes) {
    return currentTime >= openMinutes || currentTime < closeMinutes;
  }

  return currentTime >= openMinutes && currentTime < closeMinutes;
}

/**
 * Validate order amount limits
 */
export function validateOrderAmount(
  amount: number,
  minAmount: number,
  maxAmount?: number
): { valid: boolean; reason?: string } {
  if (amount < minAmount) {
    return { valid: false, reason: `Minimum order amount is ₹${minAmount}` };
  }

  if (maxAmount && amount > maxAmount) {
    return { valid: false, reason: `Maximum order amount is ₹${maxAmount}` };
  }

  return { valid: true };
}

/**
 * Validate cart item quantity
 */
export function validateCartItemQuantity(quantity: number, maxQuantity: number = 99): boolean {
  return quantity >= 1 && quantity <= maxQuantity;
}

/**
 * Validate cart store consistency
 */
export function validateCartStoreConsistency(
  cartStoreId: string | null,
  newStoreId: string
): { valid: boolean; hasConflict: boolean } {
  if (!cartStoreId) {
    return { valid: true, hasConflict: false };
  }

  return {
    valid: cartStoreId === newStoreId,
    hasConflict: cartStoreId !== newStoreId,
  };
}

/**
 * Validate product availability
 */
export function validateProductAvailability(
  inStock: boolean,
  stockCount?: number,
  requestedQuantity: number = 1
): { valid: boolean; reason?: string } {
  if (!inStock) {
    return { valid: false, reason: 'Product is out of stock' };
  }

  if (stockCount !== undefined && stockCount < requestedQuantity) {
    return { valid: false, reason: `Only ${stockCount} items available` };
  }

  return { valid: true };
}

/**
 * Validate delivery address serviceability
 */
export function validateDeliveryServiceability(
  storeLocation: { latitude: number; longitude: number; serviceAreaKm: number },
  customerLocation: { latitude: number; longitude: number }
): { serviceable: boolean; distanceKm?: number } {
  const distance = calculateDistance(
    storeLocation.latitude,
    storeLocation.longitude,
    customerLocation.latitude,
    customerLocation.longitude
  );

  return {
    serviceable: distance <= storeLocation.serviceAreaKm,
    distanceKm: distance,
  };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate order status transition
 */
export function validateOrderStatusTransition(
  currentStatus: string,
  newStatus: string,
  validTransitions: Record<string, string[]>
): boolean {
  const allowedTransitions = validTransitions[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Validate file upload (image)
 */
export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
}

/**
 * Validate offer validity
 */
export function validateOfferValidity(
  offer: {
    validFrom: string;
    validUntil: string;
    currentUses: number;
    maxUses?: number;
  }
): { valid: boolean; reason?: string } {
  const now = new Date();
  const validFrom = new Date(offer.validFrom);
  const validUntil = new Date(offer.validUntil);

  if (now < validFrom) {
    return { valid: false, reason: 'Offer has not started yet' };
  }

  if (now > validUntil) {
    return { valid: false, reason: 'Offer has expired' };
  }

  if (offer.maxUses && offer.currentUses >= offer.maxUses) {
    return { valid: false, reason: 'Offer has reached maximum uses' };
  }

  return { valid: true };
}

/**
 * Validate business hours array
 */
export function validateBusinessHours(businessHours: Array<{ dayOfWeek: number; openTime: string; closeTime: string }>): boolean {
  // Check if all days (0-6) are covered
  const daysCovered = new Set(businessHours.map((bh) => bh.dayOfWeek));
  if (daysCovered.size !== 7) {
    return false;
  }

  // Validate time formats
  for (const bh of businessHours) {
    if (!validateTimeFormat(bh.openTime) || !validateTimeFormat(bh.closeTime)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate product variant selection
 */
export function validateVariantSelection(
  variants: Array<{ id: string; available: boolean }>,
  selectedVariantId?: string
): { valid: boolean; variant?: any } {
  if (!selectedVariantId) {
    return { valid: true }; // Variant selection is optional
  }

  const variant = variants.find((v) => v.id === selectedVariantId);
  if (!variant) {
    return { valid: false };
  }

  if (!variant.available) {
    return { valid: false };
  }

  return { valid: true, variant };
}

/**
 * Validate add-on selection
 */
export function validateAddOnSelection(
  addOnGroups: Array<{
    groupId: string;
    groupName: string;
    type: 'SINGLE' | 'MULTIPLE';
    required: boolean;
    minSelection: number;
    maxSelection?: number;
    options: Array<{ id: string; available: boolean }>;
  }>,
  selectedAddOns: Array<{ groupId: string; optionId: string }>
): { valid: boolean; error?: string } {
  for (const group of addOnGroups) {
    const groupSelections = selectedAddOns.filter((sa) => sa.groupId === group.groupId);
    const selectionCount = groupSelections.length;

    // Check required groups
    if (group.required && selectionCount === 0) {
      return { valid: false, error: `${group.groupName} is required` };
    }

    // Check minimum selection
    if (selectionCount < group.minSelection) {
      return { valid: false, error: `Select at least ${group.minSelection} option(s) from ${group.groupName}` };
    }

    // Check maximum selection
    if (group.maxSelection && selectionCount > group.maxSelection) {
      return { valid: false, error: `Select at most ${group.maxSelection} option(s) from ${group.groupName}` };
    }

    // Check single selection
    if (group.type === 'SINGLE' && selectionCount > 1) {
      return { valid: false, error: `Select only one option from ${group.groupName}` };
    }

    // Validate selected options are available
    for (const selection of groupSelections) {
      const option = group.options.find((o) => o.id === selection.optionId);
      if (!option || !option.available) {
        return { valid: false, error: 'Selected option is not available' };
      }
    }
  }

  return { valid: true };
}
