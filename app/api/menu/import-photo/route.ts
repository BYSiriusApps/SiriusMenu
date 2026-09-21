import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { parseMenuPhoto, isGeminiConfigured } from "../../../lib/gemini";

export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  if (!isGeminiConfigured()) return NextResponse.json({ error: "Fotoğraftan menü okuma şu an kapalı." }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { image, mimeType } = await req.json().catch(() => ({}));
  if (!image || typeof image !== "string" || !mimeType || typeof mimeType !== "string" || !mimeType.startsWith("image/")) {
    return NextResponse.json({ error: "Eksik ya da geçersiz görsel" }, { status: 400 });
  }
  if (image.length * 0.75 > MAX_BYTES) return NextResponse.json({ error: "Görsel çok büyük (en fazla 8MB)" }, { status: 413 });

  try {
    const result = await parseMenuPhoto(image, mimeType);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Fotoğraf okunamadı, tekrar dene." }, { status: 502 });
  }
}
