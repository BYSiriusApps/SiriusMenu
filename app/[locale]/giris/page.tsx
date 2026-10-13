"use client";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

function GirisForm() {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setError(t("errNotConfigured"));
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setError(/not confirmed/i.test(error.message) ? t("errUnconfirmed") : t("errInvalid"));
    const next = params.get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/panel");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, maxWidth: "100%", display: "grid", gap: 14 }}>
      <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
      <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{t("title")}</h1>
      {params.get("error") === "confirm" && <p role="alert" style={{ fontSize: 13.5, color: "#b3261e" }}>{t("errConfirmLink")}</p>}
      {params.get("expired") && <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("expired")}</p>}
      <label><span>{t("email")}</span>
        <input className="field" style={{ marginTop: 5 }} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label><span>{t("password")}</span>
        <input className="field" style={{ marginTop: 5 }} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert" style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
      <button className="btn btn-accent" disabled={loading} type="submit">{loading ? t("submitting") : t("submit")}</button>
      <p style={{ fontSize: 13.5, textAlign: "center" }}>
        <Link href="/sifre-sifirla" style={{ color: "var(--accent)", fontWeight: 600 }}>{t("forgot")}</Link>
      </p>
      <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
        {t("noAccount")} <Link href="/kayit" style={{ color: "var(--accent)", fontWeight: 600 }}>{t("createAccount")}</Link>
      </p>
    </form>
  );
}

export default function Giris() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Suspense fallback={null}>
        <GirisForm />
      </Suspense>
    </main>
  );
}
