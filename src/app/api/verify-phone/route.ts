import { setAllCookie } from "@/app/actions";
import { supabase } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import { generateSecretCode } from "@/lib/api-helpers";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { user_json_url } = await req.json();

  const response = await fetch(user_json_url);
  const data = await response.json();

  if (!data.user_country_code || !data.user_phone_number) {
    return NextResponse.json(
      { error: "Phone verification failed" },
      { status: 400 },
    );
  }

  const verifiedPhone = `${data.user_country_code}${data.user_phone_number}`;

  if (!verifiedPhone) {
    return NextResponse.json(
      { error: "Phone number not found!" },
      { status: 403 },
    );
  }
  const finder_id = generateSecretCode();
  const token = generateSecretCode();

  const session_id = randomUUID();
  const session_expires_at = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: getExistingUserData, error: getExistingUserError } = await supabase
    .from("simplified_users")
    .select("id, phone_num, session_id")
    .eq("phone_num", verifiedPhone)
    .maybeSingle();

  if (getExistingUserError || !getExistingUserData) {
    const { data: insertData, error: insertError } = await supabase
      .from("simplified_users")
      .insert({
        phone_num: verifiedPhone,
        finder_id: finder_id,
        token: token,
        session_id: session_id,
        session_expires_at: session_expires_at,
      })
      .select("id, phone_num, session_id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    await setAllCookie({
      loggedin: true,
      id: insertData.id,
      session_id: insertData.session_id,
      phone_num: insertData.phone_num,
      verified: true,
    });
  } else {
    const { error: sessionError } = await supabase
      .from("simplified_users")
      .update({
        session_id: session_id,
        session_expires_at: session_expires_at,
      })
      .eq("id", getExistingUserData.id);

    if (sessionError) {
      return NextResponse.json(
        { error: sessionError.message },
        { status: 500 }
      );
    }
    await setAllCookie({
      loggedin: true,
      id: getExistingUserData.id,
      session_id: session_id,
      phone_num: getExistingUserData.phone_num,
      verified: true,
    });
  }

  return NextResponse.json({ success: true });
}
