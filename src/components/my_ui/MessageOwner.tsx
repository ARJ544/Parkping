"use client";

import { useState, useEffect } from "react";
import { Phone, Info, X } from "lucide-react";
import VerifyPhoneUnknownUser from "@/app/verify-phone-unknown-user/verify-phone-unknown-user-client";
import { DonationModal } from "../donations/DonationModal";

const QUICK_MESSAGES = [
  "Your car is blocking my driveway.",
  "Your car lights are on.",
  "Your car is parked incorrectly.",
  "Please move your car. It is causing inconvenience.",
];

const triggerBtn =
  "h-12 w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-3xl transition active:scale-[0.97]";

const sheet =
  "relative w-full bg-[#fcf2ce] dark:bg-slate-900 rounded-t-2xl animate-slideUp max-h-[90dvh] flex flex-col border-t border-slate-100 dark:border-slate-800";

const headerBorder = "border-b border-slate-100 dark:border-slate-800";

const sectionLabel =
  "text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 px-5 pt-4 pb-2";

const textareaStyle =
  "w-full text-[13.5px] text-slate-800 dark:text-slate-200 rounded-[14px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-3 outline-none focus:border-[#25D366] resize-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 font-[inherit] leading-relaxed";

const sendBtn =
  "w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-[14.5px] font-medium py-3.5 rounded-full transition-all active:scale-[0.98] disabled:cursor-not-allowed";

const callBtn =
  "flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-[14.5px] font-medium py-3.5 rounded-full transition-all active:scale-[0.98] disabled:cursor-not-allowed";


export interface MessageOwnerProps {
  autoOpen?: boolean;
  onCall?: () => Promise<void>;
  hasPhoneNumber?: boolean;
  tempPhoneId?: string | undefined;
  finderId?: string;
  callCredits?: number;
  usedCallCredits?: number;
  creditsLoading?: boolean;
  resetTime?: string;
}

export default function MessageOwner({
  autoOpen = false,
  onCall,
  hasPhoneNumber = false,
  tempPhoneId,
  finderId = "",
  callCredits = 0,
  usedCallCredits = 0,
  creditsLoading = false,
  resetTime = "",
}: MessageOwnerProps) {
  const [open, setOpen] = useState(false);
  const [shouldOpenDonationModal, setShouldOpenDonationModal] = useState(false);
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [calling, setCalling] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const activeMsg = selected || custom.trim();
  const canCall = hasPhoneNumber && callCredits > 0 && !creditsLoading && !calling;

  function openSheet() {
    setOpen(true);
    setSelected("");
    setCustom("");
    setSending(false);
    setShowCredits(false);
    setFeedback(null);
  }

  function closeSheet() {
    setOpen(false);
    setShowCredits(false);
    setFeedback(null);
  }

  async function handleSend() {
    if (!activeMsg) return;

    try {
      setSending(true);
      setFeedback(null);

      const res = await fetch("/api/message-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alertMessage: activeMsg }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || "Failed to send message");
      }

      // Remove below 117-121 after early may(tbd)
      setFeedback({
        msg: "Message successfully sent to WhatsApp",
        isError: false,
      });

      // Uncomment after early may(tbd)
      // if (!res.ok) {
      //   throw new Error(data.error.message || "Failed to fetch");
      // }

      // setFeedback({
      //   msg: "You will be Redirected to send the message via WhatsApp.",
      //   isError: false,
      // });
      // setTimeout(() => {
      //   if (data.waLink) {
      //     window.open(data.waLink, "_blank");
      //   }
      // }, 1500);
      setTimeout(() => {
        setShouldOpenDonationModal(true);
      }, 500);

    } catch (error: any) {
      console.error("Error:", error);

      setFeedback({
        msg: error.message || "Something went wrong while fetching details",
        isError: true,
      });

    } finally {
      setSending(false);
    }
  }

  async function handleCall() {
    if (!onCall) return;
    setCalling(true);
    setFeedback(null);
    try {
      await onCall();
      setFeedback({
        msg: `Call started for 60s. Incoming call from: ${process.env.NEXT_PUBLIC_TWILIO_NUMBER}.`,
        isError: false,
      });
      setTimeout(() => {
        setShouldOpenDonationModal(true);
      }, 1500);
    } catch (err: any) {
      setFeedback({ msg: err.message || "Something went wrong", isError: true });
    } finally {
      setCalling(false);
    }
  }

  return (
    <>
      <DonationModal
        isOpen={shouldOpenDonationModal}
        onClose={() => setShouldOpenDonationModal(false)}
      />

      <button onClick={openSheet} className={triggerBtn}>
        Message Or Call
      </button>

      {open && (
        <div className="fixed inset-0 z-60 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeSheet}
          />

          {/* Sheet */}
          <div className={sheet}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <span className="block w-9 h-1 rounded-full" />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 pb-4 ${headerBorder}`}>
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-[#e8edf8]">
                Send a message
              </span>
              <button
                onClick={closeSheet}
                className="w-7 h-7 flex items-center justify-center rounded-full
                    bg-[#e8dfc4]/60 dark:bg-[#1e2a4a]
                    text-[#8a7a5a] dark:text-[#4a6fa5]
                    hover:bg-[#d85a30]/10 hover:text-[#d85a30]
                    dark:hover:bg-[#d85a30]/10 dark:hover:text-[#d85a30]
                    transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Quick messages */}
            <div className="overflow-y-auto flex-1 pb-2">
              <p className={sectionLabel}>Quick Messages</p>
              <div className="flex flex-col gap-1.5 px-4">
                {QUICK_MESSAGES.map((m) => {
                  const active = selected === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setSelected(active ? "" : m);
                        setCustom("");
                      }}
                      className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[13.5px] leading-snug transition-all
                          ${active
                          ? "bg-[#25D366]/10 border border-[#25D366]"
                          : "bg-[#fef9ed] dark:bg-[#0d1b33] border border-[#e8dfc4] dark:border-[#1e2a4a] hover:border-[#d85a30]/40 dark:hover:border-[#d85a30]/40"
                        }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition-all
                          ${active
                          ? "bg-[#25D366] border-[#25D366]"
                          : "border-[#e8dfc4] dark:border-[#1e2a4a]"
                        }`}
                      >
                        {active && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      <span className="text-slate-800 dark:text-[#89aee6]">{m}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom message */}
              <p className={sectionLabel}>Custom Message</p>
              <div className="px-4">
                <textarea
                  rows={3}
                  placeholder="Write your own message..."
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setSelected("");
                  }}
                  className={textareaStyle}
                />
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`flex items-start gap-2 rounded-xl border px-3 mx-4 mt-3 py-2 text-sm
                    ${feedback.isError
                    ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">{feedback.isError ? "✕" : "✓"}</span>
                  <span className="text-left">{feedback.msg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="px-4 pt-4 flex flex-col gap-3">
                <div className="flex gap-2 items-start">

                  <div className="flex-1 flex flex-col gap-1">
                    <button
                      disabled={!activeMsg || sending || calling}
                      onClick={handleSend}
                      className={sendBtn}
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                    <p className="text-center text-[10px] text-[#8a7a5a] dark:text-[#4a6fa5] tracking-wide">
                      No verification required
                    </p>
                  </div>

                  {hasPhoneNumber ? (
                    <button
                      disabled={!canCall || sending}
                      onClick={handleCall}
                      className={callBtn}
                    >
                      <Phone size={15} />
                      {calling ? "Calling..." : "Call"}
                    </button>
                  ) : (
                    <div className="flex-1">
                      <VerifyPhoneUnknownUser
                        temp_phone={tempPhoneId}
                        finder_id={finderId}
                      />
                    </div>
                  )}
                </div>

                {hasPhoneNumber && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowCredits(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium
                          text-[#8a7a5a] dark:text-[#89aee6]
                          hover:text-slate-900 dark:hover:text-[#e8edf8]
                          bg-[#e8dfc4]/60 dark:bg-[#1e2a4a]
                          hover:bg-[#d85a30]/10 dark:hover:bg-[#d85a30]/10
                          px-2.5 py-1 rounded-full transition-colors"
                    >
                      <span className="font-semibold text-[#d85a30]">
                        {creditsLoading ? "..." : callCredits}
                      </span>
                      credits
                      <Info size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-61 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setShowCredits(false)}
          />
          <div className="relative w-full max-w-xs rounded-2xl shadow-xl p-5 flex flex-col gap-3
              border border-[#e8dfc4] dark:border-[#1e2a4a]
              bg-[#fef9ed] dark:bg-[#0a0f1e]">

            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-[#e8edf8]">
                Call Credits
              </span>
              <button
                onClick={() => setShowCredits(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full
                    bg-[#e8dfc4]/60 dark:bg-[#1e2a4a]
                    text-[#8a7a5a] dark:text-[#4a6fa5]
                    hover:bg-[#d85a30]/10 hover:text-[#d85a30]
                    dark:hover:bg-[#d85a30]/10 dark:hover:text-[#d85a30]
                    transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            <hr className="border-[#e8dfc4] dark:border-[#1e2a4a]" />

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#8a7a5a] dark:text-[#89aee6]">Remaining</span>
                <span className="font-semibold text-[#d85a30] bg-orange-50 dark:bg-[#d85a30]/10 px-2 py-0.5 rounded-lg">
                  {callCredits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a7a5a] dark:text-[#89aee6]">Used</span>
                <span className="font-semibold text-slate-700 dark:text-[#e8edf8]">
                  {usedCallCredits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8a7a5a] dark:text-[#89aee6]">Resets</span>
                <span className="text-slate-600 dark:text-[#89aee6]">{resetTime}</span>
              </div>
            </div>

            <hr className="border-[#e8dfc4] dark:border-[#1e2a4a]" />

            <div className="flex flex-col gap-1 text-[11.5px] text-[#8a7a5a] dark:text-[#4a6fa5]">
              <p>• One credit used only if receiver answers</p>
              <p>• For two unsuccessful calls, 1 credit will be deducted</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
