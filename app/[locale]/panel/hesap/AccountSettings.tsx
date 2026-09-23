"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

const SUPPORT_EMAIL = "bysiriusapp@gmail.com";

export function AccountSettings({ email, restaurantName, subscriptionStatus, planInterval }: {
  email: string; restaurantName: string; subscriptionStatus: string; planInterval: string | null;
}) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const planLabel =
    subscriptionStatus === "active" ? `Aktif — ${planInterval === "year" ? "yıllık" : "aylık"} plan`
    : subscriptionStatus === "trialing" ? "Deneme sürümü"
    : "Pasif";

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password.length < 6) return setMsg({ type: "err", text: "Şifre en az 6 karakter olmalı." });
    if (password !== password2) return setMsg({ type: "err", text: "Şifreler eşleşmiyor." });
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) return setMsg({ type: "err", text: "Şifre güncellenemedi, tekrar dene." });
    setPassword("");
    setPassword2("");
    setMsg({ type: "ok", text: "Şifre güncellendi." });
  };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "22px 22px 80px" }}>
      <Link href="/panel" style={{ fontSize: 13, color: "var(--muted)" }}>← Panele dön</Link>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginTop: 10, marginBottom: 18 }}>Hesap ayarları</h1>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="tag">Profil</div>
        <div style={{ marginTop: 12, display: "grid", gap: 10, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>E-posta</span>
            <span style={{ fontWeight: 600 }}>{email}</span>
          </div>
          {restaurantName && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>İşletme</span>
              <span style={{ fontWeight: 600 }}>{restaurantName}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>Plan</span>
            <span style={{ fontWeight: 600 }}>{planLabel}</span>
          </div>
        </div>
      </div>

      <form onSubmit={changePassword} className="card" style={{ padding: 20, marginBottom: 16, display: "grid", gap: 12 }}>
        <div className="tag">Şifre değiştir</div>
        <label><span>Yeni şifre</span>
          <input className="field" style={{ marginTop: 5 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label><span>Yeni şifre (tekrar)</span>
          <input className="field" style={{ marginTop: 5 }} type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        </label>
        {msg && <p style={{ fontSize: 13, color: msg.type === "err" ? "#b3261e" : "#2e7d32" }}>{msg.text}</p>}
        <button className="btn btn-accent" style={{ padding: "10px 16px", fontSize: 13.5, justifySelf: "start" }} disabled={busy} type="submit">
          {busy ? "Güncelleniyor…" : "Şifreyi güncelle"}
        </button>
      </form>

      <div className="card" style={{ padding: 20 }}>
        <div className="tag">Destek</div>
        <p style={{ marginTop: 8, fontSize: 13.5, color: "var(--muted)" }}>
          Sorun veya sorularınız için bize yazın: <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{SUPPORT_EMAIL}</a>
        </p>
      </div>
    </main>
  );
}
