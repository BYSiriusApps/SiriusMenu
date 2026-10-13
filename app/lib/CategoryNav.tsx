"use client";
import type React from "react";
import type { Category, Theme } from "./menu";

/** Kategori sekmeleri: dokununca ilgili kategoriye, kaydırılan en yakın kapsayıcı içinde yumuşakça gider. */
export function CategoryNav({ categories, th }: { categories: Category[]; th: Theme }) {
  if (categories.length < 2) return null;
  const jump = (e: React.MouseEvent<HTMLElement>, id: number) => {
    e.currentTarget.closest("[data-menuview]")?.querySelector(`[data-cat-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav
      aria-label="Kategoriler"
      style={{
        position: "sticky", top: 26, zIndex: 5, display: "flex", gap: 8, overflowX: "auto", padding: "10px 20px",
        background: th.bg, borderBottom: `1px solid ${th.accent}22`, scrollbarWidth: "none",
      }}
    >
      {categories.map((c) => (
        <button
          key={c.id} type="button" onClick={(e) => jump(e, c.id)}
          style={{
            flex: "0 0 auto", cursor: "pointer", fontSize: 12.5, fontWeight: 600, padding: "6px 13px", borderRadius: 999,
            border: `1px solid ${th.accent}44`, background: th.card, color: th.accent, whiteSpace: "nowrap",
          }}
        >
          {c.name}
        </button>
      ))}
    </nav>
  );
}
