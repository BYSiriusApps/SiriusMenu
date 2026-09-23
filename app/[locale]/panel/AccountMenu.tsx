"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";

export function AccountMenu({ email }: { email: string }) {
  const t = useTranslations("Panel.accountMenu");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          cursor: "pointer", fontSize: 13.5, color: "var(--muted)", padding: "6px 4px",
        }}
      >
        {email}
        <span style={{ fontSize: 10, transform: open ? "rotate(180deg)" : undefined, transition: "transform .15s" }}>▾</span>
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)", background: "var(--paper)",
            border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.1)",
            minWidth: 200, padding: 6, zIndex: 50,
          }}
        >
          <Link
            href="/panel/hesap"
            onClick={() => setOpen(false)}
            className="menu-item"
            style={{ display: "block", padding: "9px 12px", borderRadius: 8, fontSize: 13.5, color: "var(--ink)", textDecoration: "none" }}
          >
            {t("settings")}
          </Link>
          <button
            onClick={signOut}
            className="menu-item"
            style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, fontSize: 13.5, background: "none", border: "none", cursor: "pointer", color: "var(--ink)" }}
          >
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
