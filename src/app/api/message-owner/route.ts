import { getUserByFinderId } from '@/lib/api-helpers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function sanitizeMessageParam(text: string): string {
  return text
    .replace(/\r\n/g, " ")
    .replace(/[\r\n]/g, " ")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\{\{.*?\}\}/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, 500);
}

export async function POST(request: Request) {

  const cookieStore = await cookies();
  const senderFinderId = cookieStore.get("finder_id")?.value;
  const receiverFinderId = cookieStore.get("receiver_finder_id")?.value;
  const whatsAppPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const whatsAppToken = process.env.WHATSAPP_PERMANENT_TOKEN;
  if (!whatsAppPhoneNumberId || !whatsAppToken) {
    return NextResponse.json(
      { error: { message: "WhatsApp configuration is missing" } },
      { status: 500 }
    );
  }

  if (!receiverFinderId) {
    return NextResponse.json(
      { error: { message: "Receiver not found. Please refresh the page." } },
      { status: 404 }
    );
  }

  if (senderFinderId && receiverFinderId === senderFinderId) {
    return NextResponse.json(
      { error: { message: "Please do not message yourself." } },
      { status: 404 }
    );
  }

  const { alertMessage } = await request.json();

  if (!alertMessage || !alertMessage.trim()) {
    return NextResponse.json(
      { error: { message: "Please enter a message" } },
      { status: 400 }
    );
  }

  const recipientBsuidResult = await getUserByFinderId(receiverFinderId);
  if (!recipientBsuidResult.success) {
    return NextResponse.json(
      { error: { message: "Receiver not found. Please refresh the page." } },
      { status: 404 }
    );
  }

  const recipientBsuid = recipientBsuidResult.user?.bsuid;
  if (!recipientBsuid) {
    return NextResponse.json(
      { error: { message: "Receiver has not connected their WhatsApp yet but you can still contact them via Call." } },
      { status: 404 }
    );
  }

  const bsuid = recipientBsuid;

  let formattedMessage = sanitizeMessageParam(alertMessage);

  if (formattedMessage.length > 500) {
    return NextResponse.json(
      { error: { message: "Message too long (max 500 characters)" } },
      { status: 400 }
    );
  }

  const message = `To: ${bsuid}\n\nMessage: ${formattedMessage}`;
  const encodedMessage = encodeURIComponent(message);

  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
  return NextResponse.json({ success: true, waLink });

}
