import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LocalPulse - AI Appointment Booking & Retention",
    template: `%s | LocalPulse`,
  },
  description: "AI-powered appointment booking and customer retention for local service businesses",
  keywords: [
    "appointment booking",
    "local business",
    "customer retention",
    "AI chatbot",
    "scheduling software",
  ],
  authors: [{ name: "LocalPulse" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LocalPulse",
    title: "LocalPulse - AI Appointment Booking & Retention",
    description: "AI-powered appointment booking and customer retention for local service businesses",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
