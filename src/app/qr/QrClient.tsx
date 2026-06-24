"use client";

import { useState } from "react";
import { Unbounded } from "next/font/google";
import { useQRGeneration } from "@/hooks/useQRGeneration";
import QRPreview from "@/components/my_ui/QRPreview";
import TemplateSelector from "@/components/my_ui/TemplateSelector";
import QRActionButtons from "@/components/my_ui/QRActionButtons";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  adjustFontFallback: true,
  fallback: ["BiauKai", "-apple-system", "BlinkMacSystemFont", "Microsoft JhengHei", "Microsoft YaHei", "Noto Sans TC", "sans-serif"]
});
type Props = { finder_id: string };

const CW = 360;
const CH = 500;

const TEMPLATES = [
  { id: "0", label: "1", src: "/template0.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 79, y: CH / 2 - 113 } },
  { id: "1", label: "2", src: "/template1.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 80, y: CH / 2 - 118 } },
];

export default function GenerateQRClient({ finder_id }: Props) {
  const { downloading, sharing, qrValue, svgRef, downloadPDF, shareQR } = useQRGeneration(finder_id);

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className={`${unbounded.className} text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#e8edf8]`}>
            Your QR Code
          </h1>
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6]">
            Choose a template, then download your sticker.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT — Preview */}
          <QRPreview
            templateSrc={selectedTemplate.src}
            qrValue={qrValue}
            qrSize={selectedTemplate.defaultSize}
            qrPosition={selectedTemplate.qrPos}
            canvasWidth={CW}
            canvasHeight={CH}
            svgRef={svgRef}
          />

          {/* RIGHT — Controls */}
          <div className="flex flex-col gap-8">
            <QRActionButtons
              downloading={downloading}
              sharing={sharing}
              onDownload={downloadPDF}
              onShare={shareQR}
            />

            {/* Info box */}
            <div className="rounded-2xl border border-[#e8dfc4] dark:border-[#1e2a4a] bg-[#fef9ed] dark:bg-[#0d1b33] px-4 py-3">
              <p className="text-xs leading-relaxed text-[#8a7a5a] dark:text-[#89aee6]">
                <span className="font-semibold text-slate-900 dark:text-[#e8edf8]">
                  Good to know:{" "}
                </span>
                Whenever you make or receive a call the number will be:{" "}
                <a
                  href="tel:+18287618181"
                  className="font-bold text-[#d85a30] dark:text-[#d85a30] underline decoration-[#d85a30]/40 underline-offset-2 hover:text-[#c04e28] transition-colors"
                >
                  {process.env.NEXT_PUBLIC_TWILIO_NUMBER}
                </a>
                . Feel free to save it to your contacts.
              </p>
            </div>

            <TemplateSelector
              templates={TEMPLATES}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
}
