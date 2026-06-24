import { COMPANY_NAME } from "@/config/company";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: `Contact Us`,
  description: `Get in touch with ${COMPANY_NAME}. We're here to help and answer any questions you might have.`,
};

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-slate-50 dark:from-black dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Get in touch with our team anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 mb-16">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>

            {/* Email */}
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  <Link
                    href="mailto:mail.abhinavranjanjha@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    mail.abhinavranjanjha@gmail.com
                  </Link>
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Location</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Global Coverage<br />
                  Available 24/7
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/ARJ544"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  title="GitHub"
                >
                  <svg
                    viewBox="0 0 16 16"
                    version="1.1"
                    className="h-6 w-6"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </Link>
                <Link
                  href="https://linkedin.com/in/abhinavranjanjha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  title="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    version="1.1"
                    className="h-6 w-6"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.836 0-9.755h3.554v1.381c.43-.664 1.199-1.61 2.920-1.61 2.135 0 3.732 1.39 3.732 4.377v5.607zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.707 0-.955.77-1.708 1.957-1.708 1.188 0 1.914.753 1.939 1.708 0 .949-.751 1.707-1.981 1.707zm1.581 11.597H3.715V9.697h3.203v10.755zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
