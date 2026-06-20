import { supabase } from "@/lib/api-helpers";
import { convertToUSD } from "@/lib/donations/currency";

const roundToTwoDecimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export async function addDonation({
  source,
  donorName,
  amount,
  currency,
  transactionId,
  message,
}: {
  source: "kofi" | "razorpay";
  donorName?: string | null;
  amount: number;
  currency: string;
  transactionId: string;
  message?: string | null;
}) {
  const existing = await supabase
    .from("donations")
    .select("id")
    .eq("transaction_id", transactionId)
    .maybeSingle();

  if (existing.data) {
    return;
  }

  const amountUsd = await convertToUSD(
    amount,
    currency.toUpperCase()
  );

  const now = new Date();

  const monthYear = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  await supabase
    .from("monthly_donations")
    .upsert(
      {
        month_year: monthYear,
      },
      {
        onConflict: "month_year",
      }
    );

  await supabase.from("donations").insert({
    source,
    donor_name: donorName,
    amount_original: amount,
    currency_original: currency,
    amount_usd: amountUsd,
    transaction_id: transactionId,
    message,
  });

  const { data: month } = await supabase
    .from("monthly_donations")
    .select("received_amount")
    .eq("month_year", monthYear)
    .single();

  await supabase
    .from("monthly_donations")
    .update({
      received_amount: roundToTwoDecimals(Number(month?.received_amount ?? 0) + amountUsd),
    })
    .eq("month_year", monthYear);
}