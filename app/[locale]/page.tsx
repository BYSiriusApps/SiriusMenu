import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MenuView, Phone } from "@/app/lib/MenuView";
import { DEFAULT_MENU, THEMES, PRICING } from "@/app/lib/menu";
import { DEMOS } from "@/app/lib/demos";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

type Feature = { t: string; d: string };
type Step = { n: string; t: string; d: string };
type FaqItem = { q: string; a: string };

export default async function Landing() {
  const t = await getTranslations("Landing");
  const themeDesc = t.raw("themes.desc") as Record<string, string>;
  const features = t.raw("features.items") as Feature[];
  const whatsappBullets = t.raw("whatsapp.bullets") as string[];
  const whatsappChat = t.raw("whatsapp.chat") as string[];
  const steps = t.raw("howItWorks.steps") as Step[];
  const uses = t.raw("uses.items") as Feature[];
  const oldItems = t.raw("comparison.old") as string[];
  const newItems = t.raw("comparison.new") as string[];
  const faq = t.raw("faq.items") as FaqItem[];
  const contextItems = t.raw("contextStrip.items") as string[];
  const heroChecks = t.raw("hero.checks") as string[];

  return (
    <main>
      {/* NAV */}
      <nav className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-display text-2xl font-extrabold">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-sm font-extrabold text-white">S</span>
            SiriusMenu
          </span>
          <div className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
            <a href="#ornek" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>{t("nav.example")}</a>
            <a href="#temalar" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>{t("nav.themes")}</a>
            <a href="#nasil" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>{t("nav.howItWorks")}</a>
            <a href="#fiyat" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>{t("nav.pricing")}</a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/giris" className={`hidden text-sm text-[var(--muted)] transition hover:text-[var(--ink)] md:inline ${ring}`}>{t("nav.login")}</Link>
            <Link href="/app" className={`btn btn-accent !px-5 !py-2.5 text-sm ${ring}`}>{t("nav.cta")}</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1fr_340px] md:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("hero.eyebrow")}</p>
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            {t.rich("hero.subtitle", { b: (chunks) => <b className="text-[var(--ink)]">{chunks}</b> })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className={`btn btn-accent ${ring}`}>{t("hero.ctaPrimary")}</Link>
            <a href="#nasil" className={`btn btn-ghost ${ring}`}>{t("hero.ctaSecondary")}</a>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
            {heroChecks.map((c) => <span key={c}>✓ {c}</span>)}
          </p>
        </div>
        <div className="flex justify-center">
          <Phone><MenuView menu={DEFAULT_MENU} /></Phone>
        </div>
      </section>

      {/* CONTEXT STRIP */}
      <section className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-5 text-sm font-medium text-[var(--muted)]">
          <span className="text-[11px] uppercase tracking-widest">{t("contextStrip.label")}</span>
          {contextItems.map((item, i) => (
            <span key={item} className="contents">
              {i > 0 && <span aria-hidden="true">·</span>}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ÖRNEK / SHOWCASE */}
      <section id="ornek" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("showcase.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-balance md:text-5xl">
            {t("showcase.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
            {t("showcase.subtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((d) => (
            <div key={d.slug} className="flex flex-col items-center">
              <Phone><MenuView menu={d.menu} /></Phone>
              <p className="mt-4 font-display text-lg font-bold">{d.menu.name}</p>
              <p className="text-sm text-[var(--muted)]">{d.tag} · {d.menu.theme} {t("showcase.themeSuffix")}</p>
              <Link href={`/m/${d.slug}`} className={`btn btn-ghost mt-3 !px-4 !py-2 text-sm ${ring}`}>{t("showcase.liveMenu")}</Link>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/ornek" className={`btn btn-accent ${ring}`}>{t("showcase.allExamples")}</Link>
        </div>
      </section>

      {/* TEMALAR */}
      <section id="temalar" className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("themes.eyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("themes.title")}</h2>
            <p className="mt-4 text-lg text-[var(--muted)]">{t("themes.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((th) => (
              <div key={th.key} className="card overflow-hidden">
                <div
                  className="flex aspect-[4/5] flex-col gap-3 p-5"
                  style={{ background: th.bg, color: th.ink, fontFamily: th.font }}
                >
                  <div className="text-lg font-semibold leading-tight">{t("themes.sampleName")}</div>
                  <div className="mt-1 space-y-2.5 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span>{t("themes.sampleItem1")}</span>
                      <span className="font-semibold" style={{ color: th.accent, fontVariantNumeric: "tabular-nums" }}>95 ₺</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span>{t("themes.sampleItem2")}</span>
                      <span className="font-semibold" style={{ color: th.accent, fontVariantNumeric: "tabular-nums" }}>140 ₺</span>
                    </div>
                  </div>
                  <span
                    className="mt-auto w-fit rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ background: th.accent }}
                  >
                    {th.label}
                  </span>
                </div>
                <p className="p-4 text-sm text-[var(--muted)]">{themeDesc[th.key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("features.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("features.title")}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.t} className="card p-7">
              <span className="font-display text-2xl font-extrabold text-[var(--accent)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">{f.t}</h3>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP AI */}
      <section className="bg-[#151310] py-20 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1fr_420px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("whatsapp.eyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("whatsapp.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#bfae94]">
              {t("whatsapp.subtitle")}
            </p>
            <ul className="mt-6 space-y-3">
              {whatsappBullets.map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-white">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#1b1712] p-6">
            <div className="flex flex-col gap-3">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#1f8a52] px-4 py-3 text-sm">{whatsappChat[0]}</div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#2a241b] px-4 py-3 text-sm text-[#e8dfd0]">{whatsappChat[1]}</div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#1f8a52] px-4 py-3 text-sm">{whatsappChat[2]}</div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#2a241b] px-4 py-3 text-sm text-[#e8dfd0]">{whatsappChat[3]}</div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("howItWorks.eyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("howItWorks.title")}</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent)] font-display text-lg font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-[var(--muted)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KULLANIM ALANLARI */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("uses.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("uses.title")}</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map((u) => (
            <div key={u.t} className="card p-7">
              <h3 className="font-display text-xl font-bold">{u.t}</h3>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("comparison.eyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("comparison.title")}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card p-7">
              <h3 className="font-semibold text-[var(--muted)]">{t("comparison.oldTitle")}</h3>
              <ul className="mt-4 space-y-3 text-[var(--muted)]">
                {oldItems.map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border border-[var(--line)] text-[11px] font-bold">×</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card border-2 border-[var(--accent)] p-7">
              <h3 className="font-semibold text-[var(--accent)]">{t("comparison.newTitle")}</h3>
              <ul className="mt-4 space-y-3 text-[var(--ink)]">
                {newItems.map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-white">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FİYAT */}
      <section id="fiyat" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("pricing.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("pricing.title")}</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="card p-8">
            <h3 className="font-semibold">{t("pricing.trial.title")}</h3>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>{t("pricing.trial.price")}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("pricing.trial.desc")}</p>
            <ul className="mt-5 space-y-2.5 text-[var(--muted)]">
              <li>✓ {t("pricing.trial.feature1")}</li>
              <li>✓ {t("pricing.trial.feature2")}</li>
              <li className="opacity-60">✗ {t("pricing.trial.feature3")}</li>
            </ul>
            <Link href="/app" className={`btn btn-ghost mt-6 w-full ${ring}`}>{t("pricing.trial.cta")}</Link>
          </div>
          <div className="card relative border-2 border-[var(--accent)] p-8 shadow-[0_24px_60px_-40px_rgba(224,137,27,.6)]">
            <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white">{t("pricing.monthly.badge")}</span>
            <h3 className="font-semibold">{t("pricing.monthly.title")}</h3>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>
              {PRICING.monthly.amount}<span className="text-base font-normal text-[var(--muted)]"> {t("pricing.monthly.perMonth")}</span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("pricing.monthly.setupNote", { amount: PRICING.setup.amount })}</p>
            <ul className="mt-5 space-y-2.5 text-[var(--ink)]">
              <li>✓ {t("pricing.monthly.feature1")}</li>
              <li>✓ {t("pricing.monthly.feature2")}</li>
              <li>✓ {t("pricing.monthly.feature3", { quota: PRICING.monthly.imageQuota })}</li>
              <li>✓ {t("pricing.monthly.feature4")}</li>
            </ul>
            <Link href="/kayit" className={`btn btn-accent mt-6 w-full ${ring}`}>{t("pricing.monthly.cta")}</Link>
          </div>
          <div className="card p-8">
            <h3 className="font-semibold">{t("pricing.yearly.title")}</h3>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>
              {PRICING.yearly.amount}<span className="text-base font-normal text-[var(--muted)]"> {t("pricing.yearly.perYear")}</span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("pricing.yearly.setupNote", { amount: PRICING.setup.amount })}</p>
            <ul className="mt-5 space-y-2.5 text-[var(--ink)]">
              <li>✓ {t("pricing.yearly.feature1")}</li>
              <li>✓ {t("pricing.yearly.feature2", { quota: PRICING.yearly.imageQuota })}</li>
              <li>✓ {t("pricing.yearly.feature3")}</li>
            </ul>
            <Link href="/kayit" className={`btn btn-ghost mt-6 w-full ${ring}`}>{t("pricing.yearly.cta")}</Link>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-[var(--muted)]">
          {t("pricing.footnote", {
            overage: PRICING.overagePerImage,
            packCredits: PRICING.imagePack.credits,
            packAmount: PRICING.imagePack.amount,
            bulk50: PRICING.bulk50.amount,
            bulk100: PRICING.bulk100.amount,
          })}
        </p>
      </section>

      {/* SSS */}
      <section className="border-t border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("faq.eyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">{t("faq.title")}</h2>
          </div>
          <div className="mt-10 divide-y divide-[var(--line)]">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold ${ring}`}>
                  {f.q}
                  <span aria-hidden="true" className="text-[var(--muted)] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SON CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-balance md:text-6xl">
          {t("finalCta.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-[var(--muted)]">
          {t("finalCta.subtitle")}
        </p>
        <Link href="/app" className={`btn btn-accent mx-auto mt-8 !px-8 !py-4 text-base ${ring}`}>{t("finalCta.cta")}</Link>
      </section>

      <footer className="border-t border-[var(--line)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-[var(--muted)] md:flex-row">
          <span className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--ink)]">
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md bg-[var(--accent)] text-xs font-extrabold text-white">S</span>
            SiriusMenu
          </span>
          <span>{t("footer.tagline")}</span>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-2 px-6 text-xs text-[var(--muted)] md:justify-start">
          <Link href="/gizlilik-politikasi" className="transition hover:text-[var(--ink)]">{t("footer.links.privacy")}</Link>
          <Link href="/kvkk-aydinlatma-metni" className="transition hover:text-[var(--ink)]">{t("footer.links.kvkk")}</Link>
          <Link href="/cerez-politikasi" className="transition hover:text-[var(--ink)]">{t("footer.links.cookies")}</Link>
          <Link href="/kullanim-sartlari" className="transition hover:text-[var(--ink)]">{t("footer.links.terms")}</Link>
          <Link href="/mesafeli-satis-sozlesmesi" className="transition hover:text-[var(--ink)]">{t("footer.links.distanceSales")}</Link>
          <Link href="/iade-iptal-politikasi" className="transition hover:text-[var(--ink)]">{t("footer.links.refund")}</Link>
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-6 text-center text-xs text-[var(--muted)] md:text-left">
          {t("footer.companyLine")}
        </p>
      </footer>
    </main>
  );
}
