import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateOTP, hashOTP, validatePhoneNumber } from "@/lib/otp-helper";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const OTP_EXPIRY_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 60;

function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "127.0.0.1";
}

async function sendWhatsAppOTP(
  to: string,
  otp: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: {
            body: otp,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp OTP:", error);
    return false;
  }
}

async function checkDeviceBlockStatus(ipAddress: string) {
  const { data, error } = await supabase
    .from("device_blocks")
    .select("*")
    .eq("ip_address", ipAddress)
    .maybeSingle();

  if (error) {
    console.error("Block check error:", error);

    return {
      allowed: false,
      error: "Security check failed",
    };
  }

  if (!data) {
    return { allowed: true };
  }

  if (
    data.blocked_until &&
    new Date(data.blocked_until).getTime() > Date.now()
  ) {
    const minutesLeft = Math.ceil(
      (new Date(data.blocked_until).getTime() -
        Date.now()) /
      1000 /
      60
    );

    return {
      allowed: false,
      error: `This device is temporarily blocked. Try again in ${minutesLeft} minute(s).`,
    };
  }

  if (
    data.blocked_until &&
    new Date(data.blocked_until).getTime() <= Date.now()
  ) {
    await supabase
      .from("device_blocks")
      .delete()
      .eq("ip_address", ipAddress);
  }

  return { allowed: true };
}

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    const ipAddress = getClientIp(req);

    if (!phoneNumber) {
      return NextResponse.json(
        {
          error: "Phone number is required",
        },
        {
          status: 400,
        }
      );
    }

    const validation = validatePhoneNumber(phoneNumber);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
        },
        {
          status: 400,
        }
      );
    }

    const formattedPhone = validation.formatted!;

    const deviceStatus =
      await checkDeviceBlockStatus(ipAddress);

    if (!deviceStatus.allowed) {
      return NextResponse.json(
        {
          error: deviceStatus.error,
        },
        {
          status: 429,
        }
      );
    }

    const { data: existingOtp } = await supabase
      .from("user_otps")
      .select("last_sent_at")
      .eq("phone_number", formattedPhone)
      .maybeSingle();

    if (existingOtp?.last_sent_at) {
      const secondsSinceLastSend = Math.floor(
        (Date.now() -
          new Date(
            existingOtp.last_sent_at
          ).getTime()) /
        1000
      );

      if (
        secondsSinceLastSend <
        OTP_COOLDOWN_SECONDS
      ) {
        return NextResponse.json(
          {
            error: `Please wait ${OTP_COOLDOWN_SECONDS -
              secondsSinceLastSend
              } seconds before requesting another OTP.`,
          },
          {
            status: 429,
          }
        );
      }
    }

    const plainOTP = generateOTP();

    const hashedOTP = await hashOTP(plainOTP);

    const whatsappSent = await sendWhatsAppOTP(formattedPhone, plainOTP);

    if (!whatsappSent) {
      return NextResponse.json(
        {
          error:
            "Failed to send OTP. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    const expiresAt = new Date(
      Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
    ).toISOString();

    const { error: otpError } = await supabase
      .from("user_otps")
      .upsert(
        {
          phone_number: formattedPhone,
          otp_code: hashedOTP,

          expires_at: expiresAt,

          attempts: 0,

          locked_until: null,

          last_sent_at:
            new Date().toISOString(),

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "phone_number",
        }
      );

    if (otpError) {
      console.error("OTP database error:", otpError);

      return NextResponse.json(
        {
          error: "Failed to generate OTP",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        message: "OTP sent successfully",

        expiresIn: OTP_EXPIRY_MINUTES * 60,

        phoneDisplayed: formattedPhone.slice(-4).padStart(formattedPhone.length, "*"),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "OTP send error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
