"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPFlow from "@/components/my_ui/otp/OTPFlow";

export default function VerifyPhoneUnknownUser({
  temp_phone,
  finder_id,
}: {
  temp_phone: string | undefined;
  finder_id?: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("next");
  const finderId = queryFinderId ?? finder_id;
  const safeFinderId = finderId ?? "re-scan-the-qr-code";

  const [message, setMessage] = useState<string | null>(null);
  const hasTempPhoneCookie = Boolean(temp_phone);

  const handleVerificationSuccess = () => {
    setMessage("Phone verified successfully! Redirecting...");
    setTimeout(() => {
      router.refresh();
      router.push(`/search?finder_id=${encodeURIComponent(safeFinderId)}`);
    }, 1500);
  };

  if (hasTempPhoneCookie) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-medium text-green-600 dark:text-green-400">
          ✓ Phone number already verified
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <OTPFlow
          routeType="verify-phone-unknown-user"
          onSuccess={handleVerificationSuccess}
        />
      </div>

      {message && (
        <p className="text-lg font-medium text-center text-slate-700 dark:text-slate-300 max-w-md">
          {message}
        </p>
      )}
    </div>
  );
}