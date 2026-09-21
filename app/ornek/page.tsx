"use client";
import { useState } from "react";
import Link from "next/link";
import { DEMOS } from "../lib/demos";
import { MenuView, Phone } from "../lib/MenuView";

export default function OrnekPage() {
  const [active, setActive] = useState(0);
  const demo = DEMOS[active];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--ink)]">← SiriusMenu</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">Örnek menüler</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        Üç farklı mekan, üç tema. Her biri gerçek bir SiriusMenu menüsü: fotoğraflı ürünler, kategoriler,
        etiketler ve anlık güncellenen fiyatlar. Telefonda nasıl göründüğünü aşağıda incele.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {DEMOS.map((d, i) => (
          <button
            key={d.slug}
            onClick={() => setActive(i)}
            className="rounded-full border px-4 py-2 text-sm font-semibold transition"
            style={{
              borderColor: i === active ? "var(--accent)" : "var(--line)",
              background: i === active ? "var(--accent-soft)" : "transparent",
              color: i === active ? "var(--accent)" : "var(--muted)",
            }}
          >
            {d.tag} · {d.menu.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-[340px_1fr]">
        <div className="flex justify-center">
          <Phone><MenuView menu={demo.menu} /></Phone>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">{demo.menu.name}</h2>
          <p className="mt-2 text-[var(--muted)]">{demo.menu.subtitle}</p>
          <div className="mt-6 space-y-5">
            {demo.menu.categories.map((c) => (
              <div key={c.id}>
                <h3 className="font-display text-lg font-bold text-[var(--accent)]">{c.name}</h3>
                <ul className="mt-2 divide-y divide-[var(--line)]">
                  {c.items.map((it) => (
                    <li key={it.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                      <span>{it.name}</span>
                      <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{it.price} {demo.menu.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href={`/m/${demo.slug}`} className="btn btn-ghost mt-8 inline-flex">Canlı menüyü aç →</Link>
        </div>
      </div>

      <div className="mt-16 rounded-2xl border-2 border-[var(--accent)] p-8 text-center">
        <h2 className="font-display text-2xl font-extrabold md:text-3xl">Kendi menün de böyle görünsün</h2>
        <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">
          Fotoğraflarını yükle, AI ile iyileştir, WhatsApp&apos;tan tek mesajla fiyat güncelle.
        </p>
        <Link href="/kayit" className="btn btn-accent mx-auto mt-6 inline-flex">Menünü oluştur</Link>
      </div>
    </main>
  );
}
