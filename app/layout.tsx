import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "negosyo.ai - AI-Powered Business Planning for Filipino Entrepreneurs",
  description:
    "Transform your business ideas into reality with AI-powered business plans, marketing strategies, and step-by-step coaching for Filipino micro-entrepreneurs.",
  keywords:
    "business planning, Filipino entrepreneurs, AI business plan, micro-business, startup Philippines",
  authors: [{ name: "BPxAI" }],
  openGraph: {
    title: "negosyo.ai - AI Business Planning Platform",
    description:
      "Get personalized business plans and coaching for your Filipino micro-enterprise",
    type: "website",
  },
  generator: "BPxAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
