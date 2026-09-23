"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useTranslations } from "next-intl";
import {
  THEMES, TAGS, CURRENCIES, PRICING, SOCIAL_PLATFORMS, backfillCodes, nextCategoryCode, nextItemCode,
  type MenuData, type Category, type Item, type Tag, type SocialLinks,
} from "@/app/lib/menu";
import { DEMOS, type Demo } from "@/app/lib/demos";
import { MenuView, Phone } from "@/app/lib/MenuView";
import { createClient } from "@/app/lib/supabase/client";

type RestaurantInit = {
  id: string; slug: string; name: string; subtitle: string; theme: string; currency: string;
  categories: Category[]; published: boolean;
  plan: string; image_quota: number; image_quota_used: number; qr_token: string;
  logo_url: string; social: SocialLinks;
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
  const t = useTranslations("Panel.builder");
  const tAccount = useTranslations("Panel.account");
  const tThemes = useTranslations("Themes");
  const supabase = useRef(createClient()).current;
  const [menu, setMenu] = useState<MenuData>({
    name: restaurant.name, subtitle: restaurant.subtitle, theme: restaurant.theme,
    currency: restaurant.currency, categories: backfillCodes(restaurant.categories),
    logo: restaurant.logo_url || undefined, social: restaurant.social || {},
  });
  const [socialOpen, setSocialOpen] = useState<Set<keyof SocialLinks>>(
    new Set((Object.keys(restaurant.social || {}) as (keyof SocialLinks)[]).filter((k) => restaurant.social?.[k])),
  );
  const [logoBusy, setLogoBusy] = useState(false);
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
  const [previewDemo, setPreviewDemo] = useState<Demo | null>(null);
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
        logo_url: menu.logo || null, social: menu.social || {},
      }).eq("id", restaurant.id);
      setSaving("saved");
    }, 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  const setField = (k: keyof MenuData, v: string) => setMenu((p) => ({ ...p, [k]: v }));
  const setSocial = (key: keyof SocialLinks, v: string) => setMenu((p) => ({ ...p, social: { ...p.social, [key]: v } }));
  const toggleSocial = (key: keyof SocialLinks) => {
    setSocialOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setMenu((p) => ({ ...p, social: { ...p.social, [key]: undefined } }));
      } else {
        next.add(key);
      }
      return next;
    });
  };
  const nextId = () => Math.floor(Math.random() * 1e9);

  const addCat = () => setMenu((p) => ({ ...p, categories: [...p.categories, { id: nextId(), name: t("newCategory"), code: nextCategoryCode(p.categories), items: [] }] }));
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
      alert(t("errUploadFailed"));
    }
    setImgBusy(null);
  };

  // === İşletme logosu (isteğe bağlı) ===
  const uploadLogo = async (file: File) => {
    setLogoBusy(true);
    try {
      const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
      const path = `${restaurant.id}/logo/original.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setField("logo", `${pub.publicUrl}?v=${Date.now()}`);
    } catch {
      alert(t("errLogoFailed"));
    }
    setLogoBusy(false);
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
        alert(d.message || t("errQuotaFull"));
      } else {
        alert(d.error || t("errEnhanceFailed"));
      }
    } catch {
      alert(t("errEnhanceFailed"));
    }
    setImgBusy(null);
  };

  const copy = () => { navigator.clipboard?.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  const dlQr = () => { const a = document.createElement("a"); a.href = qr; a.download = `${(menu.name || "menu").replace(/\s+/g, "-").toLowerCase()}-qr.png`; a.click(); };

  const rotateQr = async () => {
    if (!confirm(t("confirmRotateQr"))) return;
    setQrBusy(true);
    try {
      const r = await fetch("/api/qr/rotate", { method: "POST" });
      const d = await r.json();
      if (r.ok && d.qr_token) setQrToken(d.qr_token);
      else alert(d.error || t("errQrFailed"));
    } catch {
      alert(t("errQrFailed"));
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
      if (!r.ok) { alert(d.error || t("errPhotoUnreadable")); setImportBusy(false); return; }
      const cats = (d.categories || []) as ParsedCategory[];
      const rows: ImportRow[] = cats.flatMap((c) =>
        c.items.map((it) => ({ include: true, catName: c.name || "Genel", name: it.name || "", desc: it.desc || "", price: (it.price || "").replace(",", ".") })),
      );
      if (rows.length === 0) alert(t("errPhotoNoItems"));
      else setImportRows(rows);
    } catch {
      alert(t("errPhotoUnreadable"));
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
    else alert(d.error || t("errCheckoutFailed"));
  };
  const goPortal = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/portal", { method: "POST" });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
    else alert(d.error || t("errPortalFailed"));
  };
  const buyImagePack = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: "image_pack" }) });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
    else alert(d.error || t("errCheckoutFailed"));
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
    } else alert(d.error || t("errAddNumberFailed"));
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
              <div className="tag">{t("subscription")}</div>
              <div style={{ marginTop: 4, fontSize: 14 }}>
                {subscription.status === "active" && t("activePlan", { interval: subscription.plan_interval === "year" ? tAccount("intervalYear") : tAccount("intervalMonth") })}
                {subscription.status === "trialing" && t("trialManage")}
                {(subscription.status === "past_due" || subscription.status === "canceled" || subscription.status === "unpaid") && t("inactive")}
              </div>
            </div>
            {isPro ? (
              <button className="btn-ghost btn" style={{ padding: "8px 14px", fontSize: 13.5 }} disabled={billingLoading} onClick={goPortal}>{t("manageSubscription")}</button>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", border: "1.5px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
                  {(["month", "year"] as const).map((iv) => (
                    <button key={iv} onClick={() => setInterval_(iv)} style={{
                      padding: "7px 14px", fontSize: 13, cursor: "pointer", border: "none",
                      background: interval === iv ? "var(--accent)" : "transparent", color: interval === iv ? "#fff" : "var(--muted)", fontWeight: 600,
                    }}>{iv === "month" ? t("monthlyOption", { amount: PRICING.monthly.amount }) : t("yearlyOption", { amount: PRICING.yearly.amount })}</button>
                  ))}
                </div>
                <button className="btn btn-accent" style={{ padding: "8px 14px", fontSize: 13.5 }} disabled={billingLoading} onClick={goCheckout}>{t("upgrade")}</button>
              </div>
            )}
          </div>

          {/* Görsel kotası */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">{t("imageEnhancement")}</div>
            <div style={{ marginTop: 8, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span>{t.rich("quotaUsed", { used: quotaUsed, quota, b: (chunks) => <b>{chunks}</b> })}</span>
              <button className="btn-ghost btn" style={{ padding: "7px 12px", fontSize: 12.5 }} disabled={billingLoading} onClick={buyImagePack}>
                {t("buyPack", { credits: PRICING.imagePack.credits, amount: PRICING.imagePack.amount })}
              </button>
            </div>
            <div style={{ marginTop: 8, height: 6, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${quota ? Math.min(100, (quotaUsed / quota) * 100) : 0}%`, background: "var(--accent)" }} />
            </div>
            <a href="/panel/studio" style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, color: "var(--accent)" }}>
              {t("openStudio")}
            </a>
          </div>

          {/* WhatsApp yetkili numaralar (whitelist) */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">{t("whatsappUpdate")}</div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              {t("whatsappDesc")}
            </p>

            {waNumbers.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {waNumbers.map((n) => (
                  <div key={n.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: "1px solid var(--line)", borderRadius: 10, padding: "8px 12px" }}>
                    <div style={{ fontSize: 13.5 }}>
                      <b>{n.phone}</b> <span style={{ color: "var(--muted)" }}>· {n.role}</span>
                      {n.verified
                        ? <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>{t("verified")}</span>
                        : <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{t("codePending")}</span>}
                    </div>
                    <button onClick={() => removeWaNumber(n.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>{t("remove")}</button>
                  </div>
                ))}
              </div>
            )}

            {waPendingCode && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <p style={{ color: "var(--muted)" }}>
                  {t.rich("waCodeInstruction", { phone: waPendingCode.phone, businessNumber: businessNumber || t("businessNumberFallback"), b: (chunks) => <b>{chunks}</b> })}
                </p>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.2em", margin: "8px 0", fontFamily: "var(--font-display)" }}>{waPendingCode.code}</div>
                <p style={{ color: "var(--muted)", fontSize: 12.5 }}>{t("waCodeConfirm")}</p>
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input className="field" style={{ maxWidth: 200 }} placeholder={t("phonePlaceholder")} value={waInput} onChange={(e) => setWaInput(e.target.value)} />
              <select className="field" style={{ maxWidth: 130 }} value={waRole} onChange={(e) => setWaRole(e.target.value)}>
                <option>{t("roleOwner")}</option>
                <option>{t("roleManager")}</option>
                <option>{t("roleAuthorized")}</option>
              </select>
              <button className="btn btn-accent" style={{ padding: "8px 14px", fontSize: 13.5 }} onClick={addWaNumber} disabled={!waInput}>{t("addNumber")}</button>
            </div>
          </div>

          {/* Fotoğraftan menü içe aktarma */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">{t("importPhoto")}</div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              {t("importPhotoDesc")}
            </p>
            <label className="btn btn-accent" style={{ marginTop: 12, display: "inline-flex", padding: "8px 14px", fontSize: 13.5, cursor: "pointer" }}>
              {importBusy ? t("reading") : t("choosePhoto")}
              <input type="file" accept="image/*" hidden disabled={importBusy} onChange={(e) => { const f = e.target.files?.[0]; if (f) importPhoto(f); e.target.value = ""; }} />
            </label>
          </div>

          {importRows && (
            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              <div className="tag">{t("reviewImport")}</div>
              <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>{t("reviewImportDesc")}</p>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {importRows.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 90px", gap: 6, alignItems: "center", opacity: row.include ? 1 : 0.45 }}>
                    <input type="checkbox" checked={row.include} onChange={(e) => setImportRow(i, "include", e.target.checked)} />
                    <input className="field" placeholder={t("productName")} value={row.name} onChange={(e) => setImportRow(i, "name", e.target.value)} />
                    <input className="field" placeholder={t("category")} value={row.catName} onChange={(e) => setImportRow(i, "catName", e.target.value)} />
                    <input className="field" placeholder={t("price")} value={row.price} onChange={(e) => setImportRow(i, "price", e.target.value)} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn btn-accent" onClick={confirmImport}>{t("addToMenu", { count: importRows.filter((r) => r.include).length })}</button>
                <button className="btn-ghost btn" onClick={() => setImportRows(null)}>{t("cancel")}</button>
              </div>
            </div>
          )}

          {/* Örnek menüler ve temalar */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="tag">{t("demoMenus")}</div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              {t("demoMenusDesc")}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {DEMOS.map((d) => (
                <div key={d.slug} style={{
                  display: "flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "3px 3px 3px 14px",
                  border: previewDemo?.slug === d.slug ? "1.5px solid var(--accent)" : "1.5px solid var(--line)",
                  background: previewDemo?.slug === d.slug ? "var(--accent-soft)" : "var(--paper)",
                }}>
                  <button onClick={() => setPreviewDemo(d)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 13,
                    fontWeight: previewDemo?.slug === d.slug ? 600 : 400, color: "inherit",
                  }}>{d.tag} · {tThemes(d.menu.theme)}</button>
                  <button
                    onClick={() => { setField("theme", d.menu.theme); setPreviewDemo(null); }}
                    title={t("useThemeTitle")}
                    className="btn-ghost btn"
                    style={{ padding: "6px 10px", fontSize: 11.5 }}
                  >{t("useTheme")}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="tag">{t("business")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <label><span>{t("businessName")}</span><input className="field" style={{ marginTop: 5 }} value={menu.name} onChange={(e) => setField("name", e.target.value)} /></label>
              <label><span>{t("currency")}</span><select className="field" style={{ marginTop: 5 }} value={menu.currency} onChange={(e) => setField("currency", e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></label>
              <label style={{ gridColumn: "1 / -1" }}><span>{t("subtitle")}</span><input className="field" style={{ marginTop: 5 }} value={menu.subtitle} onChange={(e) => setField("subtitle", e.target.value)} /></label>
            </div>
            <div className="tag" style={{ marginTop: 18 }}>{t("theme")}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {THEMES.map((th) => (
                <button key={th.key} onClick={() => { setField("theme", th.key); setPreviewDemo(null); }} style={{
                  padding: "7px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13.5, fontWeight: menu.theme === th.key ? 600 : 400,
                  border: menu.theme === th.key ? "2px solid var(--accent)" : "1.5px solid var(--line)", background: menu.theme === th.key ? "var(--accent-soft)" : "var(--paper)",
                }}>{tThemes(th.key)}</button>
              ))}
            </div>

            <div className="tag" style={{ marginTop: 18 }}>{t("logo")}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
              {menu.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={menu.logo} alt="" style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", border: "1px solid var(--line)" }} />
              ) : (
                <div style={{ width: 54, height: 54, borderRadius: 10, border: "1px dashed var(--line)", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 18 }}>🏷</div>
              )}
              <label className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5, cursor: "pointer" }}>
                {logoBusy ? "..." : menu.logo ? t("change") : t("uploadLogo")}
                <input type="file" accept="image/*" hidden disabled={logoBusy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); e.target.value = ""; }} />
              </label>
              {menu.logo && (
                <button onClick={() => setField("logo", "")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>{t("remove")}</button>
              )}
            </div>

            <div className="tag" style={{ marginTop: 18 }}>{t("social")}</div>
            <p style={{ marginTop: 4, fontSize: 12.5, color: "var(--muted)" }}>{t("socialDesc")}</p>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {SOCIAL_PLATFORMS.map((p) => (
                <div key={p.key}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, cursor: "pointer" }}>
                    <input type="checkbox" checked={socialOpen.has(p.key)} onChange={() => toggleSocial(p.key)} />
                    {p.label}
                  </label>
                  {socialOpen.has(p.key) && (
                    <input
                      className="field" style={{ marginTop: 5 }} placeholder={p.placeholder}
                      value={menu.social?.[p.key] || ""} onChange={(e) => setSocial(p.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Kategoriler */}
          {menu.categories.map((cat) => (
            <div key={cat.id} className="card" style={{ padding: 18, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span title={t("categoryCodeTitle")} style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 8px", flexShrink: 0 }}>{cat.code}</span>
                <input className="field" style={{ fontWeight: 700, fontSize: 15.5 }} value={cat.name} onChange={(e) => renameCat(cat.id, e.target.value)} />
                <button onClick={() => delCat(cat.id)} title={t("deleteCategoryTitle")} style={{ background: "none", border: "1px solid var(--line)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}>🗑</button>
              </div>
              {cat.items.map((it) => {
                const key = `${cat.id}:${it.id}`;
                const busy = imgBusy === key;
                return (
                <div key={it.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "58px 1fr 92px 30px", gap: 8 }}>
                    <span title={t("itemCodeTitle")} style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8 }}>{it.code}</span>
                    <input className="field" placeholder={t("productName")} value={it.name} onChange={(e) => setItem(cat.id, it.id, "name", e.target.value)} />
                    <input className="field" placeholder={t("price")} value={it.price} onChange={(e) => setItem(cat.id, it.id, "price", e.target.value)} />
                    <button onClick={() => delItem(cat.id, it.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <input className="field" placeholder={t("description")} value={it.desc} onChange={(e) => setItem(cat.id, it.id, "desc", e.target.value)} />
                    <button onClick={() => aiDesc(cat.id, it)} disabled={aiId === it.id || !it.name} className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5, whiteSpace: "nowrap" }}>{aiId === it.id ? "..." : t("aiDescription")}</button>
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
                      {busy ? "..." : it.image ? t("change") : t("uploadPhoto")}
                      <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(cat.id, it, f); e.target.value = ""; }} />
                    </label>
                    {it.image && (
                      <button onClick={() => enhanceImage(cat.id, it)} disabled={busy} className="btn-ghost btn" style={{ padding: "8px 12px", fontSize: 12.5 }}>
                        {busy ? t("enhancing") : t("enhance")}
                      </button>
                    )}
                    {it.image && (
                      <button onClick={() => setItem(cat.id, it.id, "image", "")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>{t("remove")}</button>
                    )}
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--muted)", cursor: "pointer" }}>
                      <input type="checkbox" checked={it.available === false} onChange={(e) => setItem(cat.id, it.id, "available", !e.target.checked)} />
                      {t("soldOut")}
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {TAGS.map((tg) => (
                      <button key={tg.key} onClick={() => toggleTag(cat.id, it.id, tg.key)} style={{
                        fontSize: 11.5, padding: "3px 9px", borderRadius: 999, cursor: "pointer",
                        border: it.tags.includes(tg.key) ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                        background: it.tags.includes(tg.key) ? "var(--accent-soft)" : "transparent", color: it.tags.includes(tg.key) ? "var(--accent)" : "var(--muted)",
                      }}>{tg.emoji} {tg.label}</button>
                    ))}
                  </div>
                </div>
                );
              })}
              <button className="btn-ghost btn" style={{ padding: "8px 14px", fontSize: 13.5 }} onClick={() => addItem(cat.id)}>{t("addItem")}</button>
            </div>
          ))}
          <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={addCat}>{t("addCategory")}</button>
        </div>

        {/* Önizleme + QR + Yayın */}
        <div style={{ position: "sticky", top: 16, alignSelf: "start", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {previewDemo && (
            <div className="card" style={{ padding: "10px 14px", width: "100%", textAlign: "center", fontSize: 12.5 }}>
              {t.rich("demoPreview", { name: previewDemo.menu.name, b: (chunks) => <b>{chunks}</b> })}
              <button onClick={() => setPreviewDemo(null)} style={{ marginLeft: 10, background: "none", border: "none", color: "var(--accent)", cursor: "pointer", textDecoration: "underline", fontSize: 12.5 }}>
                {t("backToOwnMenu")}
              </button>
            </div>
          )}
          <Phone><MenuView menu={previewDemo ? previewDemo.menu : menu} /></Phone>

          <div className="card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
            <div className="tag" style={{ justifyContent: "center" }}>{t("publishStatus")}</div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
              {saving === "saving" ? t("saving") : t("autoSaved")}
            </p>
            <button
              className={published ? "btn btn-accent" : "btn btn-ghost"}
              style={{ marginTop: 10, width: "100%" }}
              disabled={!canPublish}
              onClick={togglePublish}
              title={!canPublish ? t("upgradeToPublish") : undefined}
            >
              {published ? t("published") : canPublish ? t("publish") : t("upgradeToPublish")}
            </button>
          </div>

          <div className="card" style={{ padding: 16, width: "100%", textAlign: "center" }}>
            <div className="tag" style={{ justifyContent: "center" }}>{t("tableQr")}</div>
            {qr && <img src={qr} alt="QR" style={{ width: 150, height: 150, margin: "12px auto 4px", display: "block" }} />}
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <button className="btn btn-accent" onClick={dlQr}>{t("downloadQr")}</button>
              <button className="btn btn-ghost" onClick={copy}>{copied ? t("copied") : t("copyLink")}</button>
              <button className="btn-ghost btn" style={{ fontSize: 12.5 }} disabled={qrBusy} onClick={rotateQr}>{qrBusy ? t("rotating") : t("rotateQr")}</button>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>{t("qrFooterNote")}</p>
          </div>
        </div>
      </div>

      <style>{`@media (max-width:880px){.build-grid{grid-template-columns:1fr !important}}`}</style>
    </main>
  );
}
