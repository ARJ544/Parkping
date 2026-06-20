import { supabase } from "@/lib/api-helpers";

export async function getCurrentMonthDonation() {
  const now = new Date();

  const monthYear = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("monthly_donations")
    .upsert(
      {
        month_year: monthYear,
      },
      {
        onConflict: "month_year",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}