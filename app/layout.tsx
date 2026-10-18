// ============================================================================
// ECOCAMPUS ROOT LAYOUT — APP/LAYOUT.TSX
// Full-screen Mobile Viewport, PWA Meta Tags & Global AI Support Desk
// ============================================================================

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SupportWidget } from "@/components/support/SupportWidget";

export const metadata: Metadata = {
  title: "EcoCampus — Student FinTech & Ecobank Digital Banking",
  description: "Learn. Grow. Achieve. Instant NIBSS transfers, Ecobank NGN & USD Domiciliary accounts, and NGX Stock Investments.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EcoCampus",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#007749",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100dvh",
          backgroundColor: "#f8fafc",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}