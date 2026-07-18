'use client';

import { useTripStore, TripStatus, mapTripStatus } from '../store/tripStore';
import { socketService } from './socket';

type EventName =
  | 'trip:searching'
  | 'trip:accepted'
  | 'trip:expired'
  | 'trip:cancelled'
  | 'trip:status'
  | 'location:update';

const DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';
const LOCATION_DEBOUNCE_MS = 300;

const STATE_ORDER: Record<TripStatus, number> = {
  [TripStatus.IDLE]: 0,
  [TripStatus.SEARCHING]: 1,
  [TripStatus.ASSIGNED]: 2,
  [TripStatus.ARRIVING]: 3,
  [TripStatus.ARRIVED]: 4,
  [TripStatus.PICKED_UP]: 5,
  [TripStatus.IN_TRANSIT]: 6,
  [TripStatus.COMPLETED]: 7,
  [TripStatus.CANCELLED]: 8,
  [TripStatus.EXPIRED]: 9,
  [TripStatus.FAILED]: 10,
};

class CustomerEventEngine {
  private processedEventIds = new Set<string>();
  private locationDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private bufferedLocation: { lat: number; lng: number; address?: string } | null = null;

  handleEvent(eventName: EventName, rawPayload: any): void {
    const payload = this.normalizePayload(rawPayload);
    if (!this.isValidEvent(payload, eventName)) return;

    const store = useTripStore.getState();
    const currentTripId = store.currentTrip?.id;
    if (currentTripId && payload.tripId !== currentTripId) {
      this.logIgnored(eventName, payload, 'tripId_mismatch');
      return;
    }

    switch (eventName) {
      case 'trip:searching':
        if (!store.currentTrip) return;
        store.updateStatus(TripStatus.SEARCHING, payload.timestamp);
        return;
      case 'trip:accepted': {
        const driverObj = payload.driver ? {
          id: payload.driver.id,
          name: payload.driver.name || '',
          phone: payload.driver.mobile || '',
          photo: payload.driver.photo,
          rating: payload.driver.rating || undefined,
          vehicleNumber: payload.driver.vehicleNumber || undefined,
          vehicleType: payload.driver.vehicleType || undefined,
        } : null;
        if (driverObj) {
          store.assignDriver(driverObj);
        }
        store.updateStatus(TripStatus.ASSIGNED, payload.timestamp);
        if (store.currentTrip?.id) {
          socketService.instance?.emit('join:trip', { tripId: store.currentTrip.id, role: 'customer' });
        }
        return;
      }
      case 'trip:expired':
        if (store.status === TripStatus.SEARCHING) {
          store.resetTrip();
        }
        return;
      case 'trip:cancelled':
        store.resetTrip();
        return;
      case 'trip:status': {
        const next = mapTripStatus(payload.status);
        if (!next) return;
        if (!this.isTransitionAllowed(store.status, next)) {
          this.logIgnored(eventName, payload, 'invalid_transition');
          return;
        }
        store.updateStatus(next, payload.timestamp);
        if (isTerminalStatus(next)) store.resetTrip();
        return;
      }
      case 'location:update':
        if (STATE_ORDER[store.status] < STATE_ORDER[TripStatus.ASSIGNED]) {
          this.logIgnored(eventName, payload, 'status_not_ready_for_location');
          return;
        }
        if (!payload.location) return;
        
        // Map { latitude, longitude } to { lat, lng }
        const loc = {
          lat: payload.location.latitude ?? payload.location.lat,
          lng: payload.location.longitude ?? payload.location.lng,
          address: payload.location.address,
        };
        
        this.bufferedLocation = loc;
        if (this.locationDebounceTimer) return;
        this.locationDebounceTimer = setTimeout(() => {
          this.locationDebounceTimer = null;
          if (this.bufferedLocation) {
            useTripStore.getState().updateDriverLocation(this.bufferedLocation);
          }
        }, LOCATION_DEBOUNCE_MS);
        return;
      default:
        return;
    }
  }

  private isTransitionAllowed(from: TripStatus, to: TripStatus): boolean {
    // If it's the same status, allow it
    if (from === to) return true;
    // Allow cancellation or expiration anytime
    if (to === TripStatus.CANCELLED || to === TripStatus.EXPIRED || to === TripStatus.FAILED) return true;
    return STATE_ORDER[to] >= STATE_ORDER[from];
  }

  private normalizePayload(payload: any): any & { timestamp: number } {
    const fallback = Date.now();
    const parsed =
      typeof payload.timestamp === 'number'
        ? payload.timestamp
        : payload.timestamp
          ? Date.parse(String(payload.timestamp))
          : fallback;
    return {
      ...payload,
      timestamp: Number.isFinite(parsed) ? parsed : fallback,
    };
  }

  private isValidEvent(
    payload: any & { timestamp: number },
    eventName: EventName,
  ): payload is any & { timestamp: number; tripId: string } {
    if (!payload?.tripId) {
      this.logIgnored(eventName, payload, 'missing_trip_id');
      return false;
    }
    const store = useTripStore.getState();
    if (payload.timestamp < store.lastEventTimestamp) {
      this.logIgnored(eventName, payload, 'stale_timestamp');
      return false;
    }

    const eventId = payload.eventId ?? `${eventName}:${payload.tripId}:${payload.timestamp}`;
    if (this.processedEventIds.has(eventId)) {
      this.logIgnored(eventName, payload, 'duplicate_event');
      return false;
    }
    this.processedEventIds.add(eventId);
    if (this.processedEventIds.size > 500) {
      const first = this.processedEventIds.values().next().value;
      if (first) this.processedEventIds.delete(first);
    }
    return true;
  }

  private logIgnored(eventName: string, payload: unknown, reason: string): void {
    if (!DEBUG) return;
    console.debug('[customer-event-engine] ignored', { eventName, reason, payload });
  }
}

function isTerminalStatus(status: TripStatus): boolean {
  return (
    status === TripStatus.COMPLETED ||
    status === TripStatus.CANCELLED ||
    status === TripStatus.EXPIRED ||
    status === TripStatus.FAILED
  );
}

export const customerEventEngine = new CustomerEventEngine();
