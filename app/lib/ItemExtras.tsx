import React from "react";
import { ALLERGENS, money, type Item, type Theme } from "./menu";

/** Ürün altında gösterilen isteğe bağlı bilgiler: porsiyon seçenekleri, gramaj/kalori ve alerjenler. */
export function ItemExtras({ it, th, currency, center }: { it: Item; th: Theme; currency: string; center?: boolean }) {
  const variants = (it.variants ?? []).filter((v) => v.name.trim() || v.price.trim());
  const meta = [it.portion?.trim(), typeof it.calories === "number" ? `${it.calories} kcal` : ""].filter(Boolean).join(" · ");
  const allergens = ALLERGENS.filter((a) => it.allergens?.includes(a.key));
  if (variants.length === 0 && !meta && allergens.length === 0) return null;

  return (
    <div style={{ marginTop: 6, textAlign: center ? "center" : "left" }}>
      {variants.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", justifyContent: center ? "center" : "flex-start", fontSize: 12.5 }}>
          {variants.map((v, i) => (
            <span key={`${v.name}-${i}`} style={{ color: th.ink }}>
              {v.name}{" "}
              <b style={{ color: th.accent, fontWeight: 600 }}>{money(v.price, currency)}</b>
            </span>
          ))}
        </div>
      )}
      {meta && <div style={{ color: th.sub, fontSize: 11.5, marginTop: variants.length ? 3 : 0 }}>{meta}</div>}
      {allergens.length > 0 && (
        <div style={{ color: th.sub, fontSize: 11, marginTop: 3, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>Alerjen:</span> {allergens.map((a) => `${a.emoji} ${a.label}`).join(", ")}
        </div>
      )}
    </div>
  );
}
