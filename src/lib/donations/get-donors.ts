import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 25;

export async function getDonors(page = 1) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [donationsResult, countResult] = await Promise.all([
    supabase
      .from('donations')
      .select(`
        id,
        donor_name,
        amount_usd,
        message,
        donated_at
      `)
      .order('donated_at', {
        ascending: false,
      })
      .range(from, to),

    supabase
      .from('donations')
      .select('id', {
        count: 'exact',
        head: true,
      }),
  ]);

  if (donationsResult.error) {
    throw donationsResult.error;
  }

  return {
    totalDonors: countResult.count ?? 0,
    totalPages: Math.ceil(
      (countResult.count ?? 0) / PAGE_SIZE
    ),
    donations: donationsResult.data ?? [],
  };
}