"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRActionButtonsProps {
  downloading: boolean;
  sharing: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export default function QRActionButtons({
  downloading,
  sharing,
  onDownload,
  onShare,
}: QRActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onDownload}
        disabled={downloading}
        className="flex-1 bg-[#d85a30] hover:bg-[#c04e28] text-white font-bold h-11 rounded-full flex items-center justify-center gap-2 border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Generating..." : "Download Sticker"}
      </Button>

      <Button
        onClick={onShare}
        disabled={sharing}
        variant="outline"
        className="h-11 px-5 rounded-full flex items-center gap-2 font-bold
          border-[#e8dfc4] hover:border-[#d85a30]/50 text-[#8a7a5a] hover:text-[#d85a30]
          dark:border-[#1e2a4a] dark:hover:border-[#d85a30]/60 dark:text-[#89aee6] dark:hover:text-[#d85a30]
          bg-transparent hover:bg-[#d85a30]/5
          hover:-translate-y-0.5 transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Share2 className="w-4 h-4" />
        {sharing ? "Preparing..." : "Share PDF"}
      </Button>
    </div>
  );
}
