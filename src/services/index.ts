/**
 * @deprecated Use imports from @/features/trips/services or @/api/services instead.
 */
export { default as apiClient } from '@/api/client';
export * from '@/api/services/bookingService';
export * from '@/api/services/driverService';

// Re-export socket and lifecycle services from the new features path
export { socketService } from '@/features/trips/services/socket';
export { customerTripLifecycle } from '@/features/trips/services/customerTripLifecycle';
export { customerEventEngine } from '@/features/trips/services/customerEventEngine';
