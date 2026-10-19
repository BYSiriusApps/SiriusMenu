/** Landing: özellik kartları sürekli yatay kayar (üzerine gelince durur). Kartlar iki kez basılır, ikincisi ekran okuyucudan gizlenir. */
export function FeatureSlider({ items }: { items: { t: string; d: string }[] }) {
  const group = (hidden: boolean) => (
    <div className="flex gap-6 pr-6" aria-hidden={hidden || undefined}>
      {items.map((f, i) => (
        <div key={f.t} className="card w-[320px] shrink-0 p-7 md:w-[380px]">
          <span className="font-display text-3xl font-extrabold text-[var(--accent)]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold">{f.t}</h3>
          <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">{f.d}</p>
        </div>
      ))}
    </div>
  );
  return (
    <div className="marquee feature-marquee">
      <div className="marquee-track" style={{ animationDuration: `${items.length * 7}s` }}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
