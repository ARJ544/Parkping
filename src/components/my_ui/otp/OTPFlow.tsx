"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneNumberInput from "./PhoneNumberInput";
import OTPVerificationInput from "./OTPVerificationInput";

type Step = "phone_input" | "otp_verification" | "success" | "error";

interface OTPFlowProps {
  onSuccess?: (phoneNumber?: string) => void | Promise<void>;
  routeType: "verify-phone-unknown-user" | "update" | "verify-phone";
  redirectUrl?: string;
}

export default function OTPFlow({ onSuccess, routeType, redirectUrl }: OTPFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone_input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expiresIn, setExpiresIn] = useState(600);
  const [phoneDisplay, setPhoneDisplay] = useState("");

  const handleSendOTP = async (formattedPhone: string) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setPhoneNumber(formattedPhone);
      setExpiresIn(data.expiresIn || 600);
      setPhoneDisplay(data.phoneDisplayed || formattedPhone.slice(-4));
      setStep("otp_verification");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          otpCode,
          route: routeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        return;
      }

      setStep("success");

      setTimeout(() => {
        if (onSuccess) {
          Promise.resolve(onSuccess(phoneNumber)).catch(console.error);
        } else if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      }, 300);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setStep("phone_input");
    setError("");
    handleSendOTP(phoneNumber);
  };

  return (
    <div className="space-y-6">
      {step === "phone_input" && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Verify Phone Number
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Enter your phone number to receive an OTP via WhatsApp
          </p>
          <PhoneNumberInput
            onSubmit={handleSendOTP}
            loading={loading}
            error={error}
          />
        </div>
      )}

      {step === "otp_verification" && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Enter Verification Code
          </h2>
          <OTPVerificationInput
            onVerify={handleVerifyOTP}
            onResendRequest={handleResend}
            loading={loading}
            error={error}
            expiresIn={expiresIn}
            phoneDisplay={phoneDisplay}
          />
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Verified!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your phone number has been verified successfully
          </p>
        </div>
      )}
    </div>
  );
}
