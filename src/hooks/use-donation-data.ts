'use client';

import { useEffect, useState } from 'react';

interface DonationData {
  month: string;
  received: number;
  target: number;
  percentage: number;
}

export function useDonationData() {
  const [data, setData] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/donations/current', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch donation data');
        }

        const json = await res.json();

        setData(json);
      } catch (err) {
        console.error(err);

        setData({
          month: '',
          received: 0,
          target: 150,
          percentage: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading };
}