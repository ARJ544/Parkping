"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationInputProps {
  onVerify: (otp: string) => void;
  onResendRequest: () => void;
  loading?: boolean;
  error?: string;
  expiresIn?: number;
  phoneDisplay?: string;
}

export default function OTPVerificationInput({
  onVerify,
  onResendRequest,
  loading = false,
  error,
  expiresIn = 600,
  phoneDisplay,
}: OTPVerificationInputProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    onVerify(otp);
  };

  const handleResend = () => {
    setOtp("");
    setTimeLeft(expiresIn);
    setCanResend(false);
    onResendRequest();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {phoneDisplay}
          </span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={loading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
      )}

      <div className="text-center text-sm">
        {timeLeft > 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            Expires in <span className="font-semibold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="text-red-600 dark:text-red-400">Code expired</p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading || otp.length !== 6 || timeLeft <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <Button
          type="button"
          onClick={handleResend}
          disabled={!canResend || loading}
          variant="outline"
          className="w-full"
        >
          {canResend ? "Send Again" : `Resend in ${formatTime(timeLeft)}`}
        </Button>
      </div>
    </form>
  );
}
