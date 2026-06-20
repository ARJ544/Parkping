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

function OTPHelpModal({
  phoneDisplay,
  onClose,
  onOpenWhatsapp,
  onChangeNumber,
}: {
  phoneDisplay: string;
  onClose: () => void;
  onOpenWhatsapp: () => void;
  onChangeNumber: () => void;
}) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Didn't get the OTP?
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          <div className="py-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">⏱ WhatsApp window expired</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Message our number to open a 24-hr window.</p>
            </div>
            <button onClick={onOpenWhatsapp} className="text-xs font-medium text-green-600 dark:text-green-400 whitespace-nowrap shrink-0 cursor-pointer underline underline-offset-2">
              Fix →
            </button>
          </div>

          <div className="py-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">📱 Wrong number?</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Sent to {phoneDisplay}. Go back to change it.</p>
            </div>
            <button onClick={onChangeNumber} className="text-xs font-medium text-slate-500 dark:text-slate-400 underline underline-offset-2 whitespace-nowrap shrink-0">
              Change →
            </button>
          </div>

          <div className="py-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">🔄 OTP expired?</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">OTPs are valid for 10 minutes. Close this and hit resend.</p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function OTPFlow({ onSuccess, routeType, redirectUrl }: OTPFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone_input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expiresIn, setExpiresIn] = useState(600);
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [showOTPHelpModal, setShowOTPHelpModal] = useState(false);

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

          {/* OTP Help Modal */}
          <div className="mt-3">
            <button
              onClick={() => setShowOTPHelpModal(true)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Didn't get the OTP?
            </button>
          </div>

          {showOTPHelpModal && (
            <OTPHelpModal
              phoneDisplay={phoneDisplay}
              onClose={() => setShowOTPHelpModal(false)}
              onOpenWhatsapp={() => {
                setShowOTPHelpModal(false);
              }}
              onChangeNumber={() => {
                setShowOTPHelpModal(false);
                setStep("phone_input");
                setError("");
              }}
            />
          )}
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