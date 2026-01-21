import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [
    "HVAC",
    "air conditioning",
    "AC repair",
    "AC installation",
    "heating",
    "Houston",
    "Texas",
    "HVAC contractor",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arcticprohvac.com",
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
