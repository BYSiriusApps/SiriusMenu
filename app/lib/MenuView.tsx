import React from "react";
import { SOCIAL_PLATFORMS, TAGS, THEMES, money, socialHref, type MenuData, type SocialLinks } from "./menu";

const SOCIAL_ICON_PATHS: Record<keyof SocialLinks, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
    </>
  ),
  facebook: null,
  tiktok: null,
};

function SocialIcon({ platform }: { platform: keyof SocialLinks }) {
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V5.2c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.8h2.4V21h2.7z" /></svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.7c-1.5 0-2.8-.4-4-1.2v6.4c0 3.1-2.5 5.2-5.3 5.2-2.9 0-5.2-2.3-5.2-5.2 0-2.9 2.4-5.3 5.4-5.1v2.8c-1.4-.2-2.6.8-2.6 2.2 0 1.3 1.1 2.4 2.5 2.4 1.5 0 2.6-1.2 2.6-2.7V3h2.6z" /></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {SOCIAL_ICON_PATHS[platform]}
    </svg>
  );
}

/** Müşteri-görünümü dijital menü (temaya göre). */
export function MenuView({ menu }: { menu: MenuData }) {
  const th = THEMES.find((t) => t.key === menu.theme) ?? THEMES[0];
  const socialEntries = SOCIAL_PLATFORMS.filter((p) => menu.social?.[p.key]);
  return (
    <div style={{ background: th.bg, color: th.ink, fontFamily: "var(--font-body)", minHeight: "100%" }}>
      {/* Başlık */}
      <div style={{ textAlign: "center", padding: "34px 22px 22px", borderBottom: `1px solid ${th.accent}33` }}>
        {menu.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={menu.logo} alt="" style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", margin: "0 auto 12px", display: "block" }} />
        )}
        <div style={{ fontFamily: th.font, fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.05 }}>{menu.name || "Menü"}</div>
        {menu.subtitle && <div style={{ color: th.sub, fontSize: 13.5, marginTop: 8, maxWidth: 300, marginInline: "auto" }}>{menu.subtitle}</div>}
        {socialEntries.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            {socialEntries.map((p) => (
              <a key={p.key} href={socialHref(p.key, menu.social![p.key]!)} target="_blank" rel="noopener noreferrer" aria-label={p.label} style={{ color: th.accent, opacity: 0.85, display: "flex" }}>
                <SocialIcon platform={p.key} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Kategoriler */}
      <div style={{ padding: "18px 20px 40px" }}>
        {menu.categories.map((cat) => (
          <div key={cat.id} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: th.font, fontSize: 19, fontWeight: 600, color: th.accent }}>{cat.name}</span>
              <span style={{ flex: 1, height: 1, background: `${th.accent}30` }} />
            </div>
            {cat.items.map((it) => {
              const sold = it.available === false;
              return (
              <div key={it.id} style={{ background: th.card, borderRadius: 12, padding: it.image ? "0" : "13px 15px", marginBottom: 9, boxShadow: th.dark ? "none" : "0 1px 3px rgba(30,20,10,.04)", overflow: "hidden", opacity: sold ? 0.55 : 1 }}>
                <div style={{ display: "flex", gap: it.image ? 0 : 12 }}>
                  {it.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.name} loading="lazy" style={{ width: 92, minWidth: 92, height: "auto", alignSelf: "stretch", objectFit: "cover", filter: sold ? "grayscale(1)" : "none" }} />
                  )}
                  <div style={{ flex: 1, padding: it.image ? "12px 14px" : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontWeight: 600, fontSize: 15.5 }}>
                        {it.name}
                        {sold && <span style={{ fontSize: 10, fontWeight: 700, color: th.sub, background: `${th.sub}22`, padding: "1px 6px", borderRadius: 999, marginLeft: 6, verticalAlign: "middle" }}>Tükendi</span>}
                      </span>
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
                </div>
              </div>
              );
            })}
          </div>
        ))}
        <div style={{ textAlign: "center", color: th.sub, fontSize: 10.5, marginTop: 28, opacity: .8 }}>SiriusMenu ile hazırlandı</div>
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
