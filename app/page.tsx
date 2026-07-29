import Link from "next/link";
import { MenuView, Phone } from "./lib/MenuView";
import { DEFAULT_MENU, THEMES } from "./lib/menu";

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

const THEME_DESC: Record<string, string> = {
  kafe: "Sıcak krem tonlar, zarif serif başlıklar. Üçüncü nesil kahveciler ve butik kafeler için.",
  klasik: "Sade beyaz zemin, dingin tipografi. Aile restoranı ve lokantalar için.",
  modern: "Nötr gri, geometrik başlıklar. Fast food, brunch ve şık mekanlar için.",
  gece: "Koyu zemin, sıcak altın vurgu. Bar, meyhane ve akşam servisi için.",
};

const FEATURES = [
  { t: "Baskı maliyeti sıfır", d: "Menü her değiştiğinde matbaaya gitme. Bir kez QR bas, içeriği hep ekrandan güncelle." },
  { t: "Anlık güncelleme", d: "Tükenen ürünü saniyede kaldır, yeni fiyatı yaz. Müşteri her zaman güncel menüyü görür." },
  { t: "AI açıklama yardımcısı", d: "Ürün adını yaz, yapay zeka iştah açan bir açıklama önersin. Boş açıklama kutusu kalmasın." },
  { t: "Dört hazır tema", d: "Kafe, klasik, modern ve gece. Mekanının tarzına uyan görünümü tek tıkla seç." },
  { t: "Ürün etiketleri", d: "Vegan, acı, glutensiz, şefin önerisi ve yeni. Müşteri aradığını menüde hızlı bulsun." },
  { t: "Çoklu para birimi", d: "₺, $ ve € desteği. Turistik bölgeler ve yabancı misafirler için tek menü yeter." },
];

const USES = [
  { t: "Kafe", d: "Kahve ve tatlı menün sık değişiyor. Sezonluk ürünü ekle, biteni kaldır, QR aynı kalsın." },
  { t: "Restoran", d: "Uzun menüyü kategorilere ayır; etiketlerle vegan ve acı seçenekleri tek bakışta işaretle." },
  { t: "Bar", d: "Gece temasıyla kokteyl ve içki listeni şık göster. Fiyatları akşam servisine göre güncelle." },
  { t: "Pastane", d: "Vitrindeki ürünleri net fiyatla listele; glutensiz ve vegan etiketleriyle seçim kolaylaşsın." },
];

const OLD = [
  "Fiyat değişince menü yeniden baskıya girer",
  "Her küçük değişiklik matbaa masrafı demek",
  "Kartlar yıpranır, lekelenir, eskir",
  "Yeni ürün için tüm menüyü baştan dizersin",
];
const NEW = [
  "Fiyatı ekrandan tek tıkla değiştir",
  "Baskı masrafı bir kere, sonrası sıfır",
  "QR yıpranmaz, menü hep temiz görünür",
  "Yeni ürünü saniyeler içinde ekle",
];

const FAQ = [
  { q: "Müşterinin uygulama indirmesi gerekir mi?", a: "Hayır. QR'ı telefon kamerasıyla okutması yeter; menü doğrudan tarayıcıda açılır. Hiçbir uygulama kurulmaz, üyelik istenmez." },
  { q: "Fiyatı değiştirince QR'ı yeniden mi basmalıyım?", a: "Gerekmez. QR hep aynı bağlantıya gider; sen içeriği güncelleyince müşteri okuttuğunda otomatik olarak güncel menüyü görür." },
  { q: "İnternet olmadan çalışır mı?", a: "Menüyü açmak için müşterinin telefonunda internet olması gerekir; mobil veri bu iş için fazlasıyla yeter. Zayıf sinyalli mekanlarda masaya kısa bir Wi-Fi notu koymanı öneririz." },
  { q: "Kaç ürün ekleyebilirim?", a: "Deneme planında menünü kurup önizleyebilir ve QR'ını indirebilirsin. Pro planda ürün ve kategori sayısında sınır yoktur." },
  { q: "Kendi logomu ve renklerimi koyabilir miyim?", a: "Pro planda logonu ekleyebilir, dört hazır temadan mekanının tarzına en uygun görünümü seçebilirsin." },
];

export default function Landing() {
  return (
    <main>
      {/* NAV */}
      <nav className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-display text-2xl font-extrabold">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-sm font-extrabold text-white">K</span>
            Karemenü
          </span>
          <div className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
            <a href="#ornek" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>Örnek</a>
            <a href="#temalar" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>Temalar</a>
            <a href="#nasil" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>Nasıl çalışır</a>
            <a href="#fiyat" className={`transition hover:text-[var(--ink)] focus-visible:text-[var(--ink)] ${ring}`}>Fiyat</a>
          </div>
          <Link href="/app" className={`btn btn-accent !px-5 !py-2.5 text-sm ${ring}`}>Menünü oluştur</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1fr_340px] md:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">QR dijital menü</p>
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance md:text-6xl">
            Masaya QR koy, menü telefonda açılsın.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            Ürünleri gir, temayı seç, QR kodu masaya koy. Müşteri okutur, menü anında telefonunda açılır.
            Fiyat değişince <b className="text-[var(--ink)]">tek yerden güncelle</b>; baskı maliyeti ve eski menü derdi biter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className={`btn btn-accent ${ring}`}>Ücretsiz oluştur →</Link>
            <a href="#nasil" className={`btn btn-ghost ${ring}`}>Nasıl çalışır?</a>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
            <span>✓ Kart gerekmez</span><span>✓ Anlık güncelleme</span><span>✓ Baskı yok</span>
          </p>
        </div>
        <div className="flex justify-center">
          <Phone><MenuView menu={DEFAULT_MENU} /></Phone>
        </div>
      </section>

      {/* CONTEXT STRIP */}
      <section className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-5 text-sm font-medium text-[var(--muted)]">
          <span className="text-[11px] uppercase tracking-widest">Nerede kullanılır</span>
          <span>Kafe</span><span aria-hidden="true">·</span>
          <span>Restoran</span><span aria-hidden="true">·</span>
          <span>Bar</span><span aria-hidden="true">·</span>
          <span>Pastane</span><span aria-hidden="true">·</span>
          <span>Fast food</span><span aria-hidden="true">·</span>
          <span>Otel</span>
        </div>
      </section>

      {/* ÖRNEK / SHOWCASE */}
      <section id="ornek" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_340px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Örnek</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-balance md:text-5xl">
              Aynı menü, tek QR ile telefonda.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
              Karemenü bir PDF değil, yaşayan bir menü. Müşteri masadaki kodu okutur; kategoriler, fiyatlar ve
              etiketler telefonunda tertemiz açılır. Sen bir ürünü değiştirdiğinde herkes anında yeni halini görür.
            </p>
            <ul className="mt-6 space-y-3">
              {["Kategori, fiyat ve açıklama tek ekranda", "Vegan, acı, glutensiz gibi etiketler", "Fiyat değişince baskı yok, anında güncel"].map((x) => (
                <li key={x} className="flex items-start gap-3 text-[var(--ink)]">
                  <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-white">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <Phone><MenuView menu={DEFAULT_MENU} /></Phone>
          </div>
        </div>
      </section>

      {/* TEMALAR */}
      <section id="temalar" className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Temalar</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">İşletmene uyan görünüm</h2>
            <p className="mt-4 text-lg text-[var(--muted)]">Dört hazır tema. Mekanının tarzına en yakın olanı seç, menü o görünüme bürünsün.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((th) => (
              <div key={th.key} className="card overflow-hidden">
                <div
                  className="flex aspect-[4/5] flex-col gap-3 p-5"
                  style={{ background: th.bg, color: th.ink, fontFamily: th.font }}
                >
                  <div className="text-lg font-semibold leading-tight">Kahve Durağı</div>
                  <div className="mt-1 space-y-2.5 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span>Flat White</span>
                      <span className="font-semibold" style={{ color: th.accent, fontVariantNumeric: "tabular-nums" }}>95 ₺</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span>San Sebastian</span>
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
                <p className="p-4 text-sm text-[var(--muted)]">{THEME_DESC[th.key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Özellikler</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Matbaaya gitmeden, matbaa derdi olmadan</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
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

      {/* NASIL ÇALIŞIR */}
      <section id="nasil" className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Nasıl çalışır</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Üç adımda yayında</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              ["1", "Menünü gir", "Kategorileri ve ürünleri yaz, fiyat ekle, temayı seç. AI açıklama yazmana yardım eder."],
              ["2", "QR kodu indir", "Menünün QR kodunu tek tıkla indir; masa kartına, vitrine ya da adisyona bas."],
              ["3", "Güncel tut", "Fiyat ya da ürün değişti mi tek yerden düzelt. QR aynı kalır, menü anında yenilenir."],
            ].map(([n, t, d]) => (
              <div key={n} className="card p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent)] font-display text-lg font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>{n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 leading-relaxed text-[var(--muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KULLANIM ALANLARI */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Kullanım alanları</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Her mekana göre bir menü</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USES.map((u) => (
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Karşılaştırma</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Basılı menü yerine Karemenü</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card p-7">
              <h3 className="font-semibold text-[var(--muted)]">Basılı menü</h3>
              <ul className="mt-4 space-y-3 text-[var(--muted)]">
                {OLD.map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border border-[var(--line)] text-[11px] font-bold">×</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card border-2 border-[var(--accent)] p-7">
              <h3 className="font-semibold text-[var(--accent)]">Karemenü</h3>
              <ul className="mt-4 space-y-3 text-[var(--ink)]">
                {NEW.map((x) => (
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
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Fiyat</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Basit ve net</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="font-semibold">Deneme</h3>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>Ücretsiz</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Menünü oluştur, önizle, QR'ını indir.</p>
            <ul className="mt-5 space-y-2.5 text-[var(--muted)]">
              <li>✓ Menü oluşturucu</li>
              <li>✓ Dört temanın tümü</li>
              <li>✓ QR kodu indirme</li>
              <li className="opacity-60">✗ Sınırsız ürün ve logo</li>
            </ul>
            <Link href="/app" className={`btn btn-ghost mt-6 w-full ${ring}`}>Başla</Link>
          </div>
          <div className="card relative border-2 border-[var(--accent)] p-8 shadow-[0_24px_60px_-40px_rgba(224,137,27,.6)]">
            <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white">İŞLETME</span>
            <h3 className="font-semibold">Pro</h3>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>
              149<span className="text-base font-normal text-[var(--muted)]"> TL/ay</span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">Sınırsız ürün, tüm temalar, logo ve anlık güncelleme.</p>
            <ul className="mt-5 space-y-2.5 text-[var(--ink)]">
              <li>✓ Sınırsız ürün ve kategori</li>
              <li>✓ Tüm temalar + logo ekleme</li>
              <li>✓ Anlık güncelleme, QR sabit</li>
              <li>✓ İstediğin an iptal</li>
            </ul>
            <Link href="/app" className={`btn btn-accent mt-6 w-full ${ring}`}>Menünü yayınla</Link>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-[var(--muted)]">
          Zincir işletmeler ve birden çok şube için özel plan mevcut.
        </p>
      </section>

      {/* SSS */}
      <section className="border-t border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">SSS</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance md:text-5xl">Sık sorulanlar</h2>
          </div>
          <div className="mt-10 divide-y divide-[var(--line)]">
            {FAQ.map((f) => (
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
          Basılı menü çağı bitti.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-[var(--muted)]">
          Masaya QR koy, menünü hep güncel tut. Kart gerekmez, baskı masrafı yok.
        </p>
        <Link href="/app" className={`btn btn-accent mx-auto mt-8 !px-8 !py-4 text-base ${ring}`}>Menünü oluştur →</Link>
      </section>

      <footer className="border-t border-[var(--line)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-[var(--muted)] md:flex-row">
          <span className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--ink)]">
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md bg-[var(--accent)] text-xs font-extrabold text-white">K</span>
            Karemenü
          </span>
          <span>QR ile dijital menü · Baskı yok, anlık güncelleme</span>
        </div>
      </footer>
    </main>
  );
}
