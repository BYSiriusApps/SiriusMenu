import React from "react";
import { TAGS, THEMES, money, type MenuData } from "./menu";

/** Müşteri-görünümü dijital menü (temaya göre). */
export function MenuView({ menu }: { menu: MenuData }) {
  const th = THEMES.find((t) => t.key === menu.theme) ?? THEMES[0];
  return (
    <div style={{ background: th.bg, color: th.ink, fontFamily: "var(--font-body)", minHeight: "100%" }}>
      {/* Başlık */}
      <div style={{ textAlign: "center", padding: "34px 22px 22px", borderBottom: `1px solid ${th.accent}33` }}>
        <div style={{ fontFamily: th.font, fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.05 }}>{menu.name || "Menü"}</div>
        {menu.subtitle && <div style={{ color: th.sub, fontSize: 13.5, marginTop: 8, maxWidth: 300, marginInline: "auto" }}>{menu.subtitle}</div>}
      </div>

      {/* Kategoriler */}
      <div style={{ padding: "18px 20px 40px" }}>
        {menu.categories.map((cat) => (
          <div key={cat.id} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: th.font, fontSize: 19, fontWeight: 600, color: th.accent }}>{cat.name}</span>
              <span style={{ flex: 1, height: 1, background: `${th.accent}30` }} />
            </div>
            {cat.items.map((it) => (
              <div key={it.id} style={{ background: th.card, borderRadius: 12, padding: "13px 15px", marginBottom: 9, boxShadow: th.dark ? "none" : "0 1px 3px rgba(30,20,10,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: 15.5 }}>{it.name}</span>
                  <span style={{ fontFamily: th.font, fontWeight: 600, fontSize: 15.5, color: th.accent, whiteSpace: "nowrap" }}>{money(it.price, menu.currency)}</span>
                </div>
                {it.desc && <div style={{ color: th.sub, fontSize: 12.5, marginTop: 3, lineHeight: 1.45 }}>{it.desc}</div>}
                {it.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
                    {it.tags.map((tg) => {
                      const t = TAGS.find((x) => x.key === tg);
                      if (!t) return null;
                      return (
                        <span key={tg} style={{ fontSize: 10.5, fontWeight: 600, color: th.accent, background: `${th.accent}18`, padding: "2px 8px", borderRadius: 999 }}>
                          {t.emoji} {t.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div style={{ textAlign: "center", color: th.sub, fontSize: 10.5, marginTop: 28, opacity: .8 }}>Karemenü ile hazırlandı</div>
      </div>
    </div>
  );
}

/** Telefon çerçevesi. */
export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 300, borderRadius: 34, background: "#111", padding: 9, boxShadow: "0 24px 60px -28px rgba(20,15,5,.5)" }}>
      <div style={{ borderRadius: 26, overflow: "hidden", height: 600, overflowY: "auto", background: "#fff", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: 26, background: "transparent", display: "flex", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
          <div style={{ width: 110, height: 20, background: "#111", borderRadius: "0 0 14px 14px" }} />
        </div>
        <div style={{ marginTop: -26 }}>{children}</div>
      </div>
    </div>
  );
}
