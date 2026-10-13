"use client";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Satın alma öncesi elektronik sözleşme onayı (clickwrap). `ask()` kullanıcı üç kutuyu da
// işaretleyip onaylarsa true döner; onay sunucuda /api/stripe/checkout içinde kayda alınır.
export function usePurchaseConsent() {
  const [open, setOpen] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const ask = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpen(true);
      }),
    [],
  );

  const close = (ok: boolean) => {
    setOpen(false);
    resolver.current?.(ok);
    resolver.current = null;
  };

  return { ask, modal: open ? <ConsentDialog onClose={close} /> : null };
}

function ConsentDialog({ onClose }: { onClose: (ok: boolean) => void }) {
  const t = useTranslations("Purchase");
  const [prelim, setPrelim] = useState(false);
  const [contract, setContract] = useState(false);
  const [waiver, setWaiver] = useState(false);

  const link = (href: string) => (chunks: React.ReactNode) => (
    <Link href={href} target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>{chunks}</Link>
  );
  const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "grid", placeItems: "center", padding: 16, zIndex: 100 }}
    >
      <div className="card" style={{ padding: 24, maxWidth: 440, width: "100%", display: "grid", gap: 14, background: "var(--bg)" }}>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>{t("title")}</h2>
        <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("intro")}</p>
        <label style={row}>
          <input type="checkbox" checked={prelim} onChange={(e) => setPrelim(e.target.checked)} style={{ marginTop: 3 }} />
          <span>{t.rich("prelim", { l: link("/mesafeli-satis-sozlesmesi#on-bilgilendirme"), l2: link("/iade-iptal-politikasi") })}</span>
        </label>
        <label style={row}>
          <input type="checkbox" checked={contract} onChange={(e) => setContract(e.target.checked)} style={{ marginTop: 3 }} />
          <span>{t.rich("contract", { l: link("/mesafeli-satis-sozlesmesi") })}</span>
        </label>
        <label style={row}>
          <input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} style={{ marginTop: 3 }} />
          <span>{t("waiver")}</span>
        </label>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>{t("cancel")}</button>
          <button type="button" className="btn btn-accent" disabled={!prelim || !contract || !waiver} onClick={() => onClose(true)}>{t("continue")}</button>
        </div>
      </div>
    </div>
  );
}
