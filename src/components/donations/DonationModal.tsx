'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Globe } from 'lucide-react';
import { useDonation } from '@/providers/DonationProvider';
import { getDonationMessage } from '@/lib/donations/donation-utils';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { data: donationData } = useDonation();

  if (!isOpen) return null;

  const handleCloseAll = () => {
    setShowPaymentOptions(false);
    onClose();
  };
  const feedbackMessage = getDonationMessage(donationData?.percentage ?? 0);

  return (
    <div className="fixed inset-0 z-61 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ">
      <div className="border border-orange-500 dark:border-yellow-500 relative w-full max-w-md overflow-hidden rounded-2xl bg-brand-card p-6 shadow-2xl dark:bg-zinc-900 transition-all text-brand-heading dark:text-slate-50">

        {/* Close button */}
        <button
          onClick={handleCloseAll}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xl font-bold cursor-pointer z-10"
        >
          &times;
        </button>

        {!showPaymentOptions ? (
          /* --- MAIN DONATION MODAL VIEW --- */
          <>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold flex justify-center items-center gap-2">
                ❤️ Support This Project
              </h3>
              <p className="text-xs font-medium border border-emerald-500 text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-950/30 py-1.5 px-3 rounded-full inline-block">
                {feedbackMessage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border border-zinc-100 dark:border-zinc-600 rounded-xl p-4 my-4 bg-zinc-50 dark:bg-zinc-950/40">
              <div className="text-center">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Goal Tracker</span>
                <span className="text-base font-bold">${donationData?.received ?? 0} / ${donationData?.target ?? 150}</span>
              </div>
              <div className="text-center border-l border-zinc-200 dark:border-zinc-700">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Funded</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{donationData?.percentage ?? 0}%</span>
              </div>
            </div>

            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden mb-5">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${donationData?.percentage ?? 0}%` }} />
            </div>

            {/* Campaign Header Image */}
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800">
              <Image
                src="/donate_image.webp"
                alt="Support our campaign"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 400px"
              />
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-6 leading-relaxed">
              Your support directly handles server configurations, active hosting costs, and fuels and feature expansions.
            </p>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5">
              <button
                onClick={() => setShowPaymentOptions(true)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/10 transition text-sm cursor-pointer"
              >
                Donate Now
              </button>
              <Link
                href="/donors-list"
                onClick={handleCloseAll}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10 transition text-sm text-center"
              >
                View Donor List
              </Link>
            </div>
          </>
        ) : (
          /* --- NESTED PAYMENT OPTIONS SUB-MODAL VIEW --- */
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold">Payment Options</h3>
              <p className="text-xs text-zinc-400 mt-1">Select your processing channel</p>
            </div>

            {/* Responsive split-pane menu */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch my-6">

              {/* Left Column: Razorpay Option */}
              <div className="flex flex-col items-center text-center justify-between p-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Option 1</h4>
                  <p className="text-xs font-medium px-2 text-zinc-600 dark:text-zinc-300">
                    If you are using an <strong className="text-zinc-900 dark:text-white">Indian Card</strong> or UPI, checkout via Razorpay.
                  </p>
                </div>
                <button
                  onClick={() => alert("Launching Razorpay instance...")}
                  className="mt-4 w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer"
                >
                  Pay via Razorpay
                </button>
              </div>

              {/* Vertical Separator Layout Line */}
              <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-500 -translate-x-1/2" />

              {/* Right Column: International Gateway Option */}
              <div className="flex flex-col items-center text-center justify-between p-2 border-t border-zinc-100 dark:border-zinc-800 pt-6 sm:pt-2 sm:border-t-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Option 2</h4>
                  <p className="text-xs font-medium px-2 text-zinc-600 dark:text-zinc-300">
                    For any <strong className="text-zinc-900 dark:text-white">International Card</strong>, check out safely through this gateway.
                  </p>
                </div>
                <Link href="https://ko-fi.com/pingivo" target="_blank" className="mt-4 w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition cursor-pointer text-center">
                  Pay via Ko-Fi
                </Link>
              </div>

            </div>

            {/* Back to details navigation link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer"
              >
                &larr; Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};