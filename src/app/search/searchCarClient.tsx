"use client";
import { useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTempPhone } from "@/app/actions";
import MessageOwner from "@/components/my_ui/MessageOwner";
import { useOwnerSearch } from "@/hooks/useOwnerSearch";
import { useCallCredits } from "@/hooks/useCallCredits";
import Link from "next/link";

function Loader() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
      <span className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      Searching owner...
    </div>
  );
}

export default function SearchCar({
  is_verified,
  phone_num,
  temp_phone_number,
  temp_phone_id,
}: {
  is_verified: boolean;
  phone_num: string | undefined;
  temp_phone_number: string | undefined;
  temp_phone_id: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("finder_id");

  const finderId = queryFinderId ?? "";

  const { loading, message, ownerFound, isError } = useOwnerSearch(queryFinderId);
  const { callCredits, usedCallCredits, creditsLoading, refreshCredits, errorMessage } = useCallCredits();

  const resetTime = useMemo(() => {
    const now = new Date();
    const utcMidnightToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
    );
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "longGeneric",
    }).format(utcMidnightToday);
  }, []);


  const handleCall = async () => {
    const res = await fetch("/api/voice", { method: "POST" });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    await refreshCredits();
  };

  const hasPhoneNumber = Boolean(phone_num || temp_phone_number);

  return (
    <main className="flex flex-1 justify-center px-4 py-8 transition-colors">
      <div className="layout-content-container flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-extrabold tracking-tight text-brand-heading dark:text-brand-heading">
            Contact the Owner
          </h1>

          <div className="flex w-full flex-col gap-4 pt-8">
            {loading && !ownerFound ? <Loader /> : null}

            {message && (
              <div className={`p-4 rounded-2xl text-center text-sm font-medium border
                  ${ownerFound
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {ownerFound && (
              <>
                <MessageOwner
                  autoOpen={ownerFound}
                  onCall={handleCall}
                  hasPhoneNumber={hasPhoneNumber}
                  tempPhoneId={temp_phone_id}
                  finderId={finderId}
                  callCredits={callCredits}
                  usedCallCredits={usedCallCredits}
                  creditsLoading={creditsLoading}
                  creditsFetchErrorMessage={{ msg: errorMessage, isError: Boolean(errorMessage) }}
                  resetTime={resetTime}
                />

                {hasPhoneNumber && is_verified && (
                  <div className="flex flex-col items-end gap-0.5">
                    {temp_phone_number && (
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-brand-heading">
                        ...{temp_phone_number}
                      </span>
                    )}
                    {phone_num && !temp_phone_number && (
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-brand-heading">
                        ...{phone_num}
                      </span>
                    )}
                    {!temp_phone_number && (
                      <button
                        onClick={() => router.push(`/verify-phone-unknown-user?next=${encodeURIComponent(finderId)}`)}
                        className="flex items-center gap-1 text-coral cursor-pointer text-[9px] font-medium hover:underline"
                      >
                        <RefreshCcw size={10} />
                        change
                      </button>
                    )}
                  </div>
                )}

                {(temp_phone_number || temp_phone_id) && (
                  <div className="rounded-full py-4 px-4 text-sm flex items-center justify-between border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <p className="text-amber-700 dark:text-amber-300">
                      Temp number active · removed in <strong>1h</strong>
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteTempPhone();
                        router.refresh();
                      }}
                      className="h-7 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white border-none text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </>
            )}

            {!ownerFound && !loading && (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <Link
                  href="/scan"
                  className="text-sm font-medium text-coral hover:underline"
                >
                  Click To Scan
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No user found with this ID.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}