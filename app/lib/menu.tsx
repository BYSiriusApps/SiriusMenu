export type Tag = "vegan" | "aci" | "yeni" | "glutensiz" | "sef";
export const TAGS: { key: Tag; label: string; emoji: string }[] = [
  { key: "yeni", label: "Yeni", emoji: "✨" },
  { key: "sef", label: "Şefin önerisi", emoji: "👨‍🍳" },
  { key: "aci", label: "Acı", emoji: "🌶️" },
  { key: "vegan", label: "Vegan", emoji: "🌱" },
  { key: "glutensiz", label: "Glutensiz", emoji: "🌾" },
];

export type Item = { id: number; name: string; desc: string; price: string; tags: Tag[] };
export type Category = { id: number; name: string; items: Item[] };
export type MenuData = { name: string; subtitle: string; theme: string; currency: string; categories: Category[] };

export const CURRENCIES = ["₺", "$", "€"];

export const DEFAULT_MENU: MenuData = {
  name: "Kahve Durağı",
  subtitle: "Üçüncü nesil kahve & ev yapımı tatlılar",
  theme: "kafe",
  currency: "₺",
  categories: [
    {
      id: 1, name: "Kahveler", items: [
        { id: 1, name: "Flat White", desc: "Çift shot espresso, kadifemsi süt", price: "95", tags: ["sef"] },
        { id: 2, name: "Filtre Kahve", desc: "Günün çekirdeği, V60", price: "80", tags: [] },
        { id: 3, name: "Soğuk Demleme", desc: "18 saat demlenmiş, buzlu", price: "105", tags: ["yeni"] },
      ],
    },
    {
      id: 2, name: "Tatlılar", items: [
        { id: 4, name: "San Sebastian", desc: "Yanık cheesecake, tuzlu karamel", price: "140", tags: ["sef"] },
        { id: 5, name: "Vegan Brownie", desc: "Çikolatalı, cevizli", price: "110", tags: ["vegan", "glutensiz"] },
      ],
    },
    {
      id: 3, name: "Atıştırmalıklar", items: [
        { id: 6, name: "Avokado Tost", desc: "Ekşi maya ekmek, kiraz domates, acı sos", price: "160", tags: ["aci"] },
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
];

export function money(p: string, cur = "₺"): string {
  const n = parseFloat(String(p).replace(",", "."));
  if (isNaN(n)) return String(p);
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)} ${cur}`;
}
