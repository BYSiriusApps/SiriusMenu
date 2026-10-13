import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "../../../lib/supabase/server";
import type { Category, MenuLayout, SocialLinks, SocialPosition } from "../../../lib/menu";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function POST(req: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(supabase, req);
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, is_lifetime")
    .eq("user_id", user.id)
    .single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  const active = Boolean(sub && ACTIVE_STATUSES.has(sub.status));

  // Yayında kalan menü aboneliksiz de ücretsiz görüntülenmeye devam eder (bilinçli tasarım);
  // bu kontrol sadece panelden İÇERİK DÜZENLEMEYİ pasif abonelikte (Tek Seferlik alınmadıysa) kısıtlar.
  if (!active && !restaurant.is_lifetime) {
    return NextResponse.json(
      { error: "edit_locked", message: "Aboneliğin aktif değil. Menüyü düzenlemek için abone ol ya da Tek Seferlik (Ömür Boyu Menü) satın al." },
      { status: 402 },
    );
  }

  const data = body as {
    name?: string; subtitle?: string; theme?: string; currency?: string; categories?: Category[];
    logo?: string | null; social?: SocialLinks; socialPosition?: SocialPosition; font?: string | null;
    layout?: MenuLayout;
  };

  // Yalnızca isteğin gerçekten içerdiği alanlar güncellenir — Stüdyo gibi sadece
  // `categories` gönderen çağrılar logo/social/font gibi diğer alanları sıfırlamaz.
  const patch: Record<string, unknown> = {};
  if ("name" in data) patch.name = data.name;
  if ("subtitle" in data) patch.subtitle = data.subtitle;
  if ("theme" in data) patch.theme = data.theme;
  if ("currency" in data) patch.currency = data.currency;
  if ("categories" in data) patch.menu = data.categories;
  if ("logo" in data) patch.logo_url = data.logo || null;
  if ("social" in data) patch.social = data.social || {};
  if ("socialPosition" in data) patch.social_position = data.socialPosition || "top";
  if ("font" in data) patch.font = data.font || null;
  if ("layout" in data) patch.layout = data.layout === "coverflow" ? "coverflow" : "list";

  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Değişiklik yok" }, { status: 400 });

  await supabase.from("restaurants").update(patch).eq("id", restaurant.id);

  return NextResponse.json({ ok: true });
}
