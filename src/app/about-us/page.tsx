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
          <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-brand-heading dark:text-brand-heading`}>
            About <span className="text-coral">{COMPANY_NAME}.</span>
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Revolutionizing how people connect and share information through intelligent QR code solutions.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-6 rounded-2xl p-8 border
          border-brand-border
          bg-brand-card
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-coral/40 dark:hover:border-coral/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-brand-heading dark:text-brand-heading group-hover:text-coral dark:group-hover:text-coral transition-colors duration-200`}>
            Our Mission.
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed relative z-10">
            {COMPANY_NAME} is dedicated to providing secure, multipurpose QR code solutions that empower individuals and businesses to connect with their audiences in innovative ways. We believe in making technology accessible, secure, and user-friendly for everyone.
          </p>
        </div>

        {/* Vision */}
        <div className="mb-16 rounded-2xl p-8 border
          border-brand-border
          bg-brand-card
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-coral/40 dark:hover:border-coral/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-brand-heading dark:text-brand-heading group-hover:text-coral dark:group-hover:text-coral transition-colors duration-200`}>
            Our Vision.
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed relative z-10">
            We envision a world where QR codes are more than just links — they're gateways to secure, anonymous, and meaningful connections. Whether it's for vehicles, belongings, or personal branding, {COMPANY_NAME} provides the tools to bridge the digital and physical worlds.
          </p>
        </div>

        <hr className="border-brand-hr mb-16 -mt-10" />

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className={`text-2xl font-extrabold tracking-tight mb-2 text-brand-heading dark:text-brand-heading`}>
            Why Choose Us?
          </h2>
          <p className="text-sm text-brand-muted mb-8">
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
                  {title}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed relative z-10">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-brand-hr mb-16 -mt-6" />

        {/* Tech Stack */}
        <div className="mb-16 rounded-2xl p-8 border
          border-brand-border
          bg-brand-card
          shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-coral/40 dark:hover:border-coral/60
          transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <h2 className={`text-2xl font-extrabold tracking-tight mb-4 text-brand-heading dark:text-brand-heading group-hover:text-coral dark:group-hover:text-coral transition-colors duration-200`}>
            Built with Modern Technology.
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed relative z-10">
            {COMPANY_NAME} is built on cutting-edge web technologies including Next.js, React, and TypeScript, ensuring fast, reliable, and secure performance for our users worldwide.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 relative z-10">
            {["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "Twilio", "Meta API"].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-3 py-1 rounded-full
                  bg-orange-50 text-coral border border-brand-border
                  dark:bg-coral/10 dark:text-coral dark:border-brand-border"
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
