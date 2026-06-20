"use client";

import { useRouter } from "next/navigation";
import { revalidateLayout } from "@/app/actions";
import OTPFlow from "@/components/my_ui/otp/OTPFlow";

export default function SignupClient() {
  const router = useRouter();

  const handleVerificationSuccess = async () => {
    await revalidateLayout();
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.replace("/qr");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-card dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <OTPFlow
          routeType="verify-phone"
          onSuccess={handleVerificationSuccess}
        />
      </div>
    </div>
  );
}