// Demo yemek fotoğraflarını Gemini ile üret ve menu-photos/demo/<slug>/ altına yükle.
// Sonra supabase/seed.sql içindeki Unsplash URL'lerini bucket URL'leriyle değiştirebilirsin.
//
// Kullanım:
//   GEMINI_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/generate-demo-photos.mjs
//
// Not: opsiyoneldir. Seed varsayılan olarak Unsplash görselleriyle de çalışır.

import { createClient } from "@supabase/supabase-js";

const KEY = process.env.GEMINI_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY || !SB_URL || !SB_KEY) { console.error("GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY gerekli"); process.exit(1); }

const MODEL = process.env.GEMINI_MODEL_IMAGE || "gemini-2.5-flash-image";
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DISHES = {
  "demo-kafe": ["flat white coffee", "pour over filter coffee", "iced cold brew coffee", "burnt basque cheesecake", "vegan walnut brownie", "avocado toast on sourdough"],
  "demo-restoran": ["turkish hummus with olive oil", "haydari yogurt dip with walnuts", "turkish sigara boregi cheese rolls", "adana kebab with grilled peppers", "grilled lamb chops with eggplant puree", "turkish cop sis lamb skewers", "kunefe with pistachio"],
  "demo-bar": ["smoky honey whiskey cocktail", "cucumber basil gin sour cocktail", "spicy paloma tequila cocktail", "glass of white wine", "glass of red wine", "artisan cheese plate with honey", "spiced roasted almonds in a bowl"],
};

async function gen(prompt) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text:
      `Professional appetizing food photography of "${prompt}", 45-degree angle, natural soft light, shallow depth of field, clean neutral background, restaurant menu style, square 1:1, no text, no watermark.` }] }] }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const d = await r.json();
  const part = (d?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
  if (!part) throw new Error("görsel yok");
  return { buf: Buffer.from(part.inlineData.data, "base64"), mime: part.inlineData.mimeType || "image/png" };
}

for (const [slug, dishes] of Object.entries(DISHES)) {
  for (let i = 0; i < dishes.length; i++) {
    const path = `demo/${slug}/${i + 1}.png`;
    try {
      const { buf, mime } = await gen(dishes[i]);
      const up = await sb.storage.from("menu-photos").upload(path, buf, { contentType: mime, upsert: true });
      if (up.error) throw up.error;
      console.log("OK", path, sb.storage.from("menu-photos").getPublicUrl(path).data.publicUrl);
    } catch (e) {
      console.error("FAIL", path, String(e));
    }
  }
}
