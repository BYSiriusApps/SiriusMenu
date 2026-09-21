import { createServiceClient } from "./supabase/server";
import { enhanceFoodPhoto, isGeminiConfigured } from "./gemini";
import type { Category } from "./menu";

const BUCKET = "menu-photos";
const BATCH = 4;
const TIME_BUDGET_MS = 50_000;

// Vercel Hobby planı sadece günlük cron'a izin verir (bkz. vercel.json); bu yüzden kuyruk
// hem Stripe webhook'u tarafından ödeme sonrası anında (bkz. stripe/webhook), hem de
// günlük cron tarafından yedek/kurtarma olarak tetiklenir. Süre bütçesi dolana kadar
// birden fazla parti işler ki tek çağrıda kuyruk mümkün olduğunca boşalsın.
export async function processImageQueue() {
  if (!isGeminiConfigured()) return { skipped: "gemini" };

  const svc = createServiceClient();
  const start = Date.now();
  let done = 0;
  let hasMore = true;

  while (hasMore && Date.now() - start < TIME_BUDGET_MS) {
    const { data: jobs } = await svc
      .from("menu_images")
      .select("id, restaurant_id, item_key, original_path")
      .eq("status", "processing").eq("kind", "bulk")
      .order("created_at", { ascending: true })
      .limit(BATCH);

    if (!jobs?.length) break;
    hasMore = jobs.length === BATCH;

    for (const job of jobs) {
      try {
        const dl = await svc.storage.from(BUCKET).download(job.original_path);
        if (dl.error || !dl.data) throw new Error("orijinal okunamadı");
        const enh = await enhanceFoodPhoto(Buffer.from(await dl.data.arrayBuffer()).toString("base64"), dl.data.type || "image/jpeg");
        const enhPath = job.original_path.replace(/\/[^/]+$/, "/enhanced.png");
        await svc.storage.from(BUCKET).upload(enhPath, Buffer.from(enh.data, "base64"), { contentType: enh.mimeType, upsert: true });
        await svc.from("menu_images").update({ status: "enhanced", enhanced_path: enhPath }).eq("id", job.id);

        // Menüdeki ilgili ürüne bağla
        const { data: r } = await svc.from("restaurants").select("menu").eq("id", job.restaurant_id).single();
        const categories = (r?.menu as Category[] | null) ?? [];
        const [cid, iid] = job.item_key.split(":").map(Number);
        const item = categories.find((c) => c.id === cid)?.items.find((i) => i.id === iid);
        if (item) {
          const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(enhPath);
          item.image = pub.publicUrl;
          await svc.from("restaurants").update({ menu: categories }).eq("id", job.restaurant_id);
        }
        done++;
      } catch (e) {
        await svc.from("menu_images").update({ status: "failed", error: String(e) }).eq("id", job.id);
      }
    }
  }

  return { processed: done, remaining: hasMore };
}
