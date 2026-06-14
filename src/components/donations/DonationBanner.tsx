import React from 'react';

interface DonationBannerProps {
  current: number;
  target: number;
  percentage: number;
  onOpenModal: () => void;
}

export const DonationBanner: React.FC<DonationBannerProps> = ({
  current,
  target,
  percentage,
  onOpenModal,
}) => {
  return (
    <div
      onClick={onOpenModal}
      className="sticky top-0 z-40 w-full bg-zinc-900 text-white text-xs border-b border-white/50 shadow-sm px-4 py-1.5 select-none cursor-pointer"
    >
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-1.5 md:gap-4">

        {/* Left Side: Thin Compact Bar Indicator & Ratio */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-28 md:w-36 bg-zinc-700 h-3 rounded-full overflow-hidden shrink-0">
            <div
              className="bg-linear-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white leading-none">
              {percentage}%
            </span>
          </div>
          <div className="font-mono font-bold text-zinc-300 whitespace-nowrap">
            ${current} / <span className="text-zinc-500">${target}</span>
          </div>
        </div>

        {/* Right Side: Interactive Modal Trigger */}
        <div className="flex items-center justify-end gap-2 md:w-auto">
          <button
            onClick={onOpenModal}
            className="ml-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md px-1.5 py-0.5 font-bold transition flex items-center justify-center h-5 w-5 text-zinc-300 active:scale-95 animate-pulse"
            title="What is this?"
          >
            ?
          </button>
        </div>

      </div>
    </div>
  );
};
