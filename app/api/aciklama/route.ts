import { NextResponse } from "next/server";
import { describeItem, isGeminiConfigured } from "../../lib/gemini";

const DEMO: Record<string, string> = {
  latte: "Espresso ve buharda ısıtılmış kadifemsi süt",
  cheesecake: "Kremsi doku, taze meyve sosuyla",
};
function demoFor(name: string): string {
  const n = (name || "").toLowerCase();
  for (const k in DEMO) if (n.includes(k)) return DEMO[k];
  return "Taze malzemelerle, özenle hazırlanır";
}

// Bu uç nokta oturum açmadan (landing/ücretsiz deneme) çağrılabiliyor ve ücretli bir
// üçüncü taraf API'sine (Gemini) istek atıyor. Kimlik doğrulama olmadığı için en azından
// girdi uzunluğunu sınırla ve IP başına kaba bir hız sınırı uygula; aksi halde herkes bu uç
// noktayı serbest biçimli bir LLM proxy'si gibi kullanıp API bütçesini tüketebilir.
const MAX_NAME_LEN = 60;
const RATE_LIMIT = 20; // istek / pencere
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: Request) {
  const { name: rawName } = await req.json().catch(() => ({ name: "" }));
  const name = typeof rawName === "string" ? rawName.slice(0, MAX_NAME_LEN).trim() : "";

  if (!name) return NextResponse.json({ demo: true, desc: demoFor(name) });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ demo: true, desc: demoFor(name) });

  if (!isGeminiConfigured()) return NextResponse.json({ demo: true, desc: demoFor(name) });

  try {
    const desc = await describeItem(name);
    return NextResponse.json({ demo: false, desc: desc || demoFor(name) });
  } catch {
    return NextResponse.json({ demo: true, desc: demoFor(name) });
  }
}
