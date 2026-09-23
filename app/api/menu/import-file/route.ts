import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { parseMenuText, isGeminiConfigured } from "../../../lib/gemini";
import { detectImportExt, extractImportText, FileImportError, MAX_IMPORT_FILE_BYTES } from "../../../lib/file-extract";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isGeminiConfigured()) return NextResponse.json({ error: "Dosyadan menü okuma şu an kapalı." }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ error: "Dosya boş." }, { status: 400 });
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    return NextResponse.json({ error: "Dosya çok büyük (en fazla 5MB)." }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    const ext = detectImportExt(file.name || "", buf);
    const text = await extractImportText(ext, buf);
    if (!text.trim() || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Dosyadan okunabilir metin çıkarılamadı. Taranmış/görsel bir PDF ise 'Fotoğraftan menü yükle' seçeneğini dene." },
        { status: 422 },
      );
    }
    const result = await parseMenuText(text);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof FileImportError) return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Dosya okunamadı, tekrar dene." }, { status: 502 });
  }
}
