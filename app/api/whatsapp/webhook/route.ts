import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/server";
import { parseMenuCommand, enhanceFoodPhoto, isGeminiConfigured, type MenuIntent } from "../../../lib/gemini";
import { applyMenuIntent, findItem, menuContext } from "../../../lib/menu-ops";
import { sendText, mediaBase64, extractText, jidToE164 } from "../../../lib/evolution";
import type { Category } from "../../../lib/menu";

export const maxDuration = 60;

const BUCKET = "menu-photos";

function authed(req: Request): boolean {
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!secret) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret || req.headers.get("x-webhook-secret") === secret;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const payload = await req.json().catch(() => null);
  const event = payload?.event as string | undefined;
  const data = payload?.data;
  if (event !== "messages.upsert" || !data || data?.key?.fromMe) return NextResponse.json({ ok: true });

  const waMessageId: string = data.key?.id ?? "";
  const from = jidToE164(data.key?.remoteJid ?? "");
  const text = extractText(data.message);
  const hasImage = Boolean(data.message?.imageMessage);
  if (!from) return NextResponse.json({ ok: true });

  const svc = createServiceClient();

  // Idempotency
  const ins = await svc.from("whatsapp_messages").insert({
    wa_message_id: waMessageId || `${from}-${Date.now()}`,
    wa_from: from, direction: "in", body: text, applied: false,
  }).select("id").single();
  if (ins.error) return NextResponse.json({ ok: true }); // zaten işlenmiş

  const reply = async (msg: string, applied = false) => {
    await sendText(from, msg);
    await svc.from("whatsapp_messages").insert({ wa_from: from, direction: "out", body: msg });
    if (applied) await svc.from("whatsapp_messages").update({ applied: true }).eq("id", ins.data!.id);
  };

  // Whitelist: bu numara doğrulanmış bir yetkili numara mı? (Patron/Müdür vb.)
  const { data: authRow } = await svc
    .from("whatsapp_authorized_numbers")
    .select("restaurant_id")
    .eq("phone", from)
    .eq("verified", true)
    .maybeSingle();

  let r: { id: string; slug: string; name: string; menu: unknown; image_quota: number; image_quota_used: number } | null = null;
  if (authRow) {
    const { data } = await svc
      .from("restaurants")
      .select("id, slug, name, menu, image_quota, image_quota_used")
      .eq("id", authRow.restaurant_id)
      .single();
    r = data ?? null;
  }

  // Doğrulama akışı: tanımsız/doğrulanmamış numaradan gelen mesajlar reddedilir, sadece 6 haneli kod kabul edilir.
  if (!r) {
    const code = text.replace(/[^\d]/g, "");
    if (code.length === 6) {
      const { data: pending } = await svc
        .from("whatsapp_authorized_numbers")
        .select("id, restaurant_id")
        .eq("phone", from)
        .eq("verify_code", code)
        .eq("verified", false)
        .maybeSingle();
      if (pending) {
        await svc.from("whatsapp_authorized_numbers").update({ verified: true, verify_code: null }).eq("id", pending.id);
        await svc.from("wa_sessions").upsert({ restaurant_id: pending.restaurant_id, phone: from, context: {} });
        await reply(`✅ WhatsApp bağlandı! Artık menünü buradan güncelleyebilirsin.\n\nÖrnekler:\n• "Latte fiyatını 120 yap"\n• "San Sebastian tükendi"\n• "Tatlılar'a Tiramisu 130 ekle"\n• Fotoğraf gönder, hangi ürün olduğunu yaz`);
        return NextResponse.json({ ok: true });
      }
    }
    // Tanımsız numara: sessizce reddet, menüye asla dokunma.
    await reply("Bu numara SiriusMenu'de tanımlı/yetkili bir numara değil. Panelden \"WhatsApp bağla\" ile numaranı ekleyip aldığın 6 haneli kodu buraya yaz.");
    return NextResponse.json({ ok: true });
  }

  const categories = (r.menu as Category[] | null) ?? [];
  const { data: sess } = await svc.from("wa_sessions").select("context").eq("restaurant_id", r.id).maybeSingle();
  const ctx = (sess?.context ?? {}) as { pendingImagePath?: string; pendingImageName?: string };

  const setCtx = (c: object) => svc.from("wa_sessions").upsert({ restaurant_id: r.id, phone: from, context: c });

  const attachAndEnhance = async (itemName: string, originalPath: string) => {
    const f = findItem(categories, itemName);
    if ("matches" in f) {
      await setCtx({ pendingImagePath: originalPath, pendingImageName: itemName });
      await reply(f.matches.length ? `Birden fazla eşleşme var: ${f.matches.map((m) => m.item.name).join(", ")}. Hangisi?` : `"${itemName}" menüde yok. Tam adını yazar mısın?`);
      return;
    }
    const itemKey = `${f.cat.id}:${f.item.id}`;
    const { data: pubOrig } = svc.storage.from(BUCKET).getPublicUrl(originalPath);
    let finalUrl = `${pubOrig.publicUrl}?v=${Date.now()}`;

    if (isGeminiConfigured() && r.image_quota_used < r.image_quota) {
      const dl = await svc.storage.from(BUCKET).download(originalPath);
      if (dl.data) {
        try {
          const enh = await enhanceFoodPhoto(Buffer.from(await dl.data.arrayBuffer()).toString("base64"), dl.data.type || "image/jpeg");
          const enhPath = originalPath.replace(/\/[^/]+$/, "/enhanced.png");
          await svc.storage.from(BUCKET).upload(enhPath, Buffer.from(enh.data, "base64"), { contentType: enh.mimeType, upsert: true });
          await svc.from("restaurants").update({ image_quota_used: r.image_quota_used + 1 }).eq("id", r.id);
          await svc.from("menu_images").insert({ restaurant_id: r.id, item_key: itemKey, original_path: originalPath, enhanced_path: enhPath, status: "enhanced", kind: "single" });
          const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(enhPath);
          finalUrl = `${pub.publicUrl}?v=${Date.now()}`;
        } catch { /* orijinali kullan */ }
      }
    }

    const before = JSON.parse(JSON.stringify(categories));
    const cat = categories.find((c) => c.id === f.cat.id)!;
    const item = cat.items.find((i) => i.id === f.item.id)!;
    item.image = finalUrl.split("?")[0];
    await svc.from("restaurants").update({ menu: categories }).eq("id", r.id);
    await svc.from("menu_change_log").insert({ restaurant_id: r.id, source: "whatsapp", diff: { before, after: categories, summary: `${item.name} görseli güncellendi` } });
    await setCtx({});
    const quotaNote = r.image_quota_used < r.image_quota ? " (iyileştirildi)" : " (kota dolu, orijinal kullanıldı)";
    await reply(`📸 ${item.name} fotoğrafı menüye eklendi${quotaNote}.`, true);
  };

  // 1) Fotoğraf geldi
  if (hasImage) {
    const media = await mediaBase64(data.message ? { key: data.key, message: data.message } : data);
    if (!media) { await reply("Fotoğrafı alamadım, tekrar gönderir misin?"); return NextResponse.json({ ok: true }); }
    const ext = media.mimetype.includes("png") ? "png" : "jpg";
    const path = `${r.id}/wa/${Date.now()}/original.${ext}`;
    await svc.storage.from(BUCKET).upload(path, Buffer.from(media.base64, "base64"), { contentType: media.mimetype, upsert: true });
    if (text) { await attachAndEnhance(text, path); return NextResponse.json({ ok: true }); }
    await setCtx({ pendingImagePath: path });
    await reply("Fotoğrafı aldım 👍 Hangi ürün için? Ürün adını yaz.");
    return NextResponse.json({ ok: true });
  }

  // 2) Bekleyen fotoğraf varsa, bu mesaj ürün adıdır
  if (ctx.pendingImagePath && text) {
    await attachAndEnhance(text, ctx.pendingImagePath);
    return NextResponse.json({ ok: true });
  }

  if (!text) return NextResponse.json({ ok: true });

  // 3) Metin komutu
  let intent: MenuIntent;
  try {
    intent = await parseMenuCommand(text, menuContext(categories));
  } catch {
    await reply("Şu an güncelleme yapamıyorum, birazdan tekrar dene.");
    return NextResponse.json({ ok: true });
  }

  if (intent.action === "undo") {
    const { data: last } = await svc
      .from("menu_change_log")
      .select("id, diff")
      .eq("restaurant_id", r.id).eq("undone", false)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!last) { await reply("Geri alınacak bir değişiklik yok."); return NextResponse.json({ ok: true }); }
    const before = (last.diff as { before: Category[] }).before;
    await svc.from("restaurants").update({ menu: before }).eq("id", r.id);
    await svc.from("menu_change_log").update({ undone: true }).eq("id", last.id);
    await reply("↩️ Son değişiklik geri alındı.", true);
    return NextResponse.json({ ok: true });
  }

  const result = applyMenuIntent(categories, intent);
  if (!result.ok) { await reply(result.clarify); return NextResponse.json({ ok: true }); }

  await svc.from("restaurants").update({ menu: result.categories }).eq("id", r.id);
  await svc.from("menu_change_log").insert({
    restaurant_id: r.id, source: "whatsapp",
    diff: { before: categories, after: result.categories, summary: result.summary },
  });
  await svc.from("whatsapp_messages").update({ intent }).eq("id", ins.data!.id);
  await reply(`✅ ${result.summary}.\nMenü anında güncellendi. Geri almak için "geri" yaz.`, true);
  return NextResponse.json({ ok: true });
}
