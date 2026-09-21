// Menü jsonb üzerinde intent uygulama — WhatsApp webhook + (ileride) panel ortak kullanır.
import type { Category, Item } from "./menu";
import type { MenuIntent } from "./gemini";

const norm = (s: string) =>
  (s || "")
    .toLocaleLowerCase("tr")
    .replace(/[İIı]/g, "i")
    .replace(/\s+/g, " ")
    .trim();

export function findItem(categories: Category[], name: string, category?: string):
  | { cat: Category; item: Item }
  | { matches: { cat: Category; item: Item }[] } {
  const n = norm(name);
  const cn = category ? norm(category) : null;
  const hits: { cat: Category; item: Item; score: number }[] = [];
  for (const cat of categories) {
    if (cn && !norm(cat.name).includes(cn)) continue;
    for (const item of cat.items) {
      const inm = norm(item.name);
      let score = 0;
      if (inm === n) score = 3;
      else if (inm.includes(n) || n.includes(inm)) score = 2;
      else if (n.split(" ").some((w) => w.length > 2 && inm.includes(w))) score = 1;
      if (score) hits.push({ cat, item, score });
    }
  }
  if (hits.length === 0) return { matches: [] };
  const best = Math.max(...hits.map((h) => h.score));
  const top = hits.filter((h) => h.score === best);
  if (top.length === 1) return { cat: top[0].cat, item: top[0].item };
  return { matches: top.map(({ cat, item }) => ({ cat, item })) };
}

const nextId = () => Math.floor(Math.random() * 1e9);

export type ApplyResult =
  | { ok: true; categories: Category[]; summary: string }
  | { ok: false; clarify: string };

/** intent'i menüye uygular. Saf: yeni categories dizisi döndürür. */
export function applyMenuIntent(categories: Category[], intent: MenuIntent): ApplyResult {
  const clone = (): Category[] => JSON.parse(JSON.stringify(categories));

  switch (intent.action) {
    case "clarify":
      return { ok: false, clarify: intent.question };
    case "none":
      return { ok: false, clarify: intent.reply };
    case "undo":
      return { ok: false, clarify: "Geri alma işlemi ayrı yürütülür." };

    case "add_item": {
      const next = clone();
      let cat = next.find((c) => norm(c.name).includes(norm(intent.category)));
      if (!cat) {
        cat = { id: nextId(), name: intent.category, items: [] };
        next.push(cat);
      }
      cat.items.push({
        id: nextId(),
        name: intent.item,
        desc: intent.desc || "",
        price: (intent.price || "").replace(",", "."),
        tags: [],
        available: true,
      });
      return { ok: true, categories: next, summary: `"${intent.item}" ${cat.name} kategorisine eklendi` + (intent.price ? ` (${intent.price})` : "") };
    }

    case "update_price":
    case "update_desc":
    case "rename":
    case "remove_item":
    case "set_available": {
      const found = findItem(categories, intent.item, "category" in intent ? intent.category : undefined);
      if ("matches" in found) {
        if (found.matches.length === 0) return { ok: false, clarify: `"${intent.item}" menüde bulunamadı. Tam adını yazar mısın?` };
        const names = found.matches.map((m) => `${m.item.name} (${m.cat.name})`).join(", ");
        return { ok: false, clarify: `Hangisini kastettin: ${names}?` };
      }
      const next = clone();
      const cat = next.find((c) => c.id === found.cat.id)!;
      const item = cat.items.find((i) => i.id === found.item.id)!;

      if (intent.action === "update_price") {
        item.price = String(intent.value).replace(",", ".");
        return { ok: true, categories: next, summary: `${item.name} fiyatı ${item.price} olarak güncellendi` };
      }
      if (intent.action === "update_desc") {
        item.desc = intent.value;
        return { ok: true, categories: next, summary: `${item.name} açıklaması güncellendi` };
      }
      if (intent.action === "rename") {
        const old = item.name;
        item.name = intent.value;
        return { ok: true, categories: next, summary: `"${old}" → "${item.name}" olarak değiştirildi` };
      }
      if (intent.action === "set_available") {
        item.available = intent.value;
        return { ok: true, categories: next, summary: `${item.name} ${intent.value ? "tekrar menüde" : "tükendi olarak işaretlendi"}` };
      }
      // remove_item
      cat.items = cat.items.filter((i) => i.id !== item.id);
      return { ok: true, categories: next, summary: `"${item.name}" menüden kaldırıldı` };
    }

    default:
      return { ok: false, clarify: "Bu işlemi yapamadım." };
  }
}

export function menuContext(categories: Category[]) {
  return categories.flatMap((c) =>
    c.items.map((i) => ({ category: c.name, name: i.name, price: i.price, available: i.available !== false })),
  );
}
