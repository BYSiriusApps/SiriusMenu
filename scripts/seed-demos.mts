// Tek seferlik: /m/demo-* canlı sayfalarını DEMOS (app/lib/demos.ts) içeriğiyle besler.
// Kullanım: npx tsx scripts/seed-demos.mts  (kökte .env.local'daki SUPABASE_SERVICE_ROLE_KEY kullanılır)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { DEMOS } from "../app/lib/demos";

function loadEnvLocal() {
  const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY eksik (.env.local)");

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function ensureDemoUser(slug: string) {
  const email = `${slug}@demo.siriusmenu.internal`;
  const password = crypto.randomUUID() + "Aa1!";

  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = list.users.find((u) => u.email === email);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  return data.user.id;
}

async function main() {
  for (const demo of DEMOS) {
    const userId = await ensureDemoUser(demo.slug);

    // handle_new_user() tetikleyicisi bu kullanıcı için otomatik bir restaurants satırı oluşturdu
    // (slug e-posta'nın @ öncesinden türetilir, demo.slug ile eşleşir). Şimdi asıl içerikle güncelleyip yayınlıyoruz.
    const { error } = await admin
      .from("restaurants")
      .update({
        name: demo.menu.name,
        subtitle: demo.menu.subtitle,
        theme: demo.menu.theme,
        currency: demo.menu.currency,
        menu: demo.menu.categories,
        published: true,
      })
      .eq("user_id", userId);

    if (error) throw error;
    console.log(`✓ ${demo.slug} yayınlandı (user ${userId})`);
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
