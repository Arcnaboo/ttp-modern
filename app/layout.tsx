import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Terörsüz Türkiye Platformu",
    template: "%s — Terörsüz Türkiye Platformu",
  },
  description: "Hepimiz kardeşiz. Milli birlik, kardeşlik ve dayanışma iradesiyle terörsüz bir Türkiye.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
