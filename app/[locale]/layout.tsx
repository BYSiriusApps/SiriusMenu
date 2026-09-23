import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { CookieConsent } from "@/app/components/CookieConsent";

// Not: <html>/<body> artık app/layout.tsx'te (asıl root layout) — /panel ve /m/{slug}
// gibi [locale] dışındaki rotalar da o dosyaya ihtiyaç duyuyor, Next.js'te tek root
// layout olabilir. Burası sadece locale doğrulama + NextIntlClientProvider sağlıyor.
export default async function LocaleLayout({
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

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
