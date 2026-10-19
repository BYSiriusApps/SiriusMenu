export type Tag = "vegan" | "aci" | "yeni" | "glutensiz" | "sef";
export const TAGS: { key: Tag; label: string; emoji: string }[] = [
  { key: "yeni", label: "Yeni", emoji: "✨" },
  { key: "sef", label: "Şefin önerisi", emoji: "👨‍🍳" },
  { key: "aci", label: "Acı", emoji: "🌶️" },
  { key: "vegan", label: "Vegan", emoji: "🌱" },
  { key: "glutensiz", label: "Glutensiz", emoji: "🌾" },
];

/** Yaygın alerjenler (AB 14 alerjen listesine uyumlu). Menüde ürün altında rozet olarak gösterilir. */
export type Allergen = "gluten" | "sut" | "yumurta" | "fistik" | "kuruyemis" | "soya" | "balik" | "kabuklu" | "yumusakca" | "susam" | "kereviz" | "hardal" | "lupin" | "sulfit";
export const ALLERGENS: { key: Allergen; label: string; emoji: string }[] = [
  { key: "gluten", label: "Gluten", emoji: "🌾" },
  { key: "sut", label: "Süt", emoji: "🥛" },
  { key: "yumurta", label: "Yumurta", emoji: "🥚" },
  { key: "fistik", label: "Yer fıstığı", emoji: "🥜" },
  { key: "kuruyemis", label: "Sert kabuklu yemiş", emoji: "🌰" },
  { key: "soya", label: "Soya", emoji: "🫘" },
  { key: "balik", label: "Balık", emoji: "🐟" },
  { key: "kabuklu", label: "Kabuklu deniz ürünü", emoji: "🦐" },
  { key: "yumusakca", label: "Yumuşakça", emoji: "🐚" },
  { key: "susam", label: "Susam", emoji: "⚪" },
  { key: "kereviz", label: "Kereviz", emoji: "🥬" },
  { key: "hardal", label: "Hardal", emoji: "🟡" },
  { key: "lupin", label: "Acı bakla (lupin)", emoji: "🌼" },
  { key: "sulfit", label: "Sülfit", emoji: "🍷" },
];

/** Porsiyon / boyut seçeneği (ör. Küçük 80, Büyük 110). Ürünün ana fiyatına ek olarak listelenir. */
export type Variant = { name: string; price: string };

export type Item = { id: number; name: string; desc: string; price: string; tags: Tag[]; image?: string; available?: boolean; code?: string;
  /** Görsel yapay zekâ ile üretildi / temsilidir: menüde "Görsel temsilidir" etiketi gösterilir. */
  aiImage?: boolean;
  /** İsteğe bağlı: ürünün içerdiği alerjenler (ALLERGENS anahtarları). */
  allergens?: Allergen[];
  /** İsteğe bağlı: porsiyon başına kalori (kcal). */
  calories?: number;
  /** İsteğe bağlı: gramaj / porsiyon bilgisi, serbest metin (ör. "250 g", "33 cl"). */
  portion?: string;
  /** İsteğe bağlı: porsiyon / boyut seçenekleri ve fiyatları. */
  variants?: Variant[] };
export type Category = { id: number; name: string; items: Item[]; code?: string };

const TAG_KEYS = new Set<string>(TAGS.map((t) => t.key));
const ALLERGEN_KEYS = new Set<string>(ALLERGENS.map((a) => a.key));
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

/**
 * Sunucuya gelen menü verisini doğrular ve temizler (istemciye güvenilmez): bilinmeyen alanlar atılır,
 * metinler kısaltılır, etiket/alerjen anahtarları beyaz listeyle sınırlanır. Geçersiz yapıda `null` döner.
 */
export function sanitizeCategories(input: unknown): Category[] | null {
  if (!Array.isArray(input) || input.length > 100) return null;
  const out: Category[] = [];
  for (const c of input) {
    if (!c || typeof c !== "object" || !Array.isArray((c as Category).items) || (c as Category).items.length > 2000) return null;
    const cat = c as Category;
    const items: Item[] = [];
    for (const raw of cat.items) {
      if (!raw || typeof raw !== "object") return null;
      const it = raw as Item;
      const item: Item = {
        id: Number.isFinite(it.id) ? it.id : 0,
        name: str(it.name, 120), desc: str(it.desc, 600), price: str(it.price, 24),
        tags: Array.isArray(it.tags) ? it.tags.filter((x) => TAG_KEYS.has(x)) : [],
      };
      if (typeof it.image === "string") item.image = it.image.slice(0, 2000);
      if (typeof it.available === "boolean") item.available = it.available;
      if (typeof it.code === "string") item.code = it.code.slice(0, 12);
      if (typeof it.aiImage === "boolean") item.aiImage = it.aiImage;
      if (Array.isArray(it.allergens)) item.allergens = it.allergens.filter((x) => ALLERGEN_KEYS.has(x));
      if (typeof it.calories === "number" && Number.isFinite(it.calories) && it.calories >= 0) item.calories = Math.min(Math.round(it.calories), 20000);
      if (typeof it.portion === "string" && it.portion.trim()) item.portion = it.portion.slice(0, 40);
      if (Array.isArray(it.variants)) {
        const vs = it.variants.slice(0, 12).filter((v) => v && typeof v === "object").map((v) => ({ name: str(v.name, 40), price: str(v.price, 24) }));
        if (vs.length) item.variants = vs;
      }
      items.push(item);
    }
    out.push({ id: Number.isFinite(cat.id) ? cat.id : 0, name: str(cat.name, 120), items, ...(typeof cat.code === "string" ? { code: cat.code.slice(0, 12) } : {}) });
  }
  return out;
}

/** İşletmenin kendi sosyal medya / web sitesi bilgileri — hepsi isteğe bağlı. */
export type SocialLinks = { instagram?: string; facebook?: string; tiktok?: string; website?: string };
export const SOCIAL_PLATFORMS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/kullaniciadi" },
  { key: "facebook", label: "Facebook", placeholder: "facebook.com/sayfaadi" },
  { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@kullaniciadi" },
  { key: "website", label: "Web sitesi", placeholder: "https://siteniz.com" },
];

/** Sosyal medya ikonlarının menüde gösterileceği konum (etiketler panelde i18n "SocialPositions" ile çevrilir). */
export type SocialPosition = "top" | "bottom" | "bottom-left" | "bottom-right";
export const SOCIAL_POSITIONS: { key: SocialPosition }[] = [
  { key: "top" }, { key: "bottom" }, { key: "bottom-left" }, { key: "bottom-right" },
];

/** Girilen kullanıcı adı/handle/URL'i tıklanabilir bir bağlantıya çevirir. */
export function socialHref(key: keyof SocialLinks, value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (v.includes(".")) return `https://${v}`;
  const handle = v.replace(/^@/, "");
  if (key === "tiktok") return `https://tiktok.com/@${handle}`;
  if (key === "instagram") return `https://instagram.com/${handle}`;
  if (key === "facebook") return `https://facebook.com/${handle}`;
  return `https://${handle}`;
}

/**
 * Menü başlığı/kategori/fiyat yazı tipi. Her tema bir varsayılan fontla gelir (bkz. THEMES),
 * kullanıcı isterse burada listelenenlerden birini seçip temanın fontunu geçersiz kılabilir.
 */
export type FontOption = { key: string; cssVar: string };
export const FONTS: FontOption[] = [
  { key: "fraunces", cssVar: "var(--m-fraunces)" },
  { key: "space", cssVar: "var(--m-space)" },
  { key: "playfair", cssVar: "var(--m-playfair)" },
  { key: "poppins", cssVar: "var(--m-poppins)" },
];

export type MenuLayout = "list" | "coverflow";
export const MENU_LAYOUTS: MenuLayout[] = ["list", "coverflow"];

export type MenuData = {
  name: string; subtitle: string; theme: string; currency: string; categories: Category[];
  /** İşletmenin kendi logosu (SiriusMenu marka yazısından ayrı, isteğe bağlı). */
  logo?: string;
  /** İsteğe bağlı: seçilip doldurulan sosyal medya / web sitesi bilgileri. */
  social?: SocialLinks;
  /** İsteğe bağlı: sosyal medya ikonlarının konumu (bkz. SOCIAL_POSITIONS). Boşsa "top". */
  socialPosition?: SocialPosition;
  /** İsteğe bağlı: FONTS içindeki bir anahtar. Boşsa temanın varsayılan fontu kullanılır. */
  font?: string;
  /** İsteğe bağlı: menü düzeni. Boşsa "list" (düz liste); "coverflow" = 3D kaydırmalı vitrin. */
  layout?: MenuLayout;
};

/**
 * Muhasebe usulü ürün kodu: kategori 2 haneli sıra numarası alır (01, 02...),
 * ürün o kategori içinde 2 haneli sıra numarası alır → kod = kategori + ürün (ör. "0101", "0102", "0201").
 * Kodlar bir kez atanır ve kalıcıdır (ekleme/silme başka kodları değiştirmez).
 */
export function nextCategoryCode(categories: Category[]): string {
  const used = categories.map((c) => parseInt(c.code || "0", 10)).filter((n) => !isNaN(n));
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return String(next).padStart(2, "0");
}

export function nextItemCode(category: Category): string {
  const catCode = category.code || "00";
  const used = category.items
    .map((it) => (it.code && it.code.startsWith(catCode) ? parseInt(it.code.slice(catCode.length), 10) : NaN))
    .filter((n) => !isNaN(n));
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return catCode + String(next).padStart(2, "0");
}

/** Eski kayıtlarda eksik olan kategori/ürün kodlarını, sırayı bozmadan geriye dönük tamamlar. */
export function backfillCodes(categories: Category[]): Category[] {
  let changed = false;
  const seenCats: Category[] = [];
  const result = categories.map((c) => {
    let code = c.code;
    if (!code) { changed = true; code = nextCategoryCode(seenCats); }
    const withCode: Category = { ...c, code, items: [] };
    seenCats.push(withCode);

    const seenItems: Category = { ...withCode, items: [] };
    withCode.items = c.items.map((it) => {
      let itCode = it.code;
      if (!itCode) { changed = true; itCode = nextItemCode(seenItems); }
      const item = { ...it, code: itCode };
      seenItems.items.push(item);
      return item;
    });
    return withCode;
  });
  return changed ? result : categories;
}

export const CURRENCIES = ["₺", "$", "€"];

/** Fiyatlama (taslak; Stripe price'larıyla eşleşir). Landing + panel ortak kullanır. */
export const PRICING = {
  setup: { amount: 2500, label: "Kurulum (tek seferlik)" },
  // Temel: yalnızca QR menü + panel düzenleme. WhatsApp ile güncelleme ve aylık AI görsel kotası YOK (kota 0, ek paket alınabilir).
  monthlyBasic: { amount: 499, interval: "month" as const, imageQuota: 0, label: "Aylık (Temel)" },
  yearlyBasic: { amount: 4990, interval: "year" as const, imageQuota: 0, label: "Yıllık (Temel)" },
  monthly: { amount: 999, interval: "month" as const, imageQuota: 30, label: "Aylık (Full)" },
  yearly: { amount: 9990, interval: "year" as const, imageQuota: 40, label: "Yıllık (Full)" },
  monthlyPro: { amount: 1499, interval: "month" as const, imageQuota: 60, label: "Aylık (Profesyonel)" },
  yearlyPro: { amount: 14990, interval: "year" as const, imageQuota: 80, label: "Yıllık (Profesyonel)" },
  imagePack: { amount: 400, credits: 20, label: "20'li görsel iyileştirme paketi" },
  overagePerImage: 25,
  bulk50: { amount: 999, credits: 50, label: "50 fotoğraf toplu iyileştirme" },
  bulk100: { amount: 1999, credits: 100, label: "100 fotoğraf toplu iyileştirme" },
  // Tek seferlik, abonelik gerektirmeyen kalıcı düzenleme hakkı. WhatsApp otomasyonu ve AI
  // görsel kotası dahil değil (bunlar sürekli maliyet taşıyor) — ayrıca satın alınabilir.
  lifetime: { amount: 12000, items: 50, extraBlockAmount: 4000, extraBlockItems: 50, label: "Tek Seferlik (Ömür Boyu Menü)" },
  // Menüyü SiriusMenu'nün kurduğu yönetilen hizmet (tek seferlik, aboneliğin/ömür boyu paketin ÜSTÜNE).
  // Fiyat = ürün sayısına göre kademeli taban + senaryoya göre ürün başı ek iş. Bkz. serviceQuote().
  service: {
    tiers: [
      { upTo: 50, amount: 3500 },
      { upTo: 100, amount: 5500 },
      { upTo: 150, amount: 7500 },
    ],
    extraBlockAmount: 2000, // 150 ürünün üstünde her başlayan 50'lik blok
    extraBlockItems: 50,
    perItem: { enhance: 20, generate: 45, write: 35 },
  },
};

/** Abonelik seviyeleri. Bilinmeyen/boş değer "starter" sayılır (eski kayıtlar). */
export type Tier = "basic" | "starter" | "pro";
export const TIERS: Tier[] = ["basic", "starter", "pro"];
export function normalizeTier(v: unknown): Tier {
  return v === "basic" || v === "pro" ? v : "starter";
}
/** Abonelik fiyatı (TL) — landing, panel ve ödeme aynı kaynaktan okur. */
export function tierPrice(tier: Tier, interval: "month" | "year"): number {
  const P = PRICING;
  const t = { basic: [P.monthlyBasic, P.yearlyBasic], starter: [P.monthly, P.yearly], pro: [P.monthlyPro, P.yearlyPro] }[tier];
  return (interval === "year" ? t[1] : t[0]).amount;
}
/** WhatsApp ile menü güncelleme Temel planda yoktur. */
export const tierHasWhatsapp = (tier: unknown): boolean => normalizeTier(tier) !== "basic";

/**
 * Anahtar teslim kurulum senaryoları (müşterinin elindekine göre iş yükü farklıdır):
 * migrate = menü + fotoğraf hazır, sadece dijitale taşınır; enhance = fotoğraflar var, iyileştirilir;
 * generate = menü metni var, fotoğraf yok, görseller üretilir; scratch = müşteri yalnızca bilgi verir,
 * ürün listesi/açıklama/görsel baştan hazırlanır.
 */
export type ServiceScenario = "migrate" | "enhance" | "generate" | "scratch";
export const SERVICE_SCENARIOS: ServiceScenario[] = ["migrate", "enhance", "generate", "scratch"];
/** Üretilmiş (yapay zekâ) görsel içeren senaryolar: "görsel temsilidir" onayı ve etiketi gerekir. */
export const SERVICE_NEEDS_AI_NOTICE: Record<ServiceScenario, boolean> = { migrate: false, enhance: false, generate: true, scratch: true };

/** Hangi sabit Stripe price'ı (taban kademe) + kaç adet "ek blok" kullanılacağını döndürür.
 *  Checkout'ta sabit price ID'lere eşlenir; ürün başı senaryo ek ücreti (bkz. serviceQuote)
 *  buna dahil değildir, o ayrı bir dinamik price_data satırı olarak eklenir. */
export function serviceBaseLineItems(itemCount: number): { tier: 1 | 2 | 3; extraBlocks: number } {
  const n = Math.max(1, Math.floor(itemCount));
  const { tiers, extraBlockItems } = PRICING.service;
  if (n <= tiers[0].upTo) return { tier: 1, extraBlocks: 0 };
  if (n <= tiers[1].upTo) return { tier: 2, extraBlocks: 0 };
  const extraBlocks = n <= tiers[2].upTo ? 0 : Math.ceil((n - tiers[2].upTo) / extraBlockItems);
  return { tier: 3, extraBlocks };
}

export function serviceBase(itemCount: number): number {
  const { tier, extraBlocks } = serviceBaseLineItems(itemCount);
  const { tiers, extraBlockAmount } = PRICING.service;
  return tiers[tier - 1].amount + extraBlocks * extraBlockAmount;
}

/** Hizmet fiyatı (TL, tam sayı). Sunucu ve arayüz aynı fonksiyonu kullanır; ödeme tutarı sunucuda hesaplanır. */
export function serviceQuote(scenario: ServiceScenario, itemCount: number): number {
  const n = Math.max(1, Math.floor(itemCount));
  const p = PRICING.service.perItem;
  const extra = scenario === "enhance" ? p.enhance * n
    : scenario === "generate" ? p.generate * n
    : scenario === "scratch" ? (p.write + p.generate) * n
    : 0;
  return serviceBase(n) + extra;
}

export const DEFAULT_MENU: MenuData = {
  name: "Kahve Durağı",
  subtitle: "Üçüncü nesil kahve & ev yapımı tatlılar",
  theme: "kafe",
  currency: "₺",
  categories: [
    {
      id: 1, name: "Kahveler", items: [
        { id: 1, name: "Flat White", desc: "Çift shot espresso, kadifemsi süt", price: "95", tags: ["sef"], image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=70" },
        { id: 2, name: "Filtre Kahve", desc: "Günün çekirdeği, V60", price: "80", tags: [], image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70" },
        { id: 3, name: "Soğuk Demleme", desc: "18 saat demlenmiş, buzlu", price: "105", tags: ["yeni"] },
      ],
    },
    {
      id: 2, name: "Tatlılar", items: [
        { id: 4, name: "San Sebastian", desc: "Yanık cheesecake, tuzlu karamel", price: "140", tags: ["sef"], image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=70" },
        { id: 5, name: "Vegan Brownie", desc: "Çikolatalı, cevizli", price: "110", tags: ["vegan", "glutensiz"] },
      ],
    },
    {
      id: 3, name: "Atıştırmalıklar", items: [
        { id: 6, name: "Avokado Tost", desc: "Ekşi maya ekmek, kiraz domates, acı sos", price: "160", tags: ["aci"], image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=70" },
      ],
    },
  ],
};

export type Theme = { key: string; label: string; font: string; bg: string; ink: string; sub: string; accent: string; card: string; dark?: boolean };
export const THEMES: Theme[] = [
  { key: "kafe", label: "Kafe", font: "var(--m-fraunces)", bg: "#f4ece0", card: "#fffaf2", ink: "#2c2117", sub: "#8a7a66", accent: "#b5722e" },
  { key: "klasik", label: "Klasik", font: "var(--m-fraunces)", bg: "#faf8f4", card: "#ffffff", ink: "#232020", sub: "#8b857c", accent: "#9c6b2f" },
  { key: "modern", label: "Modern", font: "var(--m-space)", bg: "#f2f3f5", card: "#ffffff", ink: "#171922", sub: "#727787", accent: "#e0891b" },
  { key: "gece", label: "Gece", font: "var(--m-fraunces)", bg: "#17140f", card: "#211c15", ink: "#f3ecdf", sub: "#a89a84", accent: "#e3b25a", dark: true },
  { key: "bahce", label: "Bahçe", font: "var(--m-fraunces)", bg: "#eef2e6", card: "#f8faf3", ink: "#20261c", sub: "#7c8a70", accent: "#5b7f4b" },
  { key: "deniz", label: "Deniz", font: "var(--m-space)", bg: "#eef4f6", card: "#ffffff", ink: "#152b33", sub: "#6b8892", accent: "#1f7a8c" },
];

export function money(p: string, cur = "₺"): string {
  const n = parseFloat(String(p).replace(",", "."));
  if (isNaN(n)) return String(p);
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)} ${cur}`;
}
