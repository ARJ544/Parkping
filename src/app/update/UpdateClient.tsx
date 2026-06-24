"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { usePhoneEmailVerification } from "@/hooks/usePhoneEmailVerification";

export default function UpdateClient() {
  const router = useRouter();

  const handleVerification = useCallback(async (userObj: any, setMessage: (msg: string) => void) => {
    if (!userObj?.user_json_url) {
      setMessage("Phone verification failed. Please try again.");
      throw new Error("Phone verification failed. Please try again.");
    }

    const res = await fetch("/api/update/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_json_url: userObj.user_json_url }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMsg = errorData.error || "Something went wrong.";
      setMessage(errorMsg);
      throw new Error(errorMsg);
    }

    setMessage("Phone verified successfully! Redirecting...");
    setTimeout(() => router.replace("/"), 1200);
  }, [router]);

  const { loading, message, hiddenButtonRef, handleCustomClick } =
    usePhoneEmailVerification(handleVerification);

  return (
    <main className="min-h-screen bg-[#fdf8e2] dark:bg-[#080c10] py-10 px-4 transition-colors duration-200">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-[#f3efe6]">
            Update Phone
          </h1>
          <p className="mt-2 text-stone-600 dark:text-zinc-400">
            Verify your New Phone Number to Update
          </p>

          {/* Warning Alert Box - Adjusted contrast for the custom backgrounds */}
          <div className="mt-4 rounded-xl border border-amber-200/70 bg-[#fbf2cd] dark:border-amber-950/60 dark:bg-amber-950/20 px-4 py-3">
            <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
              <span className="font-semibold text-amber-900 dark:text-amber-300">⚠️ Important:</span> If you update your phone number, you must also{" "}
              <span className="font-semibold text-amber-900 dark:text-amber-300">disconnect and reconnect</span> your WhatsApp on Pingivo with the new number — otherwise messages will continue to be routed to your current connected WhatsApp number.
            </p>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="rounded-2xl border border-[#e8dfc4] dark:border-zinc-800/80 bg-[#fefdf7] dark:bg-[#0d1216] shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 p-6">

            {/* Action Trigger Button */}
            <button
              onClick={handleCustomClick}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-[#f3efe6] dark:text-[#080c10] dark:hover:bg-white text-white font-semibold text-sm sm:text-[14.5px] py-3.5 rounded-full transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Verify Phone Number"}
            </button>

            <div className="hidden">
              <div
                ref={hiddenButtonRef}
                className="pe_signin_button"
                data-client-id="14661853409856503092"
              />
            </div>

            {message && (
              <p className="text-center mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
    
}
