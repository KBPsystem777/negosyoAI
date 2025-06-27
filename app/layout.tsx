import { Analytics } from "@vercel/analytics/next";

import type React from "react";
import Script from "next/script";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { negosyoAIConfig } from "@/lib/config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = negosyoAIConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-C879WDJ90T`} // Replace with your GA4 ID
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C879WDJ90T');
          `,
        }}
      />
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
