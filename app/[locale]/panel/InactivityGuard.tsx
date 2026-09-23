"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/app/lib/supabase/client";

// Panelde 30 dk hiçbir işlem (fare/klavye/dokunma/kaydırma) yapılmazsa son
// 60 saniye için bir uyarı gösterilir; onaylanmazsa oturum kendiliğinden kapanır.
// Sekme/link tıklamaları (ör. "SiriusMenu" yazısı, "Ana sayfa") bilinçli çıkış
// SAYILMAZ — sadece hareketsizlik oturumu kapatır, gezinme değil.
const INACTIVE_MS = 30 * 60 * 1000;
const WARNING_MS = 60 * 1000;

export function InactivityGuard() {
  const t = useTranslations("Panel.inactivity");
  const router = useRouter();
  const [warning, setWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_MS / 1000);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningRef = useRef(false);

  const clearAll = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (tickTimer.current) clearInterval(tickTimer.current);
  };

  const signOutNow = useCallback(async () => {
    clearAll();
    await createClient().auth.signOut();
    router.push("/giris?expired=1");
    router.refresh();
  }, [router]);

  const arm = useCallback(() => {
    clearAll();
    warningRef.current = false;
    setWarning(false);
    idleTimer.current = setTimeout(() => {
      warningRef.current = true;
      setWarning(true);
      setCountdown(WARNING_MS / 1000);
      tickTimer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            signOutNow();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, INACTIVE_MS - WARNING_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signOutNow]);

  useEffect(() => {
    const onActivity = () => arm();
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    arm();
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arm]);

  if (!warning) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ padding: 24, maxWidth: 360, textAlign: "center", background: "var(--paper)" }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{t("title")}</p>
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 16 }}>{t("body", { seconds: countdown })}</p>
        <button className="btn btn-accent" style={{ width: "100%" }} onClick={arm}>{t("stay")}</button>
      </div>
    </div>
  );
}
