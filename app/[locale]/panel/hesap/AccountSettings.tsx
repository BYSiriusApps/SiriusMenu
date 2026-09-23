"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

const SUPPORT_EMAIL = "info@bysirius.com";

export function AccountSettings({ email, restaurantName, subscriptionStatus, planInterval }: {
  email: string; restaurantName: string; subscriptionStatus: string; planInterval: string | null;
}) {
  const t = useTranslations("Panel.account");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const planLabel =
    subscriptionStatus === "active" ? t("planActive", { interval: planInterval === "year" ? t("intervalYear") : t("intervalMonth") })
    : subscriptionStatus === "trialing" ? t("planTrial")
    : t("planInactive");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password.length < 6) return setMsg({ type: "err", text: t("errShort") });
    if (password !== password2) return setMsg({ type: "err", text: t("errMismatch") });
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) return setMsg({ type: "err", text: t("errUpdateFailed") });
    setPassword("");
    setPassword2("");
    setMsg({ type: "ok", text: t("okUpdated") });
  };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "22px 22px 80px" }}>
      <Link href="/panel" style={{ fontSize: 13, color: "var(--muted)" }}>{t("backToPanel")}</Link>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginTop: 10, marginBottom: 18 }}>{t("title")}</h1>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="tag">{t("profile")}</div>
        <div style={{ marginTop: 12, display: "grid", gap: 10, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>{t("email")}</span>
            <span style={{ fontWeight: 600 }}>{email}</span>
          </div>
          {restaurantName && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{t("business")}</span>
              <span style={{ fontWeight: 600 }}>{restaurantName}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>{t("plan")}</span>
            <span style={{ fontWeight: 600 }}>{planLabel}</span>
          </div>
        </div>
      </div>

      <form onSubmit={changePassword} className="card" style={{ padding: 20, marginBottom: 16, display: "grid", gap: 12 }}>
        <div className="tag">{t("changePassword")}</div>
        <label><span>{t("newPassword")}</span>
          <input className="field" style={{ marginTop: 5 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label><span>{t("newPasswordRepeat")}</span>
          <input className="field" style={{ marginTop: 5 }} type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        </label>
        {msg && <p style={{ fontSize: 13, color: msg.type === "err" ? "#b3261e" : "#2e7d32" }}>{msg.text}</p>}
        <button className="btn btn-accent" style={{ padding: "10px 16px", fontSize: 13.5, justifySelf: "start" }} disabled={busy} type="submit">
          {busy ? t("updating") : t("updatePassword")}
        </button>
      </form>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="tag">{t("language")}</div>
        <p style={{ marginTop: 8, marginBottom: 12, fontSize: 13.5, color: "var(--muted)" }}>{t("languageDesc")}</p>
        <LanguageSwitcher />
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="tag">{t("support")}</div>
        <p style={{ marginTop: 8, fontSize: 13.5, color: "var(--muted)" }}>
          {t("supportText")} <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{SUPPORT_EMAIL}</a>
        </p>
      </div>
    </main>
  );
}
