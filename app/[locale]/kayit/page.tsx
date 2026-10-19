"use client";
import { Logo } from "@/app/components/Logo";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

const linkStyle = { color: "var(--accent)", fontWeight: 600 } as const;
const checkStyle = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 } as const;

export default function Kayit() {
  const t = useTranslations("Auth.register");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [sartlarOnay, setSartlarOnay] = useState(false);
  const [pazarlamaIzni, setPazarlamaIzni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  // Onay bağlantısı başka sekmede açılınca bu sekme de panele geçsin.
  useEffect(() => {
    if (!sent) return;
    const supabase = createClient();
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace("/panel");
    };
    const id = setInterval(check, 4000);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", check);
    };
  }, [sent, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setError(t("errNotConfigured"));
    if (!sartlarOnay || !kvkkOnay) return setError(t("errConsent"));
    if (password.length < 8) return setError(t("errPasswordShort"));
    setLoading(true);
    setError(null);
    setExists(false);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { pazarlama_izni: pazarlamaIzni },
      },
    });
    setLoading(false);
    if (error) {
      if (/already|registered/i.test(error.message)) {
        setExists(true);
        return setError(t("errExists"));
      }
      if (/rate limit|too many/i.test(error.message)) return setError(t("errRate"));
      return setError(error.message);
    }
    // Supabase, kayıtlı e-postada hata dönmez; user.identities boş gelir ve mail gitmez.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setExists(true);
      return setError(t("errExists"));
    }
    if (data.session) return router.push("/panel");
    setSent(true);
  };

  const resend = async () => {
    setResendMsg(null);
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setResendMsg(error ? t("resendErr") : t("resendOk"));
  };

  if (sent) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="card" style={{ padding: 28, maxWidth: 420, textAlign: "center", display: "grid", gap: 12 }}>
          <div className="tag" style={{ justifyContent: "center" }}>{t("sentTitle")}</div>
          <p style={{ color: "var(--muted)" }}>
            {t.rich("sentBody", { email: email.trim(), b: (chunks) => <b>{chunks}</b> })}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>{t("sentHint")}</p>
          <button type="button" className="btn btn-ghost" onClick={resend}>{t("resend")}</button>
          {resendMsg && <p role="status" style={{ fontSize: 13 }}>{resendMsg}</p>}
          <p style={{ fontSize: 13.5 }}>
            <button type="button" onClick={() => { setSent(false); setResendMsg(null); }} style={{ ...linkStyle, background: "none", border: 0, cursor: "pointer" }}>{t("wrongEmail")}</button>
            {" · "}
            <Link href="/giris" style={linkStyle}>{t("login")}</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, maxWidth: "100%", display: "grid", gap: 14 }}>
        <Link href="/" aria-label="SiriusMenu"><Logo height={30} /></Link>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{t("title")}</h1>
        <label><span>{t("email")}</span>
          <input className="field" style={{ marginTop: 5 }} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label><span>{t("password")}</span>
          <span style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <input className="field" style={{ flex: 1 }} type={showPw ? "text" : "password"} required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="btn btn-ghost" style={{ padding: "0 12px" }} onClick={() => setShowPw((v) => !v)} aria-label={showPw ? t("hidePassword") : t("showPassword")}>{showPw ? t("hide") : t("show")}</button>
          </span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{t("passwordHint")}</span>
        </label>
        <label style={checkStyle}>
          <input type="checkbox" required checked={sartlarOnay} onChange={(e) => setSartlarOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>{t.rich("termsAccept", { terms: (chunks) => <Link href="/kullanim-sartlari" target="_blank" style={linkStyle}>{chunks}</Link> })}</span>
        </label>
        <label style={checkStyle}>
          <input type="checkbox" required checked={kvkkOnay} onChange={(e) => setKvkkOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>{t.rich("kvkkAccept", { kvkk: (chunks) => <Link href="/kvkk-aydinlatma-metni" target="_blank" style={linkStyle}>{chunks}</Link> })}</span>
        </label>
        <label style={checkStyle}>
          <input type="checkbox" checked={pazarlamaIzni} onChange={(e) => setPazarlamaIzni(e.target.checked)} style={{ marginTop: 2 }} />
          <span>{t.rich("marketingOptIn", { l: (chunks) => <Link href="/ticari-elektronik-ileti" target="_blank" style={linkStyle}>{chunks}</Link> })}</span>
        </label>
        {error && (
          <p role="alert" style={{ color: "#b3261e", fontSize: 13.5 }}>
            {error}
            {exists && (
              <>
                {" "}
                <Link href="/giris" style={linkStyle}>{t("login")}</Link>
                {" · "}
                <Link href="/sifre-sifirla" style={linkStyle}>{t("forgot")}</Link>
              </>
            )}
          </p>
        )}
        <button className="btn btn-accent" disabled={loading || !kvkkOnay || !sartlarOnay} type="submit">{loading ? t("submitting") : t("submit")}</button>
        <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
          {t("haveAccount")} <Link href="/giris" style={linkStyle}>{t("login")}</Link>
        </p>
      </form>
    </main>
  );
}
