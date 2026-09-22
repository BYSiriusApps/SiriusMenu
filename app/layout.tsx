import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin-ext"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin-ext"], variable: "--font-body" });
// Menü tema fontları
const fraunces = Fraunces({ subsets: ["latin-ext"], weight: ["500", "600"], variable: "--m-fraunces" });
const spaceg = Space_Grotesk({ subsets: ["latin-ext"], weight: ["500", "600", "700"], variable: "--m-space" });

export const metadata: Metadata = {
  title: "SiriusMenu — QR ile dijital menü",
  description:
    "Kafe ve restoranlar için QR menü. Ürünleri gir, temayı seç, QR kodu masaya koy. Fiyat güncellemesi anında, baskı maliyeti yok.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [display.variable, body.variable, fraunces.variable, spaceg.variable].join(" ");
  return (
    <html lang="tr" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
