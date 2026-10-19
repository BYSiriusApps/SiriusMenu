"use client";
import { useState } from "react";

type Labels = {
  printsLabel: string;
  costLabel: string;
  printedYear: string;
  firstYear: string;
  nextYears: string;
  saving: string;
  extra: string;
  note: string;
};

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");

/** Basılı menü maliyetini Temel plan (kurulum + yıllık abonelik) ile karşılaştırır. Tüm sayılar kullanıcının girdisinden hesaplanır. */
export function CostCalculator({ yearlyPrice, setupPrice, labels }: { yearlyPrice: number; setupPrice: number; labels: Labels }) {
  const [prints, setPrints] = useState(4);
  const [cost, setCost] = useState(3000);

  const clamp = (v: string, max: number) => {
    const n = Math.floor(Number(v));
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
  };

  const printed = prints * cost;
  const first = printed - (yearlyPrice + setupPrice);
  const next = printed - yearlyPrice;
  const row = (title: string, diff: number) => (
    <div className="flex items-baseline justify-between gap-4 border-t border-[var(--line)] py-3">
      <span className="text-sm text-[var(--muted)]">{title}</span>
      <span className="font-display text-xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums", color: diff >= 0 ? "var(--accent)" : "var(--muted)" }}>
        {diff >= 0 ? labels.saving : labels.extra}: {fmt(Math.abs(diff))} ₺
      </span>
    </div>
  );

  return (
    <div className="card mx-auto mt-10 max-w-xl p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--muted)]">{labels.printsLabel}</span>
          <input className="field mt-1" type="number" inputMode="numeric" min={0} max={24} value={prints} onChange={(e) => setPrints(clamp(e.target.value, 24))} />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--muted)]">{labels.costLabel}</span>
          <input className="field mt-1" type="number" inputMode="numeric" min={0} max={500000} step={100} value={cost} onChange={(e) => setCost(clamp(e.target.value, 500000))} />
        </label>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--line)] py-3">
        <span className="text-sm text-[var(--muted)]">{labels.printedYear}</span>
        <span className="font-display text-xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(printed)} ₺</span>
      </div>
      {row(labels.firstYear, first)}
      {row(labels.nextYears, next)}
      <p className="mt-3 text-xs text-[var(--muted)]" aria-live="polite">{labels.note}</p>
    </div>
  );
}
