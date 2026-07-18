'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  cancelTripPatch,
  createTrip,
  type CreateTripPayload,
  type TripResponse,
} from '@/api/services/tripService';
import { customerTripLifecycle } from '../services/customerTripLifecycle';
import { useTripStore, TripStatus } from '../store/tripStore';

export function useCustomerTripRealtime(userId: string | null | undefined) {
  const { connectionState, currentTrip, status, isSearching, driver, driverLocation, hasHydrated } =
    useTripStore((state) => ({
      connectionState: state.connectionState,
      currentTrip: state.currentTrip,
      status: state.status,
      isSearching: state.isSearching,
      driver: state.driver,
      driverLocation: state.driverLocation,
      hasHydrated: state.hasHydrated,
    }));

  useEffect(() => {
    if (!userId) return;
    customerTripLifecycle.start(userId);
    return () => customerTripLifecycle.stop();
  }, [userId]);

  const createTripMutation = useMutation<TripResponse, Error, CreateTripPayload>({
    mutationFn: createTrip,
    onMutate: (payload) => {
      const optimisticTrip = {
        id: `temp-${Date.now()}`,
        status: TripStatus.SEARCHING,
        originAddress: payload.origin.address,
        destinationAddress: payload.destination.address,
      };
      customerTripLifecycle.markTripCreated(optimisticTrip);
    },
    onSuccess: (trip) => {
      customerTripLifecycle.markTripCreated({
        ...trip,
        status: TripStatus.SEARCHING,
      });
    },
    onError: () => {
      useTripStore.getState().resetTrip();
    },
  });

  const cancelTripMutation = useMutation<void, Error, { tripId: string; reason?: string }>({
    mutationFn: ({ tripId, reason }) => cancelTripPatch(tripId, reason),
    onSettled: () => {
      useTripStore.getState().resetTrip();
    },
  });

  return {
    connectionState,
    currentTrip,
    status,
    tripStatus: status,
    isSearching,
    driver,
    driverLocation,
    hasHydrated,
    createTripMutation,
    cancelTripMutation,
    syncActiveTrip: () => customerTripLifecycle.syncActiveTrip(),
  };
}
export default useCustomerTripRealtime;
