import { NextResponse } from "next/server";
import { addDonation } from "@/lib/donations/add-donation";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawData = formData.get("data");

    if (!rawData) {
      return NextResponse.json(
        { error: "Missing payload" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(
      rawData.toString()
    );

    if (
      payload.verification_token !==
      process.env.KOFI_VERIFICATION_TOKEN
    ) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await addDonation({
      source: "kofi",
      donorName: payload.from_name,
      amount: Number(payload.amount),
      currency: payload.currency,
      transactionId:
        payload.kofi_transaction_id,
      message: payload.message,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}