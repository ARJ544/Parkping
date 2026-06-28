"use server"
import { authenticateUser } from "@/lib/api-helpers";
import { supabase } from "@/lib/api-helpers";

export async function muteCalls(value: number | "forever") {
  const authResult = await authenticateUser(true);

  if (!authResult.success) {
    return {
      success: false,
      message: "Unable to authorize.",
    };
  }

  let muteCallTillValue: string;

  if (value === "forever") {
    muteCallTillValue = "forever";
  } else {
    muteCallTillValue = String(value);
  }

  const { error } = await supabase
    .from("simplified_users")
    .update({
      mute_call_till: muteCallTillValue,
    })
    .eq("id", authResult.user.id);

  if (error) {
    return { success: false, message: "Failed to mute calls." };
  }

  return {
    success: true,
    message:
      value === "forever"
        ? "Calls muted forever"
        : "Calls muted until selected time",
  };
}

export async function unmuteCalls() {
  const authResult = await authenticateUser(true);

  if (!authResult.success) {
    return {
      success: false,
      message: "Unable to authorize.",
    };
  }

  const { error } = await supabase
    .from("simplified_users")
    .update({
      mute_call_till: null,
    })
    .eq("id", authResult.user.id);

  if (error) {
    return {
      success: false,
      message: "Failed to unmute calls.",
    };
  }

  return {
    success: true,
    message: "Calls unmuted successfully.",
  };
}