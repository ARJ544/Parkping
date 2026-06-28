"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { PhoneOff } from "lucide-react";
import { muteCalls } from "@/lib/mute-call";
import { DateTimePicker24h } from "@/components/profile/DateTimePicker";
import { cn } from "@/lib/utils";

type MuteCallsModalProps = {
  open: boolean;
  onClose: () => void;
};

const OPTIONS = [
  { label: "1 Hour", type: "preset", minutes: 60 },
  { label: "8 Hours", type: "preset", minutes: 480 },
  { label: "15 Hours", type: "preset", minutes: 900 },
  { label: "24 Hours", type: "preset", minutes: 1440 },
  { label: "Forever", type: "forever" },
  { label: "Custom", type: "custom" },
] as const;

type SelectedState =
  | { type: "preset"; minutes: number }
  | { type: "forever" }
  | { type: "custom" };

export default function MuteCallsModal({
  open,
  onClose,
}: MuteCallsModalProps) {
  const router = useRouter();

  const [selected, setSelected] = useState<SelectedState>({
    type: "preset",
    minutes: 60,
  });

  const [customDateTime, setCustomDateTime] = useState<Date | undefined>(new Date());

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!open) return null;

  async function handleMute() {
    setStatusMsg(null);
    setIsError(false);

    let value: number | "forever";

    if (selected.type === "forever") {
      value = "forever";
    }

    else if (selected.type === "custom") {
      if (!customDateTime) {
        setStatusMsg("Please select date & time");
        setIsError(true);
        return;
      }

      const timestamp = customDateTime.getTime();

      if (timestamp <= Date.now()) {
        setStatusMsg("Select future time");
        setIsError(true);
        return;
      }

      value = timestamp;
    }

    else {
      value = Date.now() + selected.minutes * 60 * 1000;
    }

    try {
      setLoading(true);

      const result = await muteCalls(value);

      if (!result?.success) {
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
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-brand-card dark:bg-brand-navy shadow-xl p-4">

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <PhoneOff className="h-4 w-4 text-red-500" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-brand-heading">
              Mute Incoming Calls
            </h2>
            <p className="text-[11px] text-brand-muted">
              You won't receive calls during this time. Messages still work.
            </p>
          </div>
        </div>

        {/* Status */}
        {statusMsg && (
          <div
            className={cn(
              "mb-3 text-[11px] px-2.5 py-1.5 rounded-xl border",
              isError
                ? "text-red-500 bg-red-500/10 border-red-500/20"
                : "text-green-500 bg-green-500/10 border-green-500/20"
            )}
          >
            {statusMsg}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-3 gap-1.5">
          {OPTIONS.map((option) => {
            const isActive =
              selected.type === option.type &&
              (option.type !== "preset" ||
                selected.type !== "preset" ||
                selected.minutes === option.minutes);

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  if (option.type === "preset") {
                    setSelected({ type: "preset", minutes: option.minutes });
                  } else if (option.type === "forever") {
                    setSelected({ type: "forever" });
                  } else {
                    setSelected({ type: "custom" });
                  }
                }}
                className={cn(
                  "rounded-xl border py-2 text-center text-xs transition-all font-medium",
                  isActive
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-brand-border hover:border-coral/40 hover:bg-coral/5 text-brand-heading"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Custom picker */}
        {selected.type === "custom" && (
          <div className="mt-3 pt-3 border-t border-brand-border/50">
            <label className="text-[11px] font-medium text-brand-muted block mb-1.5">
              Select Date & Time
            </label>

            <DateTimePicker24h
              date={customDateTime}
              setDate={setCustomDateTime}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-brand-border py-2 text-xs font-medium text-brand-muted hover:text-coral hover:border-coral/60"
          >
            Cancel
          </button>

          <button
            onClick={handleMute}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 py-2 text-xs font-medium text-white disabled:opacity-60"
          >
            {loading ? "Muting..." : "Mute"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}