import { NextResponse } from "next/server";
import { getCurrentMonthDonation } from "@/lib/donations/get-current-month";

export async function GET() {
  try {
    const data =
      await getCurrentMonthDonation();

    const percentage = Math.min(
      Math.round(
        (Number(data.received_amount) /
          Number(data.target_amount)) *
        100
      ),
      100
    );

    return NextResponse.json({
      month: data.month_year,
      received: Number(data.received_amount),
      target: Number(data.target_amount),
      percentage,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch donation data",
      },
      { status: 500 }
    );
  }
}