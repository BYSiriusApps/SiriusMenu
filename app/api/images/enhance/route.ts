import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "../../../lib/supabase/server";
import { enhanceFoodPhoto, isGeminiConfigured } from "../../../lib/gemini";

export const maxDuration = 60;

const BUCKET = "menu-photos";

export async function POST(req: Request) {
  if (!isGeminiConfigured()) return NextResponse.json({ error: "Görsel iyileştirme şu an kapalı." }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { itemKey, originalPath } = await req.json().catch(() => ({}));
  if (!itemKey || !originalPath) return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, image_quota, image_quota_used")
    .eq("user_id", user.id)
    .single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  if (!String(originalPath).startsWith(`${restaurant.id}/`)) {
    return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 403 });
  }

  if (restaurant.image_quota_used >= restaurant.image_quota) {
    return NextResponse.json(
      { error: "quota_exceeded", message: "Bu ayki görsel iyileştirme kotan doldu. Ek paket alarak devam edebilirsin.", quota: restaurant.image_quota, used: restaurant.image_quota_used },
      { status: 402 },
    );
  }

  const svc = createServiceClient();

  const dl = await svc.storage.from(BUCKET).download(originalPath);
  if (dl.error || !dl.data) return NextResponse.json({ error: "Orijinal görsel okunamadı" }, { status: 400 });
  const buf = Buffer.from(await dl.data.arrayBuffer());
  const mime = dl.data.type || "image/jpeg";

  const row = await svc.from("menu_images").insert({
    restaurant_id: restaurant.id, item_key: itemKey, original_path: originalPath, status: "processing", kind: "single",
  }).select("id").single();

  let enhanced;
  try {
    enhanced = await enhanceFoodPhoto(buf.toString("base64"), mime);
  } catch (e) {
    if (row.data) await svc.from("menu_images").update({ status: "failed", error: String(e) }).eq("id", row.data.id);
    return NextResponse.json({ error: "İyileştirme başarısız oldu, tekrar dene." }, { status: 502 });
  }

  const enhancedPath = originalPath.replace(/\/original\.\w+$/, "/enhanced.png").replace(/original\.\w+$/, "enhanced.png");
  const up = await svc.storage.from(BUCKET).upload(enhancedPath, Buffer.from(enhanced.data, "base64"), {
    contentType: enhanced.mimeType, upsert: true,
  });
  if (up.error) return NextResponse.json({ error: "Kaydedilemedi" }, { status: 500 });

  await svc.from("restaurants").update({ image_quota_used: restaurant.image_quota_used + 1 }).eq("id", restaurant.id);
  if (row.data) await svc.from("menu_images").update({ status: "enhanced", enhanced_path: enhancedPath, gemini_meta: { mime: enhanced.mimeType } }).eq("id", row.data.id);

  const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(enhancedPath);
  return NextResponse.json({
    url: `${pub.publicUrl}?v=${Date.now()}`,
    quota: restaurant.image_quota,
    used: restaurant.image_quota_used + 1,
  });
}
