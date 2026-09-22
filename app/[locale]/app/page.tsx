"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  DEFAULT_MENU, THEMES, TAGS, CURRENCIES, type MenuData, type Category, type Item, type Tag,
} from "@/app/lib/menu";
import { MenuView, Phone } from "@/app/lib/MenuView";

export default function Builder() {
  const [menu, setMenu] = useState<MenuData>(DEFAULT_MENU);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiId, setAiId] = useState<number | null>(null);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/m` : "https://siriusmenu.com/m";
  useEffect(() => { QRCode.toDataURL(shareUrl, { margin: 1, width: 320, color: { dark: "#1c1a17", light: "#ffffff" } }).then(setQr).catch(() => {}); }, [shareUrl]);
  useEffect(() => { try { localStorage.setItem("siriusmenu", JSON.stringify(menu)); } catch {} }, [menu]);

  const setField = (k: keyof MenuData, v: string) => setMenu((p) => ({ ...p, [k]: v }));
  const nextId = () => Math.floor(Math.random() * 1e9);

  const addCat = () => setMenu((p) => ({ ...p, categories: [...p.categories, { id: nextId(), name: "Yeni kategori", items: [] }] }));
  const renameCat = (id: number, name: string) => setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === id ? { ...c, name } : c) }));
  const delCat = (id: number) => setMenu((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== id) }));
  const addItem = (cid: number) => setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === cid ? { ...c, items: [...c.items, { id: nextId(), name: "", desc: "", price: "", tags: [] }] } : c) }));
  const setItem = (cid: number, iid: number, k: keyof Item, v: Item[keyof Item]) =>
    setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === cid ? { ...c, items: c.items.map((it) => it.id === iid ? { ...it, [k]: v } : it) } : c) }));
  const delItem = (cid: number, iid: number) => setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === cid ? { ...c, items: c.items.filter((it) => it.id !== iid) } : c) }));
  const toggleTag = (cid: number, iid: number, tag: Tag) => setMenu((p) => ({
    ...p, categories: p.categories.map((c) => c.id === cid ? { ...c, items: c.items.map((it) => it.id === iid ? { ...it, tags: it.tags.includes(tag) ? it.tags.filter((t) => t !== tag) : [...it.tags, tag] } : it) } : c) }),
  );

  const aiDesc = async (cid: number, it: Item) => {
    setAiId(it.id);
    try {
      const r = await fetch("/api/aciklama", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: it.name }) });
      const d = await r.json();
      if (d.desc) setItem(cid, it.id, "desc", d.desc);
    } catch {}
    setAiId(null);
  };

  const copy = () => { navigator.clipboard?.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  const dlQr = () => { const a = document.createElement("a"); a.href = qr; a.download = `${(menu.name || "menu").replace(/\s+/g, "-").toLowerCase()}-qr.png`; a.click(); };

  return (
    <main style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--paper)" }}>
        <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
        <Link href="/" style={{ fontSize: 14, color: "var(--muted)" }}>← Ana sayfa</Link>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 22px 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 30 }} className="build-grid">
        {/* Editör */}
        <div>
          <div className="card" style={{ padding: 20 }}>
            <div className="tag">İşletme</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <label><span>İşletme adı</span><input className="field" style={{ marginTop: 5 }} value={menu.name} onChange={(e) => setField("name", e.target.value)} /></label>
              <label><span>Para birimi</span><select className="field" style={{ marginTop: 5 }} value={menu.currency} onChange={(e) => setField("currency", e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></label>
              <label style={{ gridColumn: "1 / -1" }}><span>Alt başlık</span><input className="field" style={{ marginTop: 5 }} value={menu.subtitle} onChange={(e) => setField("subtitle", e.target.value)} /></label>
            </div>
            <div className="tag" style={{ marginTop: 18 }}>Tema</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {THEMES.map((t) => (
                <button key={t.key} onClick={() => setField("theme", t.key)} style={{
                  padding: "7px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13.5, fontWeight: menu.theme === t.key ? 600 : 400,
                  border: menu.theme === t.key ? "2px solid var(--accent)" : "1.5px solid var(--line)", background: menu.theme === t.key ? "var(--accent-soft)" : "var(--paper)",
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Kategoriler */}
          {menu.categories.map((cat) => (
            <div key={cat.id} className="card" style={{ padding: 18, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <input className="field" style={{ fontWeight: 700, fontSize: 15.5 }} value={cat.name} onChange={(e) => renameCat(cat.id, e.target.value)} />
                <button onClick={() => delCat(cat.id)} title="Kategoriyi sil" style={{ background: "none", border: "1px solid var(--line)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}>🗑</button>
              </div>
              {cat.items.map((it) => (
                <div key={it.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 92px 30px", gap: 8 }}>
                    <input className="field" placeholder="Ürün adı" value={it.name} onChange={(e) => setItem(cat.id, it.id, "name", e.target.value)} />
                    <input className="field" placeholder="Fiyat" value={it.price} onChange={(e) => setItem(cat.id, it.id, "price", e.target.value)} />
                    <button onClick={() => delItem(cat.id, it.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <input className="field" placeholder="Açıklama" value={it.desc} onChange={(e) => setItem(cat.id, it.id, "desc", e.target.value)} />
                    <button onClick={() => aiDesc(cat.id, it)} disabled={aiId === it.id || !it.name} className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5, whiteSpace: "nowrap" }}>{aiId === it.id ? "..." : "✨ Açıklama"}</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {TAGS.map((t) => (
                      <button key={t.key} onClick={() => toggleTag(cat.id, it.id, t.key)} style={{
                        fontSize: 11.5, padding: "3px 9px", borderRadius: 999, cursor: "pointer",
                        border: it.tags.includes(t.key) ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                        background: it.tags.includes(t.key) ? "var(--accent-soft)" : "transparent", color: it.tags.includes(t.key) ? "var(--accent)" : "var(--muted)",
                      }}>{t.emoji} {t.label}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-ghost btn" style={{ padding: "8px 14px", fontSize: 13.5 }} onClick={() => addItem(cat.id)}>+ Ürün ekle</button>
            </div>
          ))}
          <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={addCat}>+ Kategori ekle</button>
        </div>

        {/* Önizleme + QR */}
        <div style={{ position: "sticky", top: 16, alignSelf: "start", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Phone><MenuView menu={menu} /></Phone>
          <div className="card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
            <div className="tag" style={{ justifyContent: "center" }}>Masa QR kodu</div>
            {qr && <img src={qr} alt="QR" style={{ width: 150, height: 150, margin: "12px auto 4px", display: "block" }} />}
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <button className="btn btn-accent" onClick={dlQr}>QR kodu indir</button>
              <button className="btn btn-ghost" onClick={copy}>{copied ? "Kopyalandı ✓" : "Menü bağlantısını kopyala"}</button>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>QR'ı masaya koy; müşteri okutunca menü telefonunda açılır. Fiyat değişince tek yerden güncelle.</p>
          </div>
        </div>
      </div>

      <style>{`@media (max-width:880px){.build-grid{grid-template-columns:1fr !important}}`}</style>
    </main>
  );
}
