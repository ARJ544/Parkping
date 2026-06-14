'use client';

import React, { useState } from 'react';
import { DonationBanner } from './DonationBanner';
import { FloatingDonateButton } from './FloatingDonateButton';
import { DonationModal } from './DonationModal';
import { useDonation } from '@/providers/DonationProvider';

export function LayoutDonationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useDonation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const current = data?.received ?? 0;
  const target = data?.target ?? 150;
  const percentage = data?.percentage ?? 0;

  return (
    <>
      <DonationBanner
        current={current}
        target={target}
        percentage={percentage}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {children}

      <FloatingDonateButton
        onOpenModal={() => setIsModalOpen(true)}
      />

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}