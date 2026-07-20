'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getStoreAvailability,
  type StoreAvailability,
  type StoreAvailabilitySource,
} from '@/lib/marketplace/business-hours';

const StoreAvailabilityContext = createContext<StoreAvailability | null>(null);

export function StoreAvailabilityProvider({
  source,
  initialAvailability,
  children,
}: {
  source: StoreAvailabilitySource;
  initialAvailability: StoreAvailability;
  children: ReactNode;
}) {
  const [availability, setAvailability] = useState(initialAvailability);

  useEffect(() => {
    const refresh = () => setAvailability(getStoreAvailability(source));
    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timer);
  }, [source]);

  return (
    <StoreAvailabilityContext.Provider value={availability}>
      {children}
    </StoreAvailabilityContext.Provider>
  );
}

export function useStoreAvailability(): StoreAvailability {
  const availability = useContext(StoreAvailabilityContext);
  if (!availability) {
    throw new Error('useStoreAvailability must be used inside StoreAvailabilityProvider');
  }
  return availability;
}

export function useOptionalStoreAvailability(): StoreAvailability | null {
  return useContext(StoreAvailabilityContext);
}
