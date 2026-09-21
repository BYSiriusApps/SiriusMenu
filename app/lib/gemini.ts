// Gemini yardımcıları — menü komut ayrıştırma + yemek fotoğrafı iyileştirme/üretme.
// Ham REST (yeni bağımlılık yok), aciklama/route.ts ile aynı stil.

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const TEXT_MODEL = process.env.GEMINI_MODEL_TEXT || "gemini-2.5-flash";
const IMAGE_MODEL = process.env.GEMINI_MODEL_IMAGE || "gemini-2.5-flash-image";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

function key(): string {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY tanımlı değil");
  return k;
}

type Part = { text?: string; inlineData?: { mimeType: string; data: string } };

async function generateContent(model: string, parts: Part[], opts?: { json?: boolean }): Promise<{ text: string; images: { data: string; mimeType: string }[] }> {
  const r = await fetch(`${BASE}/${model}:generateContent?key=${key()}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: opts?.json ? { responseMimeType: "application/json" } : undefined,
    }),
  });
  if (!r.ok) throw new Error(`Gemini ${model}: ${r.status} ${await r.text().catch(() => "")}`);
  const d = await r.json();
  const outParts: Part[] = d?.candidates?.[0]?.content?.parts ?? [];
  const text = outParts.map((p) => p.text).filter(Boolean).join("").trim();
  const images = outParts
    .filter((p) => p.inlineData?.data)
    .map((p) => ({ data: p.inlineData!.data, mimeType: p.inlineData!.mimeType || "image/png" }));
  return { text, images };
}

// === Menü komut ayrıştırma (WhatsApp) ===

export type MenuIntent =
  | { action: "update_price"; category?: string; item: string; value: string }
  | { action: "update_desc"; category?: string; item: string; value: string }
  | { action: "rename"; category?: string; item: string; value: string }
  | { action: "add_item"; category: string; item: string; price?: string; desc?: string }
  | { action: "remove_item"; category?: string; item: string }
  | { action: "set_available"; category?: string; item: string; value: boolean }
  | { action: "clarify"; question: string }
  | { action: "undo" }
  | { action: "none"; reply: string };

type MenuContextItem = { category: string; name: string; price: string; available: boolean };

export async function parseMenuCommand(text: string, menu: MenuContextItem[]): Promise<MenuIntent> {
  const list = menu.map((m) => `- [${m.category}] ${m.name} — ${m.price}${m.available ? "" : " (tükendi)"}`).join("\n");
  const prompt = `Bir restoran menüsünü WhatsApp mesajlarıyla güncelleyen asistansın. İşletmenin mesajını oku ve TEK bir JSON nesnesi döndür.

Mevcut menü:
${list || "(boş)"}

İşletmenin mesajı: "${text.replace(/"/g, "'")}"

Kurallar:
- Fiyat güncelleme: {"action":"update_price","item":"<ürün adı>","value":"<sayı>","category":"<varsa>"}
- Açıklama güncelleme: {"action":"update_desc","item":"...","value":"..."}
- Ürün adını değiştirme: {"action":"rename","item":"<eski>","value":"<yeni>"}
- Ürün ekleme: {"action":"add_item","category":"<kategori>","item":"<ad>","price":"<sayı>","desc":"<opsiyonel>"}
- Ürün silme: {"action":"remove_item","item":"..."}
- Tükendi / tekrar var: {"action":"set_available","item":"...","value":false|true}
- "geri" / "geri al" / "iptal": {"action":"undo"}
- Ürün menüde net değilse ya da birden çok eşleşiyorsa: {"action":"clarify","question":"<kısa Türkçe soru>"}
- Menüyle ilgisiz mesaj: {"action":"none","reply":"<kısa yardımcı Türkçe yanıt>"}
- item alanına menüdeki adı olabildiğince aynen yaz.
SADECE JSON döndür.`;
  const { text: out } = await generateContent(TEXT_MODEL, [{ text: prompt }], { json: true });
  try {
    return JSON.parse(out) as MenuIntent;
  } catch {
    return { action: "none", reply: "Mesajını anlayamadım. Örnek: \"Latte fiyatını 120 yap\" ya da \"San Sebastian tükendi\"." };
  }
}

export async function describeItem(name: string): Promise<string> {
  const { text } = await generateContent(TEXT_MODEL, [{
    text: `"${name}" adlı menü ürünü için kısa, iştah açıcı bir Türkçe açıklama yaz (en fazla 8-10 kelime). SADECE açıklamayı döndür.`,
  }]);
  return text.replace(/^["“]|["”.]$/g, "").trim();
}

// === Yemek fotoğrafı ===

const ENHANCE_PROMPT =
  "Enhance this food photo for a restaurant digital menu. Improve lighting to look bright and natural, " +
  "clean up and neutralize the background, boost color vibrancy and freshness of the food without looking artificial, " +
  "increase sharpness, remove clutter and reflections, keep the dish and plating exactly the same. " +
  "Return a clean, appetizing square (1:1) image.";

// "hd": standart iyileştirmeye ek olarak azami detay/keskinlik isteyen daha güçlü prompt.
// Not: Gemini görsel modeli gerçek 4K çözünürlük garanti etmez (native çıktı ~1-2K civarı);
// bu mod modelin izin verdiği en yüksek detay/netlikte üretim ister, gerçek upscale değildir.
const ENHANCE_PROMPT_HD =
  ENHANCE_PROMPT +
  " Render at the highest possible detail and sharpness the model supports: crisp textures, fine detail on the food surface, " +
  "no blur or softness, vivid but natural color depth, studio-quality food photography look.";

export type EnhanceQuality = "standard" | "hd";

export async function enhanceFoodPhoto(base64: string, mimeType: string, quality: EnhanceQuality = "standard"): Promise<{ data: string; mimeType: string }> {
  const { images } = await generateContent(IMAGE_MODEL, [
    { text: quality === "hd" ? ENHANCE_PROMPT_HD : ENHANCE_PROMPT },
    { inlineData: { mimeType, data: base64 } },
  ]);
  if (!images[0]) throw new Error("Gemini görsel döndürmedi");
  return images[0];
}

// === Fotoğraftan menü okuma (kağıt/el yazması/eski katalog) ===

export type ParsedMenu = { categories: { name: string; items: { name: string; desc?: string; price?: string }[] }[] };

const IMPORT_PROMPT = `Bu görsel bir restoran/kafe menüsü fotoğrafı (el yazması not, eski kağıt menü, broşür ya da katalog olabilir).
Görseldeki TÜM kategori başlıklarını, ürün adlarını, varsa kısa açıklama/içerik bilgisini ve fiyatları oku.
Kurallar:
- Kategori başlığı görselde yoksa "Genel" kullan.
- price alanına SADECE sayı yaz (₺, TL, $ gibi sembol/birim ekleme), okunamıyorsa boş bırak.
- Emin olamadığın harfleri en makul haliyle tamamla, uydurma ürün ekleme.
- Görsel bir menüye benzemiyorsa categories'i boş dizi döndür.
SADECE şu JSON formatında döndür: {"categories":[{"name":"...","items":[{"name":"...","desc":"...","price":"..."}]}]}`;

export async function parseMenuPhoto(base64: string, mimeType: string): Promise<ParsedMenu> {
  const { text } = await generateContent(TEXT_MODEL, [
    { text: IMPORT_PROMPT },
    { inlineData: { mimeType, data: base64 } },
  ], { json: true });
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed?.categories)) return { categories: [] };
    return parsed as ParsedMenu;
  } catch {
    return { categories: [] };
  }
}

export async function generateFoodPhoto(dish: string): Promise<{ data: string; mimeType: string }> {
  const { images } = await generateContent(IMAGE_MODEL, [{
    text: `Professional appetizing food photography of "${dish}", top-down or 45-degree angle, natural soft light, ` +
      `shallow depth of field, clean neutral background, restaurant menu style, square 1:1 framing, no text, no watermark.`,
  }]);
  if (!images[0]) throw new Error("Gemini görsel üretmedi");
  return images[0];
}
