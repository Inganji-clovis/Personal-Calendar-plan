import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "INGANJI LIFE OS", template: "%s · INGANJI LIFE OS" },
  description:
    "Your personal operating system for study, studio work, university, and finance — all in one place.",
  applicationName: "INGANJI LIFE OS",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "INGANJI LIFE OS" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
