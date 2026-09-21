import Link from "next/link";

export const LEGAL_PAGES = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/iade-iptal-politikasi", label: "İade & İptal Politikası" },
];

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <nav className="border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-sm font-extrabold text-white">S</span>
            SiriusMenu
          </Link>
          <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--ink)]">← Ana sayfa</Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Yasal</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-balance md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Son güncelleme: {updated}</p>

        <div className="legal-prose mt-10">{children}</div>
      </article>

      <footer className="border-t border-[var(--line)] py-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            {LEGAL_PAGES.map((p) => (
              <Link key={p.href} href={p.href} className="transition hover:text-[var(--ink)]">{p.label}</Link>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
            SiriusMenu, BY Sirius Group AI and Technology Co. Ltd. (Companies House No: 17142392) tarafından işletilmektedir.
            Adres: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom · E-posta:{" "}
            <a href="mailto:info@bysirius.com" className="underline">info@bysirius.com</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
