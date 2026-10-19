"use client";
import { Logo } from "@/app/components/Logo";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";

export default function SifreYenile() {
  const t = useTranslations("Auth.newPassword");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError(t("errShort"));
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(/session|auth/i.test(error.message) ? t("errSession") : error.message);
    router.replace("/panel");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, maxWidth: "100%", display: "grid", gap: 14 }}>
        <Link href="/" aria-label="SiriusMenu"><Logo height={30} /></Link>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{t("title")}</h1>
        <label><span>{t("password")}</span>
          <input className="field" style={{ marginTop: 5 }} type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{t("hint")}</span>
        </label>
        {error && <p role="alert" style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
        <button className="btn btn-accent" disabled={loading} type="submit">{loading ? t("submitting") : t("submit")}</button>
      </form>
    </main>
  );
}
