"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { PhoneCall } from "lucide-react";
import { unmuteCalls } from "@/lib/mute-call";
import { cn } from "@/lib/utils";

type UnmuteCallsModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function UnmuteCallsModal({
  open,
  onClose,
}: UnmuteCallsModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!open) return null;

  async function handleUnmute() {
    setStatusMsg(null);
    setIsError(false);

    try {
      setLoading(true);

      const result = await unmuteCalls();

      if (!result || !result.success) {
        setStatusMsg(result?.message || "Something went wrong.");
        setIsError(true);
        return;
      }

      setStatusMsg(result.message);
      setIsError(false);

      router.refresh();

      setTimeout(() => {
        onClose();
        setStatusMsg(null);
      }, 900);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-brand-card dark:bg-brand-navy shadow-xl p-5">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <PhoneCall className="h-5 w-5 text-green-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-brand-heading">
              Unmute Calls
            </h2>

            <p className="text-xs text-brand-muted mt-0.5">
              You will start receiving calls again.
            </p>
          </div>
        </div>

        {/* Warning box */}
        <div className="rounded-xl border border-brand-border bg-brand-background/40 p-3 mb-4">
          <p className="text-xs text-brand-muted">
            After unmuting:
          </p>

          <ul className="mt-2 space-y-1 text-xs text-brand-muted">
            <li>• Calls will be delivered instantly</li>
            <li>• Existing mute will be removed</li>
          </ul>
        </div>

        {/* Status message */}
        {statusMsg && (
          <div
            className={cn(
              "mb-3 text-xs px-3 py-2 rounded-xl border",
              isError
                ? "text-red-500 bg-red-500/10 border-red-500/20"
                : "text-green-500 bg-green-500/10 border-green-500/20"
            )}
          >
            {statusMsg}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-brand-border px-3 py-2 text-sm text-brand-muted hover:text-green-500 hover:border-green-500/60"
          >
            Cancel
          </button>

          <button
            onClick={handleUnmute}
            disabled={loading}
            className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {loading ? "Unmuting..." : "Unmute Calls"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}