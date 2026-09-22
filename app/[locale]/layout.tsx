import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Fraunces, Space_Grotesk } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  if (!routing.locales.includes(resolvedParams.locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const fonts = [display.variable, body.variable, fraunces.variable, spaceg.variable].join(" ");
  
  return (
    <html lang={resolvedParams.locale} className={fonts}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
