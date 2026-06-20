import bcrypt from "bcrypt";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
  // return otp;
}

export async function verifyOTP(plainOTP: string, hashedOTP: string): Promise<boolean> {
  return bcrypt.compare(plainOTP, hashedOTP);
  // return plainOTP === hashedOTP;
}

export function validatePhoneNumber(phone: string): { valid: boolean; formatted?: string; error?: string } {
  const cleaned = phone.replace(/\s+/g, "");

  if (!cleaned.startsWith("+")) {
    return { valid: false, error: "Phone number must start with country code (e.g., +1, +91)" };
  }

  if (!/^\+\d{10,15}$/.test(cleaned)) {
    return { valid: false, error: "Invalid phone number format" };
  }

  return { valid: true, formatted: cleaned };
}

export function formatPhoneDisplay(phone: string): string {
  return phone.slice(-4).padStart(phone.length, "*");
}
