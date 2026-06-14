'use client';

import { createContext, useContext } from 'react';
import { useDonationData } from '@/hooks/use-donation-data';

const DonationContext = createContext<any>(null);

export function DonationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const donation = useDonationData();

  return (
    <DonationContext.Provider value={donation}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const ctx = useContext(DonationContext);

  if (!ctx) {
    throw new Error('useDonation must be inside DonationProvider');
  }

  return ctx;
}