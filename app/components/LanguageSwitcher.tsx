"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const LOCALES = [
  { code: "tr" as const, label: "TR" },
  { code: "en" as const, label: "EN" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Dil / Language"
      className="flex items-center gap-0.5 rounded-full border border-[var(--line)] p-0.5 text-xs font-semibold"
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-current={locale === l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === l.code
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
