"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { SERVICE_NEEDS_AI_NOTICE, SERVICE_SCENARIOS, serviceQuote, type ServiceScenario } from "@/app/lib/menu";

/** Anahtar teslim kurulum hizmeti: senaryo + ürün sayısı seçilir, tutar sunucuda yeniden hesaplanır. */
export default function ServiceCard({ defaultItemCount, askConsent }: { defaultItemCount: number; askConsent: () => Promise<boolean> }) {
  const t = useTranslations("Panel.builder");
  const [scenario, setScenario] = useState<ServiceScenario>("migrate");
  const [count, setCount] = useState(Math.max(10, defaultItemCount));
  const [aiAck, setAiAck] = useState(false);
  const [rightsAck, setRightsAck] = useState(false);
  const [loading, setLoading] = useState(false);

  const needsAi = SERVICE_NEEDS_AI_NOTICE[scenario];
  const amount = serviceQuote(scenario, count);

  const buy = async () => {
    if (!rightsAck || (needsAi && !aiAck)) { alert(t("serviceAckRequired")); return; }
    if (!(await askConsent())) return;
    setLoading(true);
    const r = await fetch("/api/stripe/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: "service", scenario, itemCount: count, ack: { rights: true, ai: needsAi ? true : false }, consent: true }),
    });
    const d = await r.json();
    setLoading(false);
    if (d.url) window.location.href = d.url;
    else alert(d.error || t("errCheckoutFailed"));
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 16 }}>
      <div className="tag">{t("serviceTitle")}</div>
      <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>{t("serviceDesc")}</p>

      <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>{t("serviceScenario")}</div>
      <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
        {SERVICE_SCENARIOS.map((s) => (
          <label key={s} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, cursor: "pointer" }}>
            <input type="radio" name="service-scenario" checked={scenario === s} onChange={() => setScenario(s)} style={{ marginTop: 3 }} />
            {t(`scenario_${s}`)}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13 }}>{t("serviceItemCount")}</span>
        <input className="field" type="number" min={1} max={1000} style={{ maxWidth: 100 }} value={count}
          onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value, 10) || 1)))} />
      </div>

      <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700 }}>{t("serviceTotal", { amount: amount.toLocaleString("tr-TR") })}</div>

      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={rightsAck} onChange={(e) => setRightsAck(e.target.checked)} style={{ marginTop: 2 }} />
          {t("serviceRightsAck")}
        </label>
        {needsAi && (
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--muted)", cursor: "pointer" }}>
            <input type="checkbox" checked={aiAck} onChange={(e) => setAiAck(e.target.checked)} style={{ marginTop: 2 }} />
            {t("serviceAiAck")}
          </label>
        )}
      </div>

      <button className="btn btn-accent" style={{ marginTop: 12, padding: "8px 14px", fontSize: 13.5 }} disabled={loading} onClick={buy}>
        {t("serviceBuy")}
      </button>
    </div>
  );
}
