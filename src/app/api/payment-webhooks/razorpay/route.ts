import crypto from "crypto";
import { NextResponse } from "next/server";
import { addDonation } from "@/lib/donations/add-donation";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    const signature = req.headers.get(
      "x-razorpay-signature"
    );

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET!
      )
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    if (payload.event !== "payment.captured") {
      return NextResponse.json({
        ignored: true,
      });
    }

    const payment =
      payload.payload.payment.entity;

    await addDonation({
      source: "razorpay",
      donorName:
        payment.email ??
        payment.contact ??
        "Anonymous",
      amount: payment.amount / 100,
      currency: payment.currency,
      transactionId: payment.id,
      message: null,
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