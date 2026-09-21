import Link from "next/link";

export default function KurulumBekliyor() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div className="card" style={{ padding: 28, maxWidth: 440 }}>
        <div className="tag" style={{ justifyContent: "center" }}>Kurulum bekleniyor</div>
        <p style={{ marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          Panel, giriş ve yayınlanan menüler Supabase bağlantısı gerektirir. Bu ortam için henüz bir Supabase projesi bağlanmadı.
          <code style={{ display: "block", marginTop: 10, fontSize: 12 }}>NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY</code>
          eklenince bu sayfa otomatik olarak çalışmaya başlar.
        </p>
        <Link href="/app" className="btn btn-accent" style={{ marginTop: 18, display: "inline-flex" }}>Ücretsiz deneme sürümünü kullan</Link>
      </div>
    </main>
  );
}
