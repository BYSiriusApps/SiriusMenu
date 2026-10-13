"use client";
import { useEffect, useRef, useState } from "react";
import { TAGS, money, type Category, type Theme } from "./menu";

/**
 * 3D coverflow: ortadaki ürün öne çıkar, yanlardakiler döner ve küçülür.
 * Kaydırma (swipe), ok butonları, yan karta dokunma ve klavye ile gezilir.
 */
export function Coverflow({ cat, th, headingFont, currency, autoplay }: { cat: Category; th: Theme; headingFont: string; currency?: string; autoplay?: boolean }) {
  const items = cat.items;
  const [active, setActive] = useState(Math.min(1, Math.max(0, items.length - 1)));
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const count = items.length;

  // Vitrin modunda (landing) ürünler kendiliğinden döner.
  useEffect(() => {
    if (!autoplay || count < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), 1700);
    return () => clearInterval(id);
  }, [autoplay, count]);

  if (count === 0) return null;

  const go = (i: number) => setActive(Math.max(0, Math.min(items.length - 1, i)));
  const it = items[active];
  const sold = it.available === false;

  const onPointerDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, moved: false }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 28) { d.moved = true; go(active + (dx < 0 ? 1 : -1)); }
  };

  const btn: React.CSSProperties = {
    position: "absolute", top: "42%", width: 30, height: 30, borderRadius: "50%", border: `1px solid ${th.accent}44`,
    background: th.card, color: th.accent, cursor: "pointer", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, lineHeight: 1,
  };

  return (
    <div>
      <div
        role="group" aria-roledescription="carousel" aria-label={cat.name} tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(active + 1); if (e.key === "ArrowLeft") go(active - 1); }}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp}
        style={{ position: "relative", height: 232, perspective: 760, touchAction: "pan-y", outline: "none", userSelect: "none" }}
      >
        {items.map((x, i) => {
          const off = i - active;
          const abs = Math.abs(off);
          if (abs > 2) return null;
          const dir = Math.sign(off);
          return (
            <div
              key={x.id}
              onClick={() => { if (off !== 0) go(i); }}
              aria-hidden={off !== 0}
              style={{
                position: "absolute", left: "50%", top: 6, width: 148, height: 208, marginLeft: -74,
                transform: `translateX(${dir * (abs === 1 ? 84 : 128)}px) translateZ(${-abs * 90}px) rotateY(${-dir * 48}deg) scale(${off === 0 ? 1 : 0.92})`,
                transition: "transform .45s cubic-bezier(.2,.8,.2,1), opacity .45s, filter .45s",
                zIndex: 10 - abs, opacity: abs === 2 ? 0.45 : 1, filter: off === 0 ? "none" : "brightness(.78)",
                borderRadius: 16, overflow: "hidden", background: th.card, cursor: off === 0 ? "default" : "pointer",
                boxShadow: th.dark ? "0 14px 30px -10px rgba(0,0,0,.7)" : "0 14px 30px -12px rgba(30,20,10,.45)",
                border: off === 0 ? `1.5px solid ${th.accent}88` : "1.5px solid transparent",
              }}
            >
              {x.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.image} alt={x.name} loading="lazy" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: x.available === false ? "grayscale(1)" : "none", pointerEvents: "none" }} />
                  {x.aiImage && <span style={{ position: "absolute", left: 6, bottom: 6, fontSize: 9.5, color: "#fff", background: "rgba(0,0,0,.5)", padding: "1px 6px", borderRadius: 999 }}>Görsel temsilidir</span>}
                </>
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: `linear-gradient(160deg, ${th.accent}33, ${th.card})`, fontFamily: headingFont, fontSize: 54, color: th.accent }}>
                  {x.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
        {active > 0 && <button type="button" aria-label="Önceki" onClick={() => go(active - 1)} style={{ ...btn, left: 0 }}>‹</button>}
        {active < items.length - 1 && <button type="button" aria-label="Sonraki" onClick={() => go(active + 1)} style={{ ...btn, right: 0 }}>›</button>}
      </div>

      {/* Seçili ürünün bilgisi */}
      <div key={it.id} style={{ textAlign: "center", padding: "6px 6px 0", opacity: sold ? 0.6 : 1 }} aria-live="polite">
        <div style={{ fontWeight: 600, fontSize: 17 }}>
          {it.name}
          {sold && <span style={{ fontSize: 10, fontWeight: 700, color: th.sub, background: `${th.sub}22`, padding: "1px 6px", borderRadius: 999, marginLeft: 6, verticalAlign: "middle" }}>Tükendi</span>}
        </div>
        <div style={{ fontFamily: headingFont, fontWeight: 600, fontSize: 18, color: th.accent, marginTop: 2 }}>{money(it.price, currency)}</div>
        {it.desc && <div style={{ color: th.sub, fontSize: 12.5, marginTop: 5, lineHeight: 1.45, maxWidth: 260, marginInline: "auto" }}>{it.desc}</div>}
        {it.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {it.tags.map((tg) => {
              const t = TAGS.find((y) => y.key === tg);
              if (!t) return null;
              return <span key={tg} style={{ fontSize: 10.5, fontWeight: 600, color: th.accent, background: `${th.accent}18`, padding: "2px 8px", borderRadius: 999 }}>{t.emoji} {t.label}</span>;
            })}
          </div>
        )}
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 10 }}>
          {items.map((x, i) => (
            <button key={x.id} type="button" aria-label={x.name} onClick={() => go(i)} style={{ width: i === active ? 16 : 6, height: 6, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: i === active ? th.accent : `${th.accent}44`, transition: "width .25s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
