"use client";
import { useEffect } from "react";

const stagger = (els: HTMLElement[], step: number, max: number) =>
  els.forEach((el, i) => el.style.setProperty("--fx-delay", `${Math.min(i, max) * step}ms`));

/**
 * Sayfadaki bölümlere kaydırdıkça beliren (fade + yukarı kayma) anlatım efekti.
 * JS yoksa içerik gizlenmez: sınıflar yalnızca bağlandıktan sonra eklenir.
 * Izgara çocukları sırayla (stagger) gelir. prefers-reduced-motion'da hiçbir şey yapmaz.
 */
export function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets: HTMLElement[] = [];

    const collect = (parent: HTMLElement) => {
      const kids = Array.from(parent.children) as HTMLElement[];
      const parts: HTMLElement[] = [];
      kids.forEach((k) => {
        if (k.matches(".grid") && k.children.length) {
          const cells = Array.from(k.children) as HTMLElement[];
          stagger(cells, 90, 8);
          targets.push(...cells);
        } else {
          parts.push(k);
        }
      });
      stagger(parts, 70, 4);
      targets.push(...parts);
    };

    document.querySelectorAll<HTMLElement>("main > section:not(:first-of-type)").forEach((sec) => {
      // Bölüm tek bir kapsayıcıdan oluşuyorsa (ör. max-w sarmalayıcı) içindeki katmanı canlandır.
      if (sec.children.length === 1 && !sec.matches("[data-fx-whole]")) collect(sec.children[0] as HTMLElement);
      else collect(sec);
    });

    targets.forEach((t) => t.classList.add("fx"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("fx-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return null;
}
