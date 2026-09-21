"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";

function GirisForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setError("Panel henüz kurulmadı (Supabase bağlantısı eksik).");
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError("E-posta veya şifre hatalı.");
    router.push(params.get("next") || "/panel");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, display: "grid", gap: 14 }}>
      <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
      <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Giriş yap</h1>
      <label><span>E-posta</span>
        <input className="field" style={{ marginTop: 5 }} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label><span>Şifre</span>
        <input className="field" style={{ marginTop: 5 }} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
      <button className="btn btn-accent" disabled={loading} type="submit">{loading ? "..." : "Giriş yap"}</button>
      <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
        Hesabın yok mu? <Link href="/kayit" style={{ color: "var(--accent)", fontWeight: 600 }}>Hesap oluştur</Link>
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
