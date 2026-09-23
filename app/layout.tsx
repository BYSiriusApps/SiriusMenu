import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Fraunces, Space_Grotesk, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin-ext"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin-ext"], variable: "--font-body" });
// Menü tema fontları + kullanıcının seçebileceği ek yazı tipleri (bkz. app/lib/menu.tsx FONTS)
const fraunces = Fraunces({ subsets: ["latin-ext"], weight: ["500", "600"], variable: "--m-fraunces" });
const spaceg = Space_Grotesk({ subsets: ["latin-ext"], weight: ["500", "600", "700"], variable: "--m-space" });
const playfair = Playfair_Display({ subsets: ["latin-ext"], weight: ["600", "700"], variable: "--m-playfair" });
const poppins = Poppins({ subsets: ["latin-ext"], weight: ["500", "600", "700"], variable: "--m-poppins" });

export const metadata: Metadata = {
  title: "SiriusMenu — QR ile dijital menü",
  description:
    "Kafe ve restoranlar için QR menü. Ürünleri gir, temayı seç, QR kodu masaya koy. Fiyat güncellemesi anında, baskı maliyeti yok.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [display.variable, body.variable, fraunces.variable, spaceg.variable, playfair.variable, poppins.variable].join(" ");
  return (
    <html lang="tr" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
