"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleUserRound, LogOut, BadgeCheck, Phone, Trash2, ChevronRight, MessageCircle, WifiOff, Volume2, VolumeOff } from "lucide-react";
import { deleteAllCookie } from "@/app/actions";
import MuteCallsModal from "@/components/profile/MuteCallsModal";
import UnmuteCallsModal from "@/components/profile/UnmuteCallsModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { unmuteCalls } from "@/lib/mute-call";

type ProfileDropdownProps = {
  isVerified: boolean;
  bsuid?: string;
  token?: string;
  mute_call_till?: string;
};

function getRemainingMuteTime(mute_call_till: string | null | undefined) {
  if (!mute_call_till) return null;
  if (mute_call_till.toLowerCase() === "forever") return "Forever";

  const endTime = Number(mute_call_till);
  if (Number.isNaN(endTime)) return null;

  const diff = endTime - Date.now();
  if (diff <= 0) return "Time is over! It's now unmuted already";

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `Muted • ${minutes}m ${seconds}s left`;
  return `Muted • ${seconds}s left`;
}

const menuItem = "group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150";
const iconWrap = "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";
const chevron = "h-3.5 w-3.5 group-hover:translate-x-0.5 transition-all";

export default function ProfileDropdown({ isVerified, bsuid, token, mute_call_till }: ProfileDropdownProps) {
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [showUnmuteModal, setShowUnmuteModal] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [remaining, setRemaining] = useState<string | null>(() => getRemainingMuteTime(mute_call_till));
  const router = useRouter();

  const handleConnectWhatsApp = () => {
    if (!token) { router.push("/signin"); router.refresh(); return; }
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(`CONNECT_${token}`)}`;
    window.open(url, "_blank");
  };

  const handleDisconnectWhatsApp = async () => {
    try {
      setIsDisconnecting(true);
      const response = await fetch("/api/disconnect-whatsapp", { method: "POST" });
      const result = await response.json();
      if (!response.ok) { alert(`Failed to disconnect WhatsApp. Error: ${result.error || "Unknown error"}`); return; }
      router.push("/signin");
      router.refresh();
      setShowDisconnectWarning(false);
    } catch (error) {
      alert(`An error occurred. Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  useEffect(() => {
    if (!mute_call_till || mute_call_till === "forever") return;
    const endTime = Number(mute_call_till);
    if (!Number.isNaN(endTime) && endTime <= Date.now()) unmuteCalls().then(() => router.refresh());
  }, [mute_call_till]);

  useEffect(() => {
    if (!mute_call_till || mute_call_till.toLowerCase() === "forever") {
      setRemaining(getRemainingMuteTime(mute_call_till));
      return;
    }
    const updateTimer = () => {
      const next = getRemainingMuteTime(mute_call_till);
      setRemaining(next);
      if (!next) clearInterval(id);
    };
    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [mute_call_till]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="group relative flex items-center justify-center h-9 w-9 rounded-lg cursor-pointer bg-coral hover:bg-coral-hover hover:scale-[1.08] active:scale-95 transition-all duration-200 ease-out ring-[2.5px] ring-coral/30 hover:ring-coral/60 outline-none focus-visible:ring-[3px] focus-visible:ring-coral/70"
            aria-label="Open profile menu"
          >
            <CircleUserRound className="h-4.5 w-4.5 text-white" />
            {isVerified && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-background shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-60 w-64 rounded-2xl p-0 overflow-hidden border border-brand-border bg-brand-card/95 dark:bg-brand-navy/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
        >
          {/* Profile Header */}
          <div className="relative px-4 pt-4 pb-3 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-coral/8 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral ring-2 ring-coral/30">
                  <CircleUserRound className="h-5 w-5 text-white" />
                </div>
                {isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-background">
                    <BadgeCheck className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-brand-heading dark:text-brand-heading leading-tight tracking-tight">My Account</span>
                {isVerified ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> Verified account
                  </span>
                ) : (
                  <span className="mt-0.5 text-[11px] text-brand-muted dark:text-brand-subtle">Unverified account</span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="my-0 bg-brand-border dark:bg-brand-border" />

          {/* Account Section */}
          <div className="px-2 py-2 space-y-0.5">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-muted dark:text-brand-subtle">Account</p>

            <DropdownMenuItem asChild className="group p-0 focus:bg-transparent">
              <Link href="/update" className={`${menuItem} text-slate-700 dark:text-brand-muted hover:text-brand-heading dark:hover:text-brand-heading hover:bg-coral/8 dark:hover:bg-coral/10 focus:outline-none focus:bg-coral/8`}>
                <span className={`${iconWrap} bg-brand-border/60 dark:bg-brand-border group-hover:bg-coral/15`}>
                  <Phone className="h-3.5 w-3.5 text-brand-muted dark:text-brand-subtle group-hover:text-coral transition-colors" />
                </span>
                <span className="flex-1 font-medium">Update Phone</span>
                <ChevronRight className={`${chevron} text-brand-muted/40 dark:text-brand-subtle/40 group-hover:text-coral/70`} />
              </Link>
            </DropdownMenuItem>

            {bsuid ? (
              <DropdownMenuItem onSelect={() => setShowDisconnectWarning(true)} className={`${menuItem} text-orange-500/80 hover:text-orange-600 hover:bg-orange-500/8 focus:bg-orange-500/8`}>
                <span className={`${iconWrap} bg-orange-500/8 group-hover:bg-orange-500/15`}>
                  <WifiOff className="h-3.5 w-3.5 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Disconnect WhatsApp</span>
                <ChevronRight className={`${chevron} text-orange-300/60 group-hover:text-orange-400/80`} />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleConnectWhatsApp(); }} className={`${menuItem} text-green-600/80 hover:text-green-700 hover:bg-green-500/8 focus:bg-green-500/8`}>
                <span className={`${iconWrap} bg-green-500/8 group-hover:bg-green-500/15`}>
                  <MessageCircle className="h-3.5 w-3.5 text-green-500 group-hover:text-green-600 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Connect WhatsApp</span>
                <ChevronRight className={`${chevron} text-green-300/60 group-hover:text-green-400/80`} />
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild className="group p-0 focus:bg-transparent">
              <Link href="/delete-account" className={`${menuItem} text-red-500/80 hover:text-red-600 hover:bg-red-500/8 focus:outline-none focus:bg-red-500/8`}>
                <span className={`${iconWrap} bg-red-500/8 group-hover:bg-red-500/15`}>
                  <Trash2 className="h-3.5 w-3.5 text-red-400 group-hover:text-red-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Delete Account</span>
                <ChevronRight className={`${chevron} text-red-300/60 group-hover:text-red-400/80`} />
              </Link>
            </DropdownMenuItem>

            {mute_call_till ? (
              <DropdownMenuItem onClick={() => setShowUnmuteModal(true)} className={`${menuItem} text-red-500/80 hover:text-red-600 hover:bg-red-500/8 focus:bg-red-500/8`}>
                <span className={`${iconWrap} bg-red-500/8 group-hover:bg-red-500/15`}>
                  <VolumeOff className="h-3.5 w-3.5 text-red-400 group-hover:text-red-500 transition-colors" />
                </span>
                <span className="flex flex-col flex-1">
                  <span className="font-medium">Unmute Calls</span>
                  {remaining && <span className="text-[11px] text-red-400/70">{remaining}</span>}
                </span>
                <ChevronRight className={`${chevron} text-red-300/60 group-hover:text-red-400/80`} />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setShowMuteModal(true)} className={`${menuItem} text-orange-500/80 hover:text-orange-600 hover:bg-orange-500/8 focus:bg-orange-500/8`}>
                <span className={`${iconWrap} bg-orange-500/8 group-hover:bg-orange-500/15`}>
                  <Volume2 className="h-3.5 w-3.5 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Mute Calls</span>
                <ChevronRight className={`${chevron} text-orange-300/60 group-hover:text-orange-400/80`} />
              </DropdownMenuItem>
            )}
          </div>

          <DropdownMenuSeparator className="my-0 bg-brand-border dark:bg-brand-border" />

          <div className="px-2 py-2">
            <DropdownMenuItem onClick={deleteAllCookie} className={`${menuItem} font-medium text-red-500/80 hover:text-red-600 hover:bg-red-500/8 focus:bg-red-500/8`}>
              <span className={`${iconWrap} bg-red-500/8 group-hover:bg-red-500/15`}>
                <LogOut className="h-3.5 w-3.5 text-red-400 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <span className="flex-1">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDisconnectWarning && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-xs rounded-2xl p-5 shadow-xl border border-brand-border bg-brand-card dark:bg-brand-navy">
            <h2 className="text-base font-semibold text-brand-heading dark:text-brand-heading mb-1">Disconnect WhatsApp?</h2>
            <p className="text-xs text-brand-muted mb-3 leading-relaxed">
              You will <span className="font-semibold text-red-500">stop receiving messages</span> from finders. They will only be able to reach you via call.
            </p>
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 rounded-xl px-3 py-2 mb-4">
              To reconnect later, you'll need to go through the WhatsApp setup again from this menu.
            </div>
            <div className="flex gap-2">
              <button onClick={handleDisconnectWhatsApp} disabled={isDisconnecting} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl px-3 py-2 transition-colors disabled:opacity-60">
                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
              <button onClick={() => setShowDisconnectWarning(false)} className="flex-1 border border-brand-border text-sm font-medium rounded-xl px-3 py-2 text-brand-muted hover:border-coral/50 dark:hover:border-coral/60 hover:text-coral dark:hover:text-coral bg-transparent transition-all duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <MuteCallsModal open={showMuteModal} onClose={() => setShowMuteModal(false)} />
      <UnmuteCallsModal open={showUnmuteModal} onClose={() => setShowUnmuteModal(false)} />
    </>
  );
}