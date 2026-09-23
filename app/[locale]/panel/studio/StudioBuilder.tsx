"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PRICING, type Category, type Item } from "@/app/lib/menu";
import { createClient } from "@/app/lib/supabase/client";

const BUCKET = "menu-photos";

export function StudioBuilder({ restaurantId, initialCategories, imageQuota, imageQuotaUsed }: {
  restaurantId: string; initialCategories: Category[]; imageQuota: number; imageQuotaUsed: number;
}) {
  const t = useTranslations("Panel.studio");
  const tNav = useTranslations("Panel.nav");
  const supabase = useRef(createClient()).current;
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [quotaUsed, setQuotaUsed] = useState(imageQuotaUsed);
  const [billingLoading, setBillingLoading] = useState(false);
  const [prompts, setPrompts] = useState<Record<string, string>>({});

  const items = categories.flatMap((c) => c.items.map((it) => ({ cat: c, item: it })));

  const persist = async (next: Category[]) => {
    setCategories(next);
    await supabase.from("restaurants").update({ menu: next }).eq("id", restaurantId);
  };

  const setItemImage = (cid: number, iid: number, image: string) =>
    categories.map((c) => c.id === cid ? { ...c, items: c.items.map((it) => it.id === iid ? { ...it, image } : it) } : c);

  const uploadOwnPhoto = async (cat: Category, it: Item, file: File) => {
    const key = `${cat.id}:${it.id}`;
    setBusyKey(key);
    try {
      const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
      const path = `${restaurantId}/${key}/original.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      await persist(setItemImage(cat.id, it.id, `${pub.publicUrl}?v=${Date.now()}`));
    } catch {
      alert(t("errUploadFailed"));
    }
    setBusyKey(null);
  };

  const regenerateHd = async (cat: Category, it: Item) => {
    const key = `${cat.id}:${it.id}`;
    setBusyKey(key);
    try {
      const url = new URL(it.image!.split("?")[0]);
      const marker = `/${BUCKET}/`;
      const originalPath = url.pathname.slice(url.pathname.indexOf(marker) + marker.length);
      const r = await fetch("/api/images/enhance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey: key, originalPath, quality: "hd", prompt: prompts[key] || undefined }),
      });
      const d = await r.json();
      if (r.ok && d.url) {
        await persist(setItemImage(cat.id, it.id, d.url));
        setQuotaUsed(d.used);
      } else if (r.status === 402) {
        alert(d.message || t("errQuotaFull"));
      } else {
        alert(d.error || t("errRegenerateFailed"));
      }
    } catch {
      alert(t("errRegenerateFailed"));
    }
    setBusyKey(null);
  };

  const buyImagePack = async () => {
    setBillingLoading(true);
    const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: "image_pack" }) });
    const d = await r.json();
    setBillingLoading(false);
    if (d.url) window.location.href = d.url;
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "22px 22px 80px" }}>
      <div style={{ marginBottom: 18 }}>
        <div className="tag">{tNav("studio")}</div>
        <h1 className="font-display" style={{ fontSize: 24, marginTop: 6 }}>{t("title")}</h1>
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, maxWidth: 640 }}>
          {t("desc")}
        </p>
        <Link href="/panel" style={{ fontSize: 12.5, color: "var(--accent)", display: "inline-block", marginTop: 8 }}>{t("backToPanel")}</Link>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div className="tag">{t("quota")}</div>
        <div style={{ marginTop: 8, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>{t.rich("quotaUsed", { used: quotaUsed, quota: imageQuota, b: (chunks) => <b>{chunks}</b> })}</span>
          <button className="btn-ghost btn" style={{ padding: "7px 12px", fontSize: 12.5 }} disabled={billingLoading} onClick={buyImagePack}>
            {t("buyPack", { credits: PRICING.imagePack.credits, amount: PRICING.imagePack.amount })}
          </button>
        </div>
        <div style={{ marginTop: 8, height: 6, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${imageQuota ? Math.min(100, (quotaUsed / imageQuota) * 100) : 0}%`, background: "var(--accent)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {items.map(({ cat, item }) => {
          const key = `${cat.id}:${item.id}`;
          const busy = busyKey === key;
          return (
            <div key={key} className="card" style={{ padding: 14 }}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 10, border: "1px dashed var(--line)", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 26 }}>🍽</div>
              )}
              <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 600 }}>{item.name || t("unnamed")}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{cat.name}</div>

              {item.image && (
                <textarea
                  className="field"
                  placeholder={t("promptPlaceholder")}
                  value={prompts[key] || ""}
                  onChange={(e) => setPrompts((p) => ({ ...p, [key]: e.target.value }))}
                  maxLength={240}
                  rows={2}
                  style={{ marginTop: 10, fontSize: 12, resize: "vertical" }}
                />
              )}

              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <label className="btn-ghost btn" style={{ padding: "7px 10px", fontSize: 12, cursor: "pointer" }}>
                  {busy ? "..." : t("uploadPhoto")}
                  <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadOwnPhoto(cat, item, f); e.target.value = ""; }} />
                </label>
                {item.image && (
                  <button onClick={() => regenerateHd(cat, item)} disabled={busy} className="btn-ghost btn" style={{ padding: "7px 10px", fontSize: 12 }}>
                    {busy ? t("regenerating") : t("regenerate")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 20 }}>
          {t("emptyState")}
        </p>
      )}
    </main>
  );
}
