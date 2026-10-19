"use client";
import { Logo } from "@/app/components/Logo";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export default function SifreSifirla() {
  const t = useTranslations("Auth.reset");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setError(t("errNotConfigured"));
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/sifre-yenile`,
    });
    setLoading(false);
    if (error && /rate limit|too many/i.test(error.message)) return setError(t("errRate"));
    setDone(true); // hesap var mı yok mu belli etmeyen nötr yanıt
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, maxWidth: "100%", display: "grid", gap: 14 }}>
        <Link href="/" aria-label="SiriusMenu"><Logo height={30} /></Link>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{t("title")}</h1>
        {done ? (
          <p role="status" style={{ color: "var(--muted)" }}>{t("sent")}</p>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("intro")}</p>
            <label><span>{t("email")}</span>
              <input className="field" style={{ marginTop: 5 }} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {error && <p role="alert" style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
            <button className="btn btn-accent" disabled={loading} type="submit">{loading ? t("submitting") : t("submit")}</button>
          </>
        )}
        <p style={{ fontSize: 13.5, textAlign: "center" }}>
          <Link href="/giris" style={{ color: "var(--accent)", fontWeight: 600 }}>{t("back")}</Link>
        </p>
      </form>
    </main>
  );
}
