"use client";

import { useState, useEffect } from "react";

export function useCallCredits() {
  const [callCredits, setCallCredits] = useState(3);
  const [usedCallCredits, setUsedCallCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCallCredits = async () => {
      try {
        setCreditsLoading(true);
        const res = await fetch("/api/get-call-credits");
        const result = await res.json();

        if (!res.ok) {
          setCallCredits(0);
          setUsedCallCredits(0);
          setErrorMessage(result.error || "Failed to fetch call credits.");
          return;
        }

        if (!result.success) {
          setCallCredits(0);
          setUsedCallCredits(0);
          setErrorMessage(result.error || "Failed to fetch call credits.");
          return;
        }

        setErrorMessage("");
        setCallCredits(result.callCredits);
        setUsedCallCredits(result.creditsUsed);
      } catch {
        setCallCredits(3);
        setErrorMessage("Failed to fetch call credits.");
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCallCredits();
  }, []);

  const refreshCredits = async (): Promise<void> => {
    try {
      const res = await fetch("/api/get-call-credits");
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to refresh call credits.");
        return;
      }

      setErrorMessage("");
      setCallCredits(data.callCredits);
      setUsedCallCredits(data.creditsUsed);
    } catch (error) {
      setErrorMessage("Failed to refresh call credits.");
    }
  };

  return {
    callCredits,
    usedCallCredits,
    creditsLoading,
    refreshCredits,
    errorMessage
  };
}
