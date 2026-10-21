import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});

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
    <html lang="tr" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body className={sourceSans.className}>{children}</body>
    </html>
  );
}
