"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "sirius_cookie_consent";

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--paper)] px-6 py-4 shadow-[0_-8px_24px_-16px_rgba(0,0,0,.2)]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {t("text")}{" "}
          <Link href="/cerez-politikasi" className="text-[var(--accent)] underline">
            {t("policyLink")}
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button type="button" onClick={() => choose("rejected")} className="btn btn-ghost !px-4 !py-2 text-sm">
            {t("reject")}
          </button>
          <button type="button" onClick={() => choose("accepted")} className="btn btn-accent !px-4 !py-2 text-sm">
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
