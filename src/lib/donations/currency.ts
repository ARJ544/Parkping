export async function convertToUSD(
  amount: number,
  currency: string
) {
  if (currency === "USD") {
    return amount;
  }

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/${currency}/USD`
  );

  const data = await response.json();

  return Number(
    (amount * data.rate).toFixed(2)
  );
}