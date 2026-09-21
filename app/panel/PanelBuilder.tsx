"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  THEMES, TAGS, CURRENCIES, PRICING, backfillCodes, nextCategoryCode, nextItemCode,
  type MenuData, type Category, type Item, type Tag,
} from "../lib/menu";
import { MenuView, Phone } from "../lib/MenuView";
import { createClient } from "../lib/supabase/client";

type RestaurantInit = {
  id: string; slug: string; name: string; subtitle: string; theme: string; currency: string;
  categories: Category[]; published: boolean;
  plan: string; image_quota: number; image_quota_used: number; qr_token: string;
};
type ParsedCategory = { name: string; items: { name: string; desc?: string; price?: string }[] };
type ImportRow = { include: boolean; catName: string; name: string; desc: string; price: string };
type WaNumber = { id: string; phone: string; role: string; verified: boolean };
type SubscriptionInit = { status: string; current_period_end: string | null; plan_interval: string | null };

const ACTIVE_STATUSES = new Set(["active", "trialing"]);
const BUCKET = "menu-photos";

export function PanelBuilder({ restaurant, subscription, businessNumber }: {
  restaurant: RestaurantInit; subscription: SubscriptionInit; businessNumber: string;
}) {
  const supabase = useRef(createClient()).current;
  const [menu, setMenu] = useState<MenuData>({
    name: restaurant.name, subtitle: restaurant.subtitle, theme: restaurant.theme,
    currency: restaurant.currency, categories: backfillCodes(restaurant.categories),
  });
  const [published, setPublished] = useState(restaurant.published);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrToken, setQrToken] = useState(restaurant.qr_token);
  const [qrBusy, setQrBusy] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[] | null>(null);
  const [aiId, setAiId] = useState<number | null>(null);
  const [imgBusy, setImgBusy] = useState<string | null>(null);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [billingLoading, setBillingLoading] = useState(false);
  const [interval, setInterval_] = useState<"month" | "year">(subscription.plan_interval === "year" ? "year" : "month");
  const [quotaUsed, setQuotaUsed] = useState(restaurant.image_quota_used);
  const [waNumbers, setWaNumbers] = useState<WaNumber[]>([]);
  const [waInput, setWaInput] = useState("");
  const [waRole, setWaRole] = useState("Patron");
  const [waPendingCode, setWaPendingCode] = useState<{ phone: string; code: string } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canPublish = ACTIVE_STATUSES.has(subscription.status);
  const isPro = subscription.status === "active";
  const quota = restaurant.image_quota;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/m/${restaurant.slug}` : `https://siriusmenu.com/m/${restaurant.slug}`;
  const qrUrl = qrToken ? `${shareUrl}?k=${qrToken}` : shareUrl;

  useEffect(() => {
    fetch("/api/whatsapp/verify").then((r) => r.json()).then((d) => setWaNumbers(d.numbers ?? [])).catch(() => {});
  }, []);

  useEffect(() => { QRCode.toDataURL(qrUrl, { margin: 1, width: 320, color: { dark: "#1c1a17", light: "#ffffff" } }).then(setQr).catch(() => {}); }, [qrUrl]);

  useEffect(() => {
    setSaving("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase.from("restaurants").update({
        name: menu.name, subtitle: menu.subtitle, theme: menu.theme, currency: menu.currency, menu: menu.categories,
      }).eq("id", restaurant.id);
      setSaving("saved");
    }, 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  const setField = (k: keyof MenuData, v: string) => setMenu((p) => ({ ...p, [k]: v }));
  const nextId = () => Math.floor(Math.random() * 1e9);

  const addCat = () => setMenu((p) => ({ ...p, categories: [...p.categories, { id: nextId(), name: "Yeni kategori", code: nextCategoryCode(p.categories), items: [] }] }));
  const renameCat = (id: number, name: string) => setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === id ? { ...c, name } : c) }));
  const delCat = (id: number) => setMenu((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== id) }));
  const addItem = (cid: number) => setMenu((p) => ({ ...p, categories: p.categories.map((c) => c.id === cid ? { ...c, items: [...c.items, { id: nextId(), name: "", desc: "", price: "", tags: [], available: true, code: nextItemCode(c) }] } : c) }));
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

  // === Görsel yükleme + iyileştirme ===
  const uploadImage = async (cid: number, it: Item, file: File) => {
    const key = `${cid}:${it.id}`;
    setImgBusy(key);
    try {
      const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
      const path = `${restaurant.id}/${key}/original.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setItem(cid, it.id, "image", `${pub.publicUrl}?v=${Date.now()}`);
    } catch {
      alert("Yükleme başarısız oldu.");
    }
    setImgBusy(null);
  };

  const enhanceImage = async (cid: number, it: Item) => {
    const key = `${cid}:${it.id}`;
    setImgBusy(key);
    try {
      // Orijinal yolu görselin URL'inden türet
      const url = new URL(it.image!.split("?")[0]);
      const marker = `/${BUCKET}/`;
      const originalPath = url.pathname.slice(url.pathname.indexOf(marker) + marker.length);
      const r = await fetch("/api/images/enhance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey: key, originalPath }),
      });
      const d = await r.json();
      if (r.ok && d.url) {
        setItem(cid, it.id, "image", d.url);
        setQuotaUsed(d.used);
      } else if (r.status === 402) {
        alert(d.message || "Görsel kotan doldu.");
      } else {
        alert(d.error || "İyileştirme başarısız.");
      }
    } catch {
      alert("İyileştirme başarısız.");
    }
    setImgBusy(null);
  };

  const copy = () => { navigator.clipboard?.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  const dlQr = () => { const a = document.createElement("a"); a.href = qr; a.download = `${(menu.name || "menu").replace(/\s+/g, "-").toLowerCase()}-qr.png`; a.click(); };

  const rotateQr = async () => {
    if (!confirm("Yeni QR oluşturulacak. Eski basılı QR kodları artık menüyü açmayacak. Devam edilsin mi?")) return;
    setQrBusy(true);
    try {
      const r = await fetch("/api/qr/rotate", { method: "POST" });
      const d = await r.json();
      if (r.ok && d.qr_token) setQrToken(d.qr_token);
      else alert(d.error || "QR yenilenemedi.");
    } catch {
      alert("QR yenilenemedi.");
    }
    setQrBusy(false);
  };

  // === Fotoğraftan menü içe aktarma ===
  const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const importPhoto = async (file: File) => {
    setImportBusy(true);
    try {
      const image = await fileToBase64(file);
      const r = await fetch("/api/menu/import-photo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mimeType: file.type || "image/jpeg" }),
      });
      const d = await r.json();
      if (!r.ok) { alert(d.error || "Fotoğraf okunamadı."); setImportBusy(false); return; }
      const cats = (d.categories || []) as ParsedCategory[];
      const rows: ImportRow[] = cats.flatMap((c) =>
        c.items.map((it) => ({ include: true, catName: c.name || "Genel", name: it.name || "", desc: it.desc || "", price: (it.price || "").replace(",", ".") })),
      );
      if (rows.length === 0) alert("Fotoğrafta okunabilir bir menü bulunamadı.");
      else setImportRows(rows);
    } catch {
      alert("Fotoğraf okunamadı.");
    }
    setImportBusy(false);
  };

  const setImportRow = (i: number, k: keyof ImportRow, v: string | boolean) =>
    setImportRows((prev) => prev ? prev.map((row, idx) => idx === i ? { ...row, [k]: v } : row) : prev);

  const confirmImport = () => {
    if (!importRows) return;
    setMenu((p) => {
      const categories = p.categories.map((c) => ({ ...c, items: [...c.items] }));
      for (const row of importRows) {
        if (!row.include || !row.name.trim()) continue;
        let cat = categories.find((c) => c.name.trim().toLowerCase() === row.catName.trim().toLowerCase());
        if (!cat) {
          cat = { id: nextId(), name: row.catName || "Genel", code: nextCategoryCode(categories), items: [] };
          categories.push(cat);
        }
        cat.items.push({ id: nextId(), name: row.name, desc: row.desc, price: row.price, tags: [], available: true, code: nextItemCode(cat) });
      }
      return { ...p, categories };
    });
    setImportRows(null);
  };

  const togglePublish = async () => {
    if (!canPublish) return;
    const next = !published;
    setPublished(next);
    await supabase.from("restaurants").update({ published: next }).eq("id", restaurant.id);
  };

  const goCheckout = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ interval }) });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
  };
  const goPortal = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/portal", { method: "POST" });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
  };
  const buyImagePack = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: "image_pack" }) });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
  };

  // === WhatsApp yetkili numaralar (whitelist) ===
  const refreshWa = async () => {
    const r = await fetch("/api/whatsapp/verify");
    const d = await r.json();
    setWaNumbers(d.numbers ?? []);
  };
  const addWaNumber = async () => {
    const r = await fetch("/api/whatsapp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ number: waInput, role: waRole }) });
    const d = await r.json();
    if (r.ok) {
      setWaPendingCode({ phone: d.phone, code: d.code });
      setWaInput("");
      await refreshWa();
    } else alert(d.error || "Eklenemedi.");
  };
  const removeWaNumber = async (id: string) => {
    await fetch("/api/whatsapp/verify", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setWaNumbers((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 22px 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 30 }} className="build-grid">
        {/* Editör */}
        <div>
          <div className="card" style={{ padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="tag">Abonelik</div>
              <div style={{ marginTop: 4, fontSize: 14 }}>
                {subscription.status === "active" && `Aktif — ${subscription.plan_interval === "year" ? "yıllık" : "aylık"} plan`}
                {subscription.status === "trialing" && "Deneme sürümü — yayınlamak için plana geç"}
                {(subscription.status === "past_due" || subscription.status === "canceled" || subscription.status === "unpaid") && "Abonelik pasif"}
              </div>
            </div>
            {isPro ? (
              <button className="btn-ghost btn" style={{ padding: "8px 14px", fontSize: 13.5 }} disabled={billingLoading} onClick={goPortal}>Aboneliği yönet</button>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", border: "1.5px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
                  {(["month", "year"] as const).map((iv) => (
                    <button key={iv} onClick={() => setInterval_(iv)} style={{
                      padding: "7px 14px", fontSize: 13, cursor: "pointer", border: "none",
                      background: interval === iv ? "var(--accent)" : "transparent", color: interval === iv ? "#fff" : "var(--muted)", fontWeight: 600,
                    }}>{iv === "month" ? `Aylık ${PRICING.monthly.amount}₺` : `Yıllık ${PRICING.yearly.amount}₺`}</button>
                  ))}
                </div>
                <button className="btn btn-accent" style={{ padding: "8px 14px", fontSize: 13.5 }} disabled={billingLoading} onClick={goCheckout}>Plana geç</button>
              </div>
            )}
          </div>

          {/* Görsel kotası */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">Görsel iyileştirme</div>
            <div style={{ marginTop: 8, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span>Bu dönem <b>{quotaUsed}</b> / {quota} görsel iyileştirme kullanıldı</span>
              <button className="btn-ghost btn" style={{ padding: "7px 12px", fontSize: 12.5 }} disabled={billingLoading} onClick={buyImagePack}>
                +{PRICING.imagePack.credits} paket ({PRICING.imagePack.amount}₺)
              </button>
            </div>
            <div style={{ marginTop: 8, height: 6, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${quota ? Math.min(100, (quotaUsed / quota) * 100) : 0}%`, background: "var(--accent)" }} />
            </div>
          </div>

          {/* WhatsApp yetkili numaralar (whitelist) */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">WhatsApp ile güncelle</div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              Sadece aşağıdaki yetkili numaralardan gelen mesajlar işlenir; tanımsız numaralar otomatik reddedilir.
            </p>

            {waNumbers.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {waNumbers.map((n) => (
                  <div key={n.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: "1px solid var(--line)", borderRadius: 10, padding: "8px 12px" }}>
                    <div style={{ fontSize: 13.5 }}>
                      <b>{n.phone}</b> <span style={{ color: "var(--muted)" }}>· {n.role}</span>
                      {n.verified
                        ? <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>✓ Doğrulandı</span>
                        : <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>Kod bekleniyor</span>}
                    </div>
                    <button onClick={() => removeWaNumber(n.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>kaldır</button>
                  </div>
                ))}
              </div>
            )}

            {waPendingCode && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <p style={{ color: "var(--muted)" }}>
                  <b>{waPendingCode.phone}</b>&apos;dan <b>{businessNumber || "işletme numaramıza"}</b> WhatsApp&apos;tan şu kodu yaz:
                </p>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.2em", margin: "8px 0", fontFamily: "var(--font-display)" }}>{waPendingCode.code}</div>
                <p style={{ color: "var(--muted)", fontSize: 12.5 }}>Onaylanınca yukarıdaki listede &quot;Doğrulandı&quot; görünür.</p>
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input className="field" style={{ maxWidth: 200 }} placeholder="+90 5xx xxx xx xx" value={waInput} onChange={(e) => setWaInput(e.target.value)} />
              <select className="field" style={{ maxWidth: 130 }} value={waRole} onChange={(e) => setWaRole(e.target.value)}>
                <option>Patron</option>
                <option>Müdür</option>
                <option>Yetkili</option>
              </select>
              <button className="btn btn-accent" style={{ padding: "8px 14px", fontSize: 13.5 }} onClick={addWaNumber} disabled={!waInput}>Numara ekle</button>
            </div>
          </div>

          {/* Fotoğraftan menü içe aktarma */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">Fotoğraftan menü yükle</div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              Elinizdeki kağıt menü, el yazması not ya da eski katalog/broşür fotoğrafını yükleyin; yapay zeka ürün adı, açıklama ve fiyatları okuyup listeler, eklemeden önce düzenleyebilirsiniz.
            </p>
            <label className="btn btn-accent" style={{ marginTop: 12, display: "inline-flex", padding: "8px 14px", fontSize: 13.5, cursor: "pointer" }}>
              {importBusy ? "Okunuyor…" : "Fotoğraf seç"}
              <input type="file" accept="image/*" hidden disabled={importBusy} onChange={(e) => { const f = e.target.files?.[0]; if (f) importPhoto(f); e.target.value = ""; }} />
            </label>
          </div>

          {importRows && (
            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              <div className="tag">Okunanları gözden geçir</div>
              <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>İstemediklerini kaldır, gerekiyorsa düzelt, sonra menüye ekle.</p>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {importRows.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 90px", gap: 6, alignItems: "center", opacity: row.include ? 1 : 0.45 }}>
                    <input type="checkbox" checked={row.include} onChange={(e) => setImportRow(i, "include", e.target.checked)} />
                    <input className="field" placeholder="Ürün adı" value={row.name} onChange={(e) => setImportRow(i, "name", e.target.value)} />
                    <input className="field" placeholder="Kategori" value={row.catName} onChange={(e) => setImportRow(i, "catName", e.target.value)} />
                    <input className="field" placeholder="Fiyat" value={row.price} onChange={(e) => setImportRow(i, "price", e.target.value)} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn btn-accent" onClick={confirmImport}>Menüye ekle ({importRows.filter((r) => r.include).length})</button>
                <button className="btn-ghost btn" onClick={() => setImportRows(null)}>Vazgeç</button>
              </div>
            </div>
          )}

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
                <span title="Kategori kodu" style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 8px", flexShrink: 0 }}>{cat.code}</span>
                <input className="field" style={{ fontWeight: 700, fontSize: 15.5 }} value={cat.name} onChange={(e) => renameCat(cat.id, e.target.value)} />
                <button onClick={() => delCat(cat.id)} title="Kategoriyi sil" style={{ background: "none", border: "1px solid var(--line)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}>🗑</button>
              </div>
              {cat.items.map((it) => {
                const key = `${cat.id}:${it.id}`;
                const busy = imgBusy === key;
                return (
                <div key={it.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "58px 1fr 92px 30px", gap: 8 }}>
                    <span title="Ürün kodu" style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8 }}>{it.code}</span>
                    <input className="field" placeholder="Ürün adı" value={it.name} onChange={(e) => setItem(cat.id, it.id, "name", e.target.value)} />
                    <input className="field" placeholder="Fiyat" value={it.price} onChange={(e) => setItem(cat.id, it.id, "price", e.target.value)} />
                    <button onClick={() => delItem(cat.id, it.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <input className="field" placeholder="Açıklama" value={it.desc} onChange={(e) => setItem(cat.id, it.id, "desc", e.target.value)} />
                    <button onClick={() => aiDesc(cat.id, it)} disabled={aiId === it.id || !it.name} className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5, whiteSpace: "nowrap" }}>{aiId === it.id ? "..." : "✨ Açıklama"}</button>
                  </div>

                  {/* Görsel satırı */}
                  <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt="" style={{ width: 54, height: 54, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line)" }} />
                    ) : (
                      <div style={{ width: 54, height: 54, borderRadius: 8, border: "1px dashed var(--line)", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 18 }}>🍽</div>
                    )}
                    <label className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5, cursor: "pointer" }}>
                      {busy ? "..." : it.image ? "Değiştir" : "Fotoğraf yükle"}
                      <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(cat.id, it, f); e.target.value = ""; }} />
                    </label>
                    {it.image && (
                      <button onClick={() => enhanceImage(cat.id, it)} disabled={busy} className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5 }}>
                        {busy ? "İyileştiriliyor..." : "✨ İyileştir"}
                      </button>
                    )}
                    {it.image && (
                      <button onClick={() => setItem(cat.id, it.id, "image", "")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>kaldır</button>
                    )}
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--muted)", cursor: "pointer" }}>
                      <input type="checkbox" checked={it.available === false} onChange={(e) => setItem(cat.id, it.id, "available", !e.target.checked)} />
                      Tükendi
                    </label>
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
                );
              })}
              <button className="btn-ghost btn" style={{ padding: "8px 14px", fontSize: 13.5 }} onClick={() => addItem(cat.id)}>+ Ürün ekle</button>
            </div>
          ))}
          <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={addCat}>+ Kategori ekle</button>
        </div>

        {/* Önizleme + QR + Yayın */}
        <div style={{ position: "sticky", top: 16, alignSelf: "start", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Phone><MenuView menu={menu} /></Phone>

          <div className="card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
            <div className="tag" style={{ justifyContent: "center" }}>Yayın durumu</div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
              {saving === "saving" ? "Kaydediliyor…" : "Tüm değişiklikler otomatik kaydedilir."}
            </p>
            <button
              className={published ? "btn btn-accent" : "btn btn-ghost"}
              style={{ marginTop: 10, width: "100%" }}
              disabled={!canPublish}
              onClick={togglePublish}
              title={!canPublish ? "Yayınlamak için plana geç" : undefined}
            >
              {published ? "Yayında ✓" : canPublish ? "Menüyü yayına al" : "Yayınlamak için plana geç"}
            </button>
          </div>

          <div className="card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
            <div className="tag" style={{ justifyContent: "center" }}>Masa QR kodu</div>
            {qr && <img src={qr} alt="QR" style={{ width: 150, height: 150, margin: "12px auto 4px", display: "block" }} />}
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <button className="btn btn-accent" onClick={dlQr}>QR kodu indir</button>
              <button className="btn btn-ghost" onClick={copy}>{copied ? "Kopyalandı ✓" : "Menü bağlantısını kopyala"}</button>
              <button className="btn-ghost btn" style={{ fontSize: 12.5 }} disabled={qrBusy} onClick={rotateQr}>{qrBusy ? "Yenileniyor…" : "QR'ı yenile"}</button>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>QR&apos;ı masaya koy; müşteri okutunca menü telefonunda açılır. Fiyat değişince tek yerden güncelle. QR&apos;ı yenilersen eski basılı QR kodları çalışmaz olur, menü bağlantısı (kopyala) ise değişmez.</p>
          </div>
        </div>
      </div>

      <style>{`@media (max-width:880px){.build-grid{grid-template-columns:1fr !important}}`}</style>
    </main>
  );
}
