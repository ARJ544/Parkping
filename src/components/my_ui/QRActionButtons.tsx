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
        className="flex-1 bg-coral hover:bg-coral-hover text-white font-bold h-11 rounded-full flex items-center justify-center gap-2 border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Generating..." : "Download Sticker"}
      </Button>

      <Button
        onClick={onShare}
        disabled={sharing}
        variant="outline"
        className="h-11 px-5 rounded-full flex items-center gap-2 font-bold
          border-brand-border hover:border-coral/50 text-brand-muted hover:text-coral
          dark:border-brand-border dark:hover:border-coral/60 dark:text-brand-muted dark:hover:text-coral
          bg-transparent hover:bg-coral/5
          hover:-translate-y-0.5 transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Share2 className="w-4 h-4" />
        {sharing ? "Preparing..." : "Share PDF"}
      </Button>
    </div>
  );
}
