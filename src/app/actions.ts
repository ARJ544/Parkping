"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserCookie = {
  loggedin: boolean;
  session_id: string;
  id?: string;
  phone_num?: string;
  verified: boolean;
};

export async function IsLoggedIn() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id");
  const session_id = cookieStore.get("session_id");
  return Boolean(id && session_id);
}

export async function IsVerified() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("verified");
  return verified?.value === "true";
}

export async function getTempPhoneId() {
  const cookieStore = await cookies();
  const temp_phone_id = cookieStore.get("temp_phone_id");
  return temp_phone_id?.value;
}

export async function setAllCookie(user: Partial<UserCookie>) {
  const cookieStore = await cookies();

  const SEVEN_DAYS = 60 * 60 * 24 * 7;

  if (user.session_id)
    cookieStore.set("session_id", String(user.session_id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  if (user.id)
    cookieStore.set("id", user.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  if (user.phone_num)
    cookieStore.set("phone_num", user.phone_num.slice(-4), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  cookieStore.set("loggedin", String(user.loggedin ?? (Boolean(user.id && user.session_id))), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  cookieStore.set("verified", String(user.verified ?? false), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function deleteAllCookie() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;

  if (id) {
    const { supabase } = await import("@/lib/api-helpers");

    await supabase
      .from("simplified_users")
      .update({
        session_id: null,
        session_expires_at: null,
      })
      .eq("id", id);
  }

  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  redirect("/signin");
}

export async function deleteTempPhone() {
  const cookieStore = await cookies();
  cookieStore.delete("temp_phone_id");
  cookieStore.delete("temp_phone_num");
}

export async function getAllCookie(): Promise<UserCookie> {
  const cookieStore = await cookies();
  const get = (name: string) => cookieStore.get(name)?.value;

  const loggedin = Boolean(get("id") && get("session_id"));
  const verified = get("verified") === "true";

  return {
    loggedin,
    verified,
    session_id: get("session_id") || "",
    id: get("id"),
    phone_num: get("phone_num"),
  };
}

export async function revalidateLayout() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/");
  revalidatePath("/qr");
}
