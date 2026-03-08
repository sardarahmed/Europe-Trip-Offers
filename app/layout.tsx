import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://europetripoffers.com"),
  title: {
    default: "Europe Trip Offers | Best Travel Deals & Coupons",
    template: "%s | Europe Trip Offers"
  },
  description: "Discover exclusive deals on Europe tours, hotels, and attractions. Save up to 50% with verified coupons.",
  keywords: ["Europe Travel", "Travel Coupons", "Paris Tours", "Viator Discount", "Travel Deals"],
  authors: [{ name: "Europe Trip Offers Team" }],
  openGraph: {
    title: "Europe Trip Offers | Best Travel Deals & Coupons",
    description: "Discover exclusive deals on Europe tours, hotels, and attractions. Save up to 50% with verified coupons.",
    url: "https://europetripoffers.com",
    siteName: "Europe Trip Offers",
    images: [
      {
        url: "/og-image.jpg", // Suggested to place an image here later
        width: 1200,
        height: 630,
        alt: "Europe Trip Offers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Europe Trip Offers | Best Travel Deals & Coupons",
    description: "Discover exclusive deals on Europe tours, hotels, and attractions. Save up to 50% with verified coupons.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "NKEBxn6sdtDuwhxUOMdJyxJ4z6qcORqsxRqFDqzhoGI",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.variable, outfit.variable, "min-h-screen bg-background font-sans antialiased")}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
