"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";

interface PhoneNumberInputProps {
  onSubmit: (phoneNumber: string) => void;
  loading?: boolean;
  error?: string;
}

export default function PhoneNumberInput({ onSubmit, loading = false, error }: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!phoneNumber) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    onSubmit(phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Phone Number
        </label>
        <div className="flex">
          <PhoneInput
            placeholder="Enter phone number"
            defaultCountry="IN"
            value={phoneNumber}
            onChange={setPhoneNumber}
            disabled={loading}
            className="w-full"
          />
        </div>
        {phoneError && (
          <p className="text-red-500 text-sm font-medium mt-1">{phoneError}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || !phoneNumber}
        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold py-2.5 rounded-lg transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
}
