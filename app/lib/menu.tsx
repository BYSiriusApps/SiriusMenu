export type Tag = "vegan" | "aci" | "yeni" | "glutensiz" | "sef";
export const TAGS: { key: Tag; label: string; emoji: string }[] = [
  { key: "yeni", label: "Yeni", emoji: "✨" },
  { key: "sef", label: "Şefin önerisi", emoji: "👨‍🍳" },
  { key: "aci", label: "Acı", emoji: "🌶️" },
  { key: "vegan", label: "Vegan", emoji: "🌱" },
  { key: "glutensiz", label: "Glutensiz", emoji: "🌾" },
];

export type Item = { id: number; name: string; desc: string; price: string; tags: Tag[]; image?: string; available?: boolean; code?: string };
export type Category = { id: number; name: string; items: Item[]; code?: string };
export type MenuData = { name: string; subtitle: string; theme: string; currency: string; categories: Category[] };

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
  monthly: { amount: 999, interval: "month" as const, imageQuota: 30, label: "Aylık" },
  yearly: { amount: 9990, interval: "year" as const, imageQuota: 40, label: "Yıllık" },
  imagePack: { amount: 400, credits: 20, label: "20'li görsel iyileştirme paketi" },
  overagePerImage: 25,
  bulk50: { amount: 999, credits: 50, label: "50 fotoğraf toplu iyileştirme" },
  bulk100: { amount: 1799, credits: 100, label: "100 fotoğraf toplu iyileştirme" },
};

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
];

export function money(p: string, cur = "₺"): string {
  const n = parseFloat(String(p).replace(",", "."));
  if (isNaN(n)) return String(p);
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)} ${cur}`;
}
