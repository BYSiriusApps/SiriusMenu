import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/server";
import { enhanceFoodPhoto, isGeminiConfigured } from "../../../lib/gemini";
import type { Category } from "../../../lib/menu";

export const maxDuration = 60;

const BUCKET = "menu-photos";
const BATCH = 4;

function authed(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}` || new URL(req.url).searchParams.get("secret") === secret;
}

async function run(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isGeminiConfigured()) return NextResponse.json({ skipped: "gemini" });

  const svc = createServiceClient();
  const { data: jobs } = await svc
    .from("menu_images")
    .select("id, restaurant_id, item_key, original_path")
    .eq("status", "processing").eq("kind", "bulk")
    .order("created_at", { ascending: true })
    .limit(BATCH);

  if (!jobs?.length) return NextResponse.json({ processed: 0 });

  let done = 0;
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
  return NextResponse.json({ processed: done, remaining: jobs.length === BATCH });
}

export const GET = run;
export const POST = run;
