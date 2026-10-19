"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

/** Landing: WhatsApp konuşması mesaj mesaj belirir, bitince başa sarar. prefers-reduced-motion'da hepsi sabit görünür. */
export function WhatsAppChat({ messages, title, typingLabel, onlineLabel }: { messages: string[]; title: string; typingLabel: string; onlineLabel: string }) {
  const [shown, setShown] = useState(messages.length);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let n = 0;
    const tick = () => {
      if (!alive) return;
      if (n >= messages.length) {
        timer = setTimeout(() => { n = 0; setShown(0); setTyping(false); timer = setTimeout(tick, 900); }, 3600);
        return;
      }
      const incoming = n % 2 === 1; // 0,2: kullanıcı yazar; 1,3: asistan cevaplar
      if (incoming) {
        setTyping(true);
        timer = setTimeout(() => { setTyping(false); n++; setShown(n); timer = setTimeout(tick, 1500); }, 1100);
      } else {
        n++; setShown(n); timer = setTimeout(tick, 1300);
      }
    };
    setShown(0);
    timer = setTimeout(tick, 600);
    return () => { alive = false; clearTimeout(timer); };
  }, [messages]);

  return (
    <div className="wa-card relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1512] shadow-[0_40px_90px_-30px_rgba(31,138,82,.55)]">
      <div className="flex items-center gap-3 bg-[#1f8a52] px-5 py-4 text-white">
        <Image src="/icon.png" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 rounded-full" />
        <div>
          <p className="text-base font-bold leading-tight">{title}</p>
          <p className="text-xs text-white/80">{typing ? typingLabel : onlineLabel}</p>
        </div>
      </div>
      <div className="flex min-h-[340px] flex-col gap-3 bg-[#0b1210] p-5">
        {messages.slice(0, shown).map((m, i) => (
          <div
            key={i}
            className={`wa-msg max-w-[88%] rounded-2xl px-4 py-3 text-base leading-snug ${
              i % 2 === 0 ? "ml-auto rounded-tr-sm bg-[#1f8a52] text-white" : "rounded-tl-sm bg-[#25302b] text-[#e8f0ec]"
            }`}
          >
            {m}
          </div>
        ))}
        {typing && (
          <div className="wa-msg flex w-16 gap-1.5 rounded-2xl rounded-tl-sm bg-[#25302b] px-4 py-3.5" aria-hidden="true">
            <span className="wa-dot" /><span className="wa-dot" style={{ animationDelay: ".15s" }} /><span className="wa-dot" style={{ animationDelay: ".3s" }} />
          </div>
        )}
      </div>
    </div>
  );
}
