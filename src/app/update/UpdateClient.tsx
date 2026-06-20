"use client";

import { useRouter } from "next/navigation";
import OTPFlow from "@/components/my_ui/otp/OTPFlow";

export default function UpdateClient() {
  const router = useRouter();

  const handleVerificationSuccess = () => {
    router.refresh();
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-brand-page py-10 px-4 transition-colors duration-200">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-brand-warm-text">
            Update Phone
          </h1>

          <p className="mt-2 text-stone-600 dark:text-zinc-400">
            Verify your New Phone Number to Update
          </p>

          <div className="mt-4 rounded-xl border border-amber-200/70 bg-brand-card dark:border-amber-950/60 dark:bg-amber-950/20 px-4 py-3">
            <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                ⚠️ Important:
              </span>{" "}
              If you update your phone number, you must also{" "}
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                disconnect and reconnect
              </span>{" "}
              your WhatsApp on Pingivo with the new number.
            </p>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="rounded-2xl border border-brand-border dark:border-zinc-800/80 bg-brand-card dark:bg-brand-card shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            <OTPFlow
              routeType="update"
              onSuccess={handleVerificationSuccess}
            />
          </div>
        </div>
      </div>
    </main>
  );
}