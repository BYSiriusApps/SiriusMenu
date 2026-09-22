"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export default function Kayit() {
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
    if (!isSupabaseConfigured()) return setError("Panel henüz kurulmadı (Supabase bağlantısı eksik).");
    if (!sartlarOnay || !kvkkOnay) return setError("Devam etmek için Kullanım Şartları ve KVKK Aydınlatma Metni kutucuklarını işaretlemelisin.");
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
          <div className="tag" style={{ justifyContent: "center" }}>Hesap oluşturuldu</div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            <b>{email}</b> adresine bir onay bağlantısı gönderdik. Gelen kutunu kontrol et ve bağlantıya tıklayınca panele yönlendirileceksin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} className="card" style={{ padding: 28, width: 380, display: "grid", gap: 14 }}>
        <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Hesap oluştur</h1>
        <label><span>E-posta</span>
          <input className="field" style={{ marginTop: 5 }} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label><span>Şifre</span>
          <input className="field" style={{ marginTop: 5 }} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" required checked={sartlarOnay} onChange={(e) => setSartlarOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>
            <Link href="/kullanim-sartlari" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>Kullanım Şartları</Link>&apos;nı okudum ve kabul ediyorum.
          </span>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" required checked={kvkkOnay} onChange={(e) => setKvkkOnay(e.target.checked)} style={{ marginTop: 2 }} />
          <span>
            <Link href="/kvkk-aydinlatma-metni" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>KVKK Aydınlatma Metni</Link>&apos;ni okudum.
          </span>
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
          <input type="checkbox" checked={pazarlamaIzni} onChange={(e) => setPazarlamaIzni(e.target.checked)} style={{ marginTop: 2 }} />
          <span>Kampanya, indirim ve duyurulardan e-posta yoluyla haberdar olmak istiyorum (opsiyonel).</span>
        </label>
        {error && <p style={{ color: "#b3261e", fontSize: 13.5 }}>{error}</p>}
        <button className="btn btn-accent" disabled={loading || !kvkkOnay || !sartlarOnay} type="submit">{loading ? "..." : "Hesap oluştur"}</button>
        <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
          Zaten hesabın var mı? <Link href="/giris" style={{ color: "var(--accent)", fontWeight: 600 }}>Giriş yap</Link>
        </p>
      </form>
    </main>
  );
}
