import { COMPANY_NAME } from "@/config/company";
import { ShieldCheck, QrCode, Globe } from "lucide-react";

export const metadata = {
  title: `About Us`,
  description: `Learn more about ${COMPANY_NAME} and our mission to revolutionize QR code technology.`,
};

export default function AboutUs() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-[#e8edf8]`}>
            About <span className="text-[#d85a30]">{COMPANY_NAME}.</span>
          </h1>
          <p className="text-base text-[#8a7a5a] dark:text-[#89aee6] max-w-2xl mx-auto">
            Revolutionizing how people connect and share information through intelligent QR code solutions.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-6 rounded-2xl p-8 border
          border-[#e8dfc4] dark:border-[#1e2a4a]
          bg-[#fef9ed] dark:bg-[#0d1b33]
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#d85a30]/40 dark:hover:border-[#d85a30]/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#d85a30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-[#e8edf8] group-hover:text-[#d85a30] dark:group-hover:text-[#d85a30] transition-colors duration-200`}>
            Our Mission.
          </h2>
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] leading-relaxed relative z-10">
            {COMPANY_NAME} is dedicated to providing secure, multipurpose QR code solutions that empower individuals and businesses to connect with their audiences in innovative ways. We believe in making technology accessible, secure, and user-friendly for everyone.
          </p>
        </div>

        {/* Vision */}
        <div className="mb-16 rounded-2xl p-8 border
          border-[#e8dfc4] dark:border-[#1e2a4a]
          bg-[#fef9ed] dark:bg-[#0d1b33]
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#d85a30]/40 dark:hover:border-[#d85a30]/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#d85a30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-[#e8edf8] group-hover:text-[#d85a30] dark:group-hover:text-[#d85a30] transition-colors duration-200`}>
            Our Vision.
          </h2>
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] leading-relaxed relative z-10">
            We envision a world where QR codes are more than just links — they're gateways to secure, anonymous, and meaningful connections. Whether it's for vehicles, belongings, or personal branding, {COMPANY_NAME} provides the tools to bridge the digital and physical worlds.
          </p>
        </div>

        <hr className="border-[#e0d5b8] dark:border-[#1e2a4a] mb-16 -mt-10" />

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className={`text-2xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-[#e8edf8]`}>
            Why Choose Us?
          </h2>
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] mb-8">
            Built around your privacy, from day one.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Secure & Anonymous",
                description: "Your data stays protected with our advanced encryption and privacy-first approach.",
              },
              {
                icon: QrCode,
                title: "Multipurpose Solutions",
                description: "Create QR codes for vehicles, belongings, personal profiles, and much more.",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description: "Reach people anywhere in the world with our reliable, scalable infrastructure.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-2 p-5 rounded-2xl border
                  border-[#e8dfc4] hover:border-[#d85a30]/40
                  dark:border-[#1e2a4a] dark:hover:border-[#d85a30]/60
                  bg-[#fef9ed] dark:bg-[#0d1b33]
                  shadow-sm hover:shadow-md hover:-translate-y-1
                  transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#d85a30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-orange-50 text-[#d85a30]
                  dark:bg-[#d85a30]/10 dark:text-[#d85a30]
                  group-hover:scale-110 group-hover:bg-[#d85a30] group-hover:text-white
                  dark:group-hover:bg-[#d85a30] dark:group-hover:text-white
                  transition-all duration-300 ease-out shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-[#e8edf8] group-hover:text-[#d85a30] dark:group-hover:text-[#d85a30] transition-colors duration-200 relative z-10">
                  {title}
                </p>
                <p className="text-xs text-[#8a7a5a] dark:text-[#89aee6] leading-relaxed relative z-10">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-[#e0d5b8] dark:border-[#1e2a4a] mb-16 -mt-6" />

        {/* Tech Stack */}
        <div className="mb-16 rounded-2xl p-8 border
          border-[#e8dfc4] dark:border-[#1e2a4a]
          bg-[#fef9ed] dark:bg-[#0d1b33]
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#d85a30]/40 dark:hover:border-[#d85a30]/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#d85a30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-[#e8edf8] group-hover:text-[#d85a30] dark:group-hover:text-[#d85a30] transition-colors duration-200`}>
            Built with Modern Technology.
          </h2>
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] leading-relaxed relative z-10">
            {COMPANY_NAME} is built on cutting-edge web technologies including Next.js, React, and TypeScript, ensuring fast, reliable, and secure performance for our users worldwide.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 relative z-10">
            {["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS"].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-3 py-1 rounded-full
                  bg-orange-50 text-[#d85a30] border border-[#e8dfc4]
                  dark:bg-[#d85a30]/10 dark:text-[#d85a30] dark:border-[#1e2a4a]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
