"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AutoScrollPhone } from "./AutoScrollPhone";
import type { Demo } from "@/app/lib/demos";

type Labels = { liveMenu: string; themeSuffix: string; prev: string; next: string };

/**
 * Landing vitrini: telefonlar 3D halka halinde slayt gibi temadan temaya kendiliğinden kayar
 * (menü içerikleri kaymaz; üzerine gelince durur).
 */
export function ShowcaseCarousel({ demos, themeNames, labels }: {
  demos: Demo[]; themeNames: Record<string, string>; labels: Labels;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState(300);
  const n = demos.length;

  useEffect(() => {
    const upd = () => setSpread(window.innerWidth < 760 ? 0 : window.innerWidth < 1024 ? 230 : 330);
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Slayt gibi: temalar belli aralıkla kendiliğinden kayar (menü içerikleri kaymaz).
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4500);
    return () => clearInterval(id);
  }, [paused, n]);

  const go = (i: number) => setActive(((i % n) + n) % n);
  const cur = demos[active];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div style={{ position: "relative", height: 660, perspective: 1400, overflow: "hidden" }}>
        {demos.map((d, i) => {
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          const hidden = spread === 0 ? abs > 0 : abs > 2;
          const dir = Math.sign(off);
          return (
            <div
              key={d.slug}
              onClick={() => off !== 0 && go(i)}
              aria-hidden={off !== 0}
              style={{
                position: "absolute", left: "50%", top: 10, marginLeft: -150,
                transform: `translateX(${dir * spread * (abs === 1 ? 1 : 1.65)}px) translateZ(${-abs * 170}px) rotateY(${-dir * 38}deg) scale(${off === 0 ? 1 : 0.9})`,
                transition: "transform 1.6s cubic-bezier(.45,.05,.25,1), opacity 1.6s ease, filter 1.6s ease",
                opacity: hidden ? 0 : abs === 2 ? 0.45 : 1, filter: off === 0 ? "none" : "brightness(.8)",
                zIndex: 10 - abs, pointerEvents: hidden ? "none" : "auto", cursor: off === 0 ? "default" : "pointer",
              }}
            >
              <div style={{ pointerEvents: off === 0 ? "auto" : "none" }}>
                <AutoScrollPhone menu={d.menu} playing={false} />
              </div>
            </div>
          );
        })}
        <button type="button" aria-label={labels.prev} onClick={() => go(active - 1)} className="showcase-arrow" style={{ left: 4 }}>‹</button>
        <button type="button" aria-label={labels.next} onClick={() => go(active + 1)} className="showcase-arrow" style={{ right: 4 }}>›</button>
      </div>

      <div style={{ textAlign: "center", marginTop: 8 }} aria-live="polite">
        <p className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{cur.menu.name}</p>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{cur.tag.replace(/ 3D$/, "")} · {themeNames[cur.menu.theme]} {labels.themeSuffix}</p>
        <Link href={`/m/${cur.slug}`} className="btn btn-ghost" style={{ marginTop: 12, padding: "8px 16px", fontSize: 14 }}>{labels.liveMenu}</Link>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
          {demos.map((d, i) => (
            <button key={d.slug} type="button" aria-label={d.menu.name} onClick={() => go(i)}
              style={{ width: i === active ? 28 : 9, height: 9, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: i === active ? "var(--accent)" : "var(--line)", transition: "width .3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
