import { COMPANY_NAME } from "@/config/company";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us`,
  description: `Learn more about ${COMPANY_NAME} and our mission to revolutionize QR code technology.`,
};

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-slate-50 dark:from-black dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            About {COMPANY_NAME}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Revolutionizing how people connect and share information through intelligent QR code solutions.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {COMPANY_NAME} is dedicated to providing secure, multipurpose QR code solutions that empower individuals and businesses to connect with their audiences in innovative ways. We believe in making technology accessible, secure, and user-friendly for everyone.
          </p>
        </div>

        {/* Vision Section */}
        <div className="mb-16 bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Vision</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We envision a world where QR codes are more than just links—they're gateways to secure, anonymous, and meaningful connections. Whether it's for vehicles, belongings, or personal branding, {COMPANY_NAME} provides the tools to bridge the digital and physical worlds.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure & Anonymous",
                description: "Your data stays protected with our advanced encryption and privacy-first approach.",
              },
              {
                title: "Multipurpose Solutions",
                description: "Create QR codes for vehicles, belongings, personal profiles, and much more.",
              },
              {
                title: "Global Coverage",
                description: "Reach people anywhere in the world with our reliable, scalable infrastructure.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack Section */}
        <div className="mb-16 bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Built with Modern Technology</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {COMPANY_NAME} is built on cutting-edge web technologies including Next.js, React, and TypeScript, ensuring fast, reliable, and secure performance for our users worldwide.
          </p>
        </div>
      </div>
    </main>
  );
}
