'use client'

import { Car, Bike, Briefcase, Tag, Laptop, Package, ArrowRight, ScanQrCodeIcon, ChevronUp, ChevronDown, CheckCircle, LucideMessageCircleMore } from "lucide-react";
import { Unbounded } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { COMPANY_NAME } from "@/config/company";
import { useEffect, useState } from "react";
import Image from "next/image";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  adjustFontFallback: true,
  fallback: ["BiauKai", "-apple-system", "BlinkMacSystemFont", "Microsoft JhengHei", "Microsoft YaHei", "Noto Sans TC", "sans-serif"]
});

const useCases = [
  { icon: Car, label: "Vehicle", desc: "Let someone reach you about your parked car — anonymously." },
  { icon: Bike, label: "Bicycle", desc: "Help a stranger return your bike if it's found." },
  { icon: Briefcase, label: "Bag / Luggage", desc: "Lost luggage that finds its way back." },
  { icon: Laptop, label: "Laptop", desc: "Let an honest finder contact you if it goes missing." },
  { icon: Package, label: "Parcels", desc: "Delivery and return routing made instant." },
  { icon: Tag, label: "Anything Else", desc: `If it's yours and you want it back — stick a ${COMPANY_NAME} on it.` },
];

const steps = [
  { n: "1", title: "Enter your phone number", body: "That's it. No email, no name." },
  { n: "2", title: "Download your QR sticker", body: "Print-ready in seconds." },
  { n: "3", title: "Stick it on anything", body: "Car, bag, keys, laptop — your call." },
  { n: "4", title: "Someone scans → you get pinged", body: "They message you or call. Your number stays private." },
];

export default function HomeClient({ loggedin, bsuid, token }: { loggedin: boolean; bsuid: string | undefined; token: string | undefined; }) {

  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    if (loggedin && token && !bsuid) {
      setShowConnectModal(true);
    }
  }, [loggedin, token, bsuid]);

  const handleConnectWhatsApp = () => {
    if (!token) return;

    const message = `CONNECT_${token}`;
    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  return (
    <div className="text-brand-heading dark:text-slate-50">
      <main className="max-w-5xl mx-auto px-6">

        {/* HERO */}
        <section className="py-8 grid gap-4 items-center max-w-6xl mx-auto md:grid-cols-2">

          <div className="hidden md:flex flex-col gap-6 px-4 max-w-xl">
            <h1 className={`${unbounded.className} text-5xl font-extrabold leading-tight tracking-tight text-brand-heading dark:text-brand-heading`}>
              Stay Reachable.<br />
              Without —<br />
              <span className="text-coral">Showing your number.</span>
            </h1>
            <p className="text-base italic text-brand-muted max-w-sm">
              Multipurpose QR codes for anything you own. Stay reachable — Get Contacted anonymously.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Image
              src="/bg.jpg"
              alt="QR preview"
              className="w-full h-auto object-contain rounded-2xl"
              width={250}
              height={170}
              priority={true}
            />
            <p className="md:hidden text-base italic text-brand-muted max-w-sm">
              Multipurpose QR codes for anything you own. Stay reachable — Get Contacted anonymously.
            </p>
          </div>

          {/* CTA Button */}
          <div className="md:col-span-2 flex justify-start">
            <Link href="/qr">
              <Button className="bg-coral hover:bg-coral-hover text-white font-bold h-11 px-7 rounded-full flex items-center gap-2 border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                Generate your QR Code
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Additional Options */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex justify-start">
              <Button
                onClick={() => setAdditionalOpen(!additionalOpen)}
                variant="ghost"
                className="w-40 h-9 text-brand-muted hover:text-[#5a4a2a] dark:text-brand-muted dark:hover:text-brand-heading bg-transparent hover:bg-transparent border border-brand-hr hover:border-coral/50 dark:hover:border-coral rounded-full flex items-center justify-center gap-1 text-xs font-medium transition-colors"
              >
                Additional Options {additionalOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>

            {additionalOpen && (
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/scan"
                    className="flex items-center justify-between p-5 rounded-2xl border
                      border-brand-border hover:border-coral/50
                      dark:border-brand-border dark:hover:border-coral/60
                      bg-brand-card
                      shadow-sm hover:shadow-md hover:-translate-y-0.5
                      transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-coral/10 text-coral flex items-center justify-center group-hover:scale-110 group-hover:bg-coral group-hover:text-white transition-all duration-300">
                        <ScanQrCodeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-brand-heading dark:text-brand-heading">Scan {COMPANY_NAME} QR code</p>
                        <p className="text-xs text-brand-muted">Look up an item by scanning its {COMPANY_NAME} QR code</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </section>

        <hr className="border-brand-hr" />

        {/* USE CASES */}
        <section className="py-8">
          <h2 className={`${unbounded.className} text-2xl font-extrabold tracking-tight mb-2 text-brand-heading dark:text-brand-heading`}>
            Typical Use Cases.
          </h2>
          <p className="text-sm text-brand-muted mb-8">
            Not just vehicles — use it on anything.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col gap-2 p-5 rounded-2xl border
                  border-brand-border hover:border-coral/40
                  dark:border-brand-border dark:hover:border-coral/60
                  bg-brand-card
                  shadow-sm hover:shadow-md hover:-translate-y-1
                  transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-orange-50 text-coral
                  dark:bg-coral/10 dark:text-coral
                  group-hover:scale-110 group-hover:bg-coral group-hover:text-white
                  dark:group-hover:bg-coral dark:group-hover:text-white
                  transition-all duration-300 ease-out shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>

                <p className="font-bold text-sm text-brand-heading dark:text-brand-heading group-hover:text-coral dark:group-hover:text-coral transition-colors duration-200 relative z-10">
                  {label}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed relative z-10">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-brand-hr" />

        {/* HOW IT WORKS */}
        <section className="py-10">
          <h2 className={`${unbounded.className} text-2xl font-extrabold tracking-tight mb-2 text-brand-heading dark:text-brand-heading`}>
            How it works.
          </h2>
          <p className="text-sm text-brand-muted mb-8">
            Up and running in under 30 seconds.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map(({ n, title, body }) => (
              <div
                key={n}
                className="flex flex-col gap-2 p-5 rounded-2xl border
                  border-brand-border hover:border-coral/40
                  dark:border-brand-border dark:hover:border-coral/60
                  bg-brand-card
                  shadow-sm hover:shadow-md hover:-translate-y-1
                  transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs
                  bg-coral text-white
                  group-hover:scale-110 transition-transform duration-300 ease-out shadow-sm relative z-10">
                  {n}
                </div>

                <p className="font-bold text-sm text-brand-heading dark:text-brand-heading group-hover:text-coral dark:group-hover:text-coral transition-colors duration-200 relative z-10">
                  {title}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed relative z-10">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-brand-hr" />

        {/* CTA */}
        <section className="py-10 flex flex-col gap-4 relative overflow-hidden">

          <h2 className={`${unbounded.className} text-3xl md:text-4xl font-extrabold tracking-tight text-brand-heading dark:text-brand-heading relative z-10`}>
            Ready? It takes 30 seconds.
          </h2>
          <p className="text-sm text-brand-muted relative z-10">
            Free. No credit card. No personal data shared.
          </p>
          <div className="relative z-10">
            <Link href="/signin">
              <Button className="bg-coral hover:bg-coral-hover text-white font-bold h-11 px-7 rounded-full flex items-center gap-2 border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* WHATSAPP MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-brand-card dark:bg-brand-navy rounded-2xl p-5 shadow-xl border border-brand-border">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-xl">
                <LucideMessageCircleMore />
              </div>

              <div>
                <h2 className="text-base font-semibold text-brand-heading dark:text-brand-heading">
                  Link Your WhatsApp
                </h2>

                <p className="text-xs text-brand-muted mt-0.5">
                  Receive messages from Finders directly on WhatsApp.
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
              <p className="text-xs leading-relaxed text-green-700 dark:text-green-300">
                To receive messages from <span className="font-semibold">Finders</span>,
                you need to link your WhatsApp account once.
                It only takes a few seconds.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-5 text-xs text-brand-muted">

              <div className="flex gap-2">
                <CheckCircle width={20} height={20} />
                <p>
                  Use the <span className="font-medium text-brand-heading dark:text-brand-heading">
                    same WhatsApp number
                  </span>{" "}
                  that you used to sign in.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle width={20} height={20} />
                <p>
                  After linking, Finders can send you updates and messages on WhatsApp.
                </p>
              </div>

              <div className="flex gap-2">
                <CheckCircle width={20} height={20} />
                <p>
                  You can unlink or relink your WhatsApp anytime from your profile.
                </p>
              </div>

            </div>

            {/* Button */}
            <Button
              onClick={() => {
                handleConnectWhatsApp();
                setShowConnectModal(false);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium h-10 rounded-xl shadow-sm transition-all"
            >
              Link My WhatsApp
            </Button>

            <Button
              onClick={() => setShowConnectModal(false)}
              variant="outline"
              className="w-full mt-3 text-sm font-medium h-10 rounded-xl"
            >
              I'll link later
            </Button>

          </div>
        </div>
      )}
    </div>
  );
}
