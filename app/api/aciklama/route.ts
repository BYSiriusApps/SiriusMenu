import { NextResponse } from "next/server";

const DEMO: Record<string, string> = {
  latte: "Espresso ve buharda ısıtılmış kadifemsi süt",
  cheesecake: "Kremsi doku, taze meyve sosuyla",
};
function demoFor(name: string): string {
  const n = (name || "").toLowerCase();
  for (const k in DEMO) if (n.includes(k)) return DEMO[k];
  return "Taze malzemelerle, özenle hazırlanır";
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  const { name } = await req.json().catch(() => ({ name: "" }));

  if (!key || !name) return NextResponse.json({ demo: true, desc: demoFor(name) });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 80,
      messages: [{
        role: "user",
        content: `"${name}" adlı menü ürünü için kısa, iştah açıcı bir Türkçe açıklama yaz (en fazla 8-10 kelime, malzeme/karakter vurgusu). SADECE açıklamayı döndür, tırnak veya nokta ekleme.`,
      }],
    }),
  });
  if (!r.ok) return NextResponse.json({ demo: true, desc: demoFor(name) });
  const d = await r.json();
  const desc = (d?.content?.[0]?.text ?? "").trim().replace(/^["“]|["”.]$/g, "");
  return NextResponse.json({ demo: false, desc: desc || demoFor(name) });
}
