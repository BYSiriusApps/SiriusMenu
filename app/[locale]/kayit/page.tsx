"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export default function Kayit() {
  const t = useTranslations("Auth.register");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [sartlarOnay, setSartlarOnay] = useState(false);
  const [pazarlamaIzni, setPazarlamaIzni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setError(t("errNotConfigured"));
    if (!sartlarOnay || !kvkkOnay) return setError(t("errConsent"));
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { pazarlama_izni: pazarlamaIzni },
      },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) return router.push("/panel");
    setSent(true);
  };

  if (sent) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="card" style={{ padding: 28, maxWidth: 420, textAlign: "center" }}>
          <div className="tag" style={{ justifyContent: "center" }}>{t("sentTitle")}</div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            {t.rich("sentBody", { email, b: (chunks) => <b>{chunks}</b> })}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, display: "grid", gap: 14 }}>
        <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{t("title")}</h1>
        <label><span>{t("email")}</span>
          <input className="field" style={{ marginTop: 5 }} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label><span>{t("password")}</span>
          <input className="field" style={{ marginTop: 5 }} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" required checked={sartlarOnay} onChange={(e) => setSartlarOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>
            {t.rich("termsAccept", { terms: (chunks) => <Link href="/kullanim-sartlari" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>{chunks}</Link> })}
          </span>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" required checked={kvkkOnay} onChange={(e) => setKvkkOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>
            {t.rich("kvkkAccept", { kvkk: (chunks) => <Link href="/kvkk-aydinlatma-metni" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>{chunks}</Link> })}
          </span>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" checked={pazarlamaIzni} onChange={(e) => setPazarlamaIzni(e.target.checked)} style={{ marginTop: 2 }} />
          <span>{t("marketingOptIn")}</span>
        </label>
        {error && <p style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
        <button className="btn btn-accent" disabled={loading || !kvkkOnay || !sartlarOnay} type="submit">{loading ? t("submitting") : t("submit")}</button>
        <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
          {t("haveAccount")} <Link href="/giris" style={{ color: "var(--accent)", fontWeight: 600 }}>{t("login")}</Link>
        </p>
      </form>
    </main>
  );
}
