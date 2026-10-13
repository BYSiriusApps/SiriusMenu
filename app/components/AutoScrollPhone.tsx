"use client";
import { useEffect, useRef, useState } from "react";
import { MenuView, Phone } from "@/app/lib/MenuView";
import type { MenuData } from "@/app/lib/menu";

/**
 * Telefon içindeki menü kendiliğinden kategori kategori kayar (Mezeler → Yemekler → Tatlılar ...).
 * - loop: sona gelince başa dönüp sürekli devam eder (hero).
 * - onDone: sona gelince bir kez çağrılır (vitrin bir sonraki temaya geçer).
 * - playing: false iken durur; kullanıcı telefona dokunur/üzerine gelirse de durur, serbest kaydırabilir.
 * - reset: true iken menü en başa sarılır.
 * 3D vitrin menülerinde ürünler de kendiliğinden döner. prefers-reduced-motion'da otomatik hareket yok.
 */
export function AutoScrollPhone({ menu, playing = true, loop = false, reset = false, onDone }: {
  menu: MenuData; playing?: boolean; loop?: boolean; reset?: boolean; onDone?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const active = playing && !hover && inView && !reduced;
  const dwell = menu.layout === "coverflow" ? 5400 : 3400;

  useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!reset) return;
    ref.current?.querySelector<HTMLElement>("[data-phone-scroll]")?.scrollTo({ top: 0 });
  }, [reset]);

  useEffect(() => {
    if (!active) return;
    const sc = ref.current?.querySelector<HTMLElement>("[data-phone-scroll]");
    if (!sc) return;
    const cats = Array.from(sc.querySelectorAll<HTMLElement>("[data-cat]"));
    if (cats.length === 0) return;
    const topOf = (el: HTMLElement) => el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 10;

    // Kaldığı kategoriden devam et (duraklatma sonrası başa sıçramasın).
    let i = Math.max(0, cats.findIndex((c) => topOf(c) >= sc.scrollTop - 40));
    if (sc.scrollTop < 20) i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (i < cats.length) {
        sc.scrollTo({ top: i === 0 ? 0 : topOf(cats[i]), behavior: "smooth" });
        i++;
        timer = setTimeout(step, dwell);
      } else if (loop) {
        i = 0;
        step();
      } else {
        doneRef.current?.();
      }
    };
    timer = setTimeout(step, i === 0 && sc.scrollTop < 20 ? 900 : 0);
    return () => clearTimeout(timer);
  }, [active, loop, dwell]);

  return (
    <div ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <Phone><MenuView menu={menu} autoplay={active} /></Phone>
    </div>
  );
}
