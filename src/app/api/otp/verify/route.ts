import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/api-helpers";
import { validatePhoneNumber, verifyOTP } from "@/lib/otp-helper";
import { setAllCookie } from "@/app/actions";
import { IsVerified } from "@/app/actions";
import crypto, { randomUUID } from "crypto";

const ONE_HOUR = 60 * 60;
const MAX_OTP_ATTEMPTS = 5;

function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "127.0.0.1";
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
      error: `This device is temporarily blocked.Try again in ${minutesLeft} minute(s).`,
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

export function generateSecretCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  const chars = [...bytes].map(b => (b % 36).toString(36)).join("");
  return chars.slice(0, 7) + "-" + chars.slice(7);
}

async function recordFailedAttempt(
  ipAddress: string,
  phoneNumber: string,
  currentOtpAttempts: number
) {
  const newOtpAttempts = currentOtpAttempts + 1;

  let phoneLockedUntil: string | null = null;

  if (newOtpAttempts >= MAX_OTP_ATTEMPTS) {
    phoneLockedUntil = new Date(
      Date.now() + ONE_HOUR * 1000
    ).toISOString();
  }

  await supabase
    .from("user_otps")
    .update({
      attempts: newOtpAttempts,
      locked_until: phoneLockedUntil,
      updated_at: new Date().toISOString(),
    })
    .eq("phone_number", phoneNumber);

  const { data: deviceData } = await supabase
    .from("device_blocks")
    .select("failed_attempts")
    .eq("ip_address", ipAddress)
    .maybeSingle();

  const currentDeviceAttempts = deviceData?.failed_attempts ?? 0;

  const newDeviceAttempts = currentDeviceAttempts + 1;

  let blockedUntil: string | null = null;

  if (newDeviceAttempts >= MAX_OTP_ATTEMPTS) {
    blockedUntil = new Date(
      Date.now() + ONE_HOUR * 1000
    ).toISOString();
  }

  await supabase
    .from("device_blocks")
    .upsert(
      {
        ip_address: ipAddress,
        failed_attempts: newDeviceAttempts,
        blocked_until: blockedUntil,
        last_attempt_at:
          new Date().toISOString(),
      },
      {
        onConflict: "ip_address",
      }
    );

  if (phoneLockedUntil || blockedUntil) {
    return "Too many failed attempts. Try again in 1 hour.";
  }

  const remainingAttempts = Math.max(0, MAX_OTP_ATTEMPTS - newOtpAttempts);

  return `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`;
}

export async function POST(req: Request) {
  try {
    const { phoneNumber, otpCode, route, } = await req.json();

    const ipAddress = getClientIp(req);

    if (!phoneNumber || !otpCode || !route) {
      return NextResponse.json(
        {
          error:
            "Phone number, OTP code, and route are required",
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

    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        {
          error: "Invalid OTP format",
        },
        {
          status: 400,
        }
      );
    }

    const deviceStatus = await checkDeviceBlockStatus(ipAddress);

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

    const { data: otpRecord, error: selectError, } = await supabase
      .from("user_otps")
      .select("otp_code, expires_at, attempts, locked_until")
      .eq("phone_number", formattedPhone)
      .maybeSingle();

    if (selectError) {
      console.error("OTP lookup error:", selectError);

      return NextResponse.json(
        {
          error:
            "Failed to verify OTP",
        },
        {
          status: 500,
        }
      );
    }

    if (!otpRecord) {
      return NextResponse.json(
        {
          error:
            "OTP expired or not found. Please request a new one.",
          expiresIn: 0,
        },
        {
          status: 400,
        }
      );
    }

    if (
      otpRecord.locked_until && new Date(otpRecord.locked_until).getTime() > Date.now()
    ) {
      const minutesLeft =
        Math.ceil(
          (new Date(otpRecord.locked_until).getTime() - Date.now()) / 1000 / 60
        );

      return NextResponse.json(
        {
          error: `Too many failed attempts.Try again in ${minutesLeft} minute(s).`,
        },
        {
          status: 429,
        }
      );
    }

    if (new Date(otpRecord.expires_at).getTime() <= Date.now()) {
      return NextResponse.json(
        {
          error:
            "OTP expired. Please request a new OTP.",
        },
        {
          status: 400,
        }
      );
    }

    const isValidOTP = await verifyOTP(otpCode, otpRecord.otp_code);

    if (!isValidOTP) {
      const errorMessage = await recordFailedAttempt(ipAddress, formattedPhone, otpRecord.attempts ?? 0);

      return NextResponse.json(
        {
          error: errorMessage,
        },
        {
          status: 400,
        }
      );
    }

    await supabase
      .from("user_otps")
      .delete()
      .eq("phone_number", formattedPhone
      );

    await supabase
      .from("device_blocks")
      .delete()
      .eq("ip_address", ipAddress
      );

    const cookieStore = await cookies();

    const session_id = randomUUID();
    const session_expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    if (route === "verify-phone-unknown-user") {
      // Delete
      await supabase
        .from("temporary_phone")
        .delete()
        .eq("temp_phone", formattedPhone);

      // Create
      const { data: tempPhoneData, error: tempPhoneError } = await supabase
        .from("temporary_phone")
        .insert({
          temp_phone: formattedPhone,
        })
        .select("id, temp_phone")
        .single();

      if (tempPhoneError || !tempPhoneData) {
        console.error("Temporary phone insert failed:", tempPhoneError);
        return NextResponse.json(
          { error: tempPhoneError?.message ?? "Failed" },
          { status: 500 }
        );
      }

      cookieStore.set("temp_phone_id", tempPhoneData.id, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: ONE_HOUR,
      });

      cookieStore.set("temp_phone_num", formattedPhone.slice(-4), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: ONE_HOUR,
      });
      const isValidUser = await IsVerified();
      if (!isValidUser) {
        cookieStore.set("verified", "true", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: ONE_HOUR,
        });
      }

      return NextResponse.json(
        { success: true, message: "Phone verified successfully" },
        { status: 200 }
      );
    }

    if (route === "update") {
      const id = cookieStore.get("id")?.value;

      if (!id) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from("simplified_users")
        .update({ phone_num: formattedPhone, session_id: session_id, session_expires_at: session_expires_at })
        .eq("id", id)
        .select("id, phone_num, session_id")
        .single();

      if (updateError) {
        if (updateError.code === "23505") {
          return NextResponse.json(
            { error: "Phone number already registered" },
            { status: 409 }
          );
        }
        console.error("Phone update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update phone number" },
          { status: 500 }
        );
      }

      await setAllCookie({
        loggedin: true,
        id: updatedUser.id,
        session_id: session_id,
        phone_num: updatedUser.phone_num,
        verified: true,
      });

      return NextResponse.json(
        { success: true, message: "Phone number updated successfully" },
        { status: 200 }
      );
    }

    if (route === "verify-phone") {
      const { data: user, error: userError } = await supabase
        .from("simplified_users")
        .select("id")
        .eq("phone_num", formattedPhone)
        .maybeSingle();

      if (userError) {
        console.error("User lookup error:", userError);
        return NextResponse.json(
          { error: "Failed to verify phone" },
          { status: 500 }
        );
      }

      // New User
      if (!user) {
        const finder_id = generateSecretCode();
        const token = generateSecretCode();

        const { data: newUser, error: insertError } = await supabase
          .from("simplified_users")
          .insert({
            phone_num: formattedPhone,
            finder_id: finder_id,
            token: token,
            session_id: session_id,
            session_expires_at: session_expires_at,
          })
          .select("id, phone_num")
          .single();

        if (insertError) {
          console.error("User creation error:", insertError);
          return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
          );
        }

        await setAllCookie({
          loggedin: true,
          id: newUser.id,
          session_id: session_id,
          phone_num: newUser.phone_num,
          verified: true,
        });

        return NextResponse.json(
          {
            success: true,
            message: "Account created and verified",
          },
          { status: 200 }
        );
      }

      // Existing User
      const { data: existingUser, error: updateError } = await supabase
        .from("simplified_users")
        .update({
          session_id: session_id,
          session_expires_at: session_expires_at,
        })
        .eq("id", user.id)
        .select("phone_num")
        .single();

      if (updateError || !existingUser) {
        console.error("User session update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update session" },
          { status: 500 }
        );
      }

      await setAllCookie({
        loggedin: true,
        id: user.id,
        session_id,
        phone_num: existingUser.phone_num,
        verified: true,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Phone verified successfully",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid route type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
