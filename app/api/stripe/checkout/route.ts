import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { createClient } from "../../../lib/supabase/server";
import { PRICING, type Category } from "../../../lib/menu";

// Tek seferlik ürün -> Stripe price env eşlemesi
const ONE_OFF: Record<string, string | undefined> = {
  image_pack: process.env.STRIPE_PRICE_ID_IMAGE_PACK,
  bulk50: process.env.STRIPE_PRICE_ID_BULK50,
  bulk100: process.env.STRIPE_PRICE_ID_BULK100,
};

// Abonelik seviyesi + dönem -> Stripe price env eşlemesi
const RECURRING: Record<string, Record<string, string | undefined>> = {
  starter: { month: process.env.STRIPE_PRICE_ID_MONTHLY, year: process.env.STRIPE_PRICE_ID_YEARLY },
  pro: { month: process.env.STRIPE_PRICE_ID_MONTHLY_PRO, year: process.env.STRIPE_PRICE_ID_YEARLY_PRO },
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { interval, product, tier } = await req.json().catch(() => ({}));

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, menu")
    .eq("user_id", user.id)
    .single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, setup_fee_paid")
    .eq("restaurant_id", restaurant.id)
    .single();

  const origin = new URL(req.url).origin;
  const common = {
    customer: sub?.stripe_customer_id ?? undefined,
    customer_email: sub?.stripe_customer_id ? undefined : user.email,
    client_reference_id: restaurant.id,
    metadata: { restaurant_id: restaurant.id },
  } satisfies Partial<Stripe.Checkout.SessionCreateParams>;

  // Tek Seferlik (Ömür Boyu Menü) — ürün sayısına göre ek blok fiyatı eklenir
  if (product === "lifetime") {
    const base = process.env.STRIPE_PRICE_ID_LIFETIME;
    if (!base) return NextResponse.json({ error: "Geçersiz ürün" }, { status: 400 });
    const categories = (restaurant.menu as Category[] | null) ?? [];
    const itemCount = categories.reduce((n, c) => n + c.items.length, 0);
    const extraBlocks = Math.max(0, Math.ceil((itemCount - PRICING.lifetime.items) / PRICING.lifetime.extraBlockItems));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{ price: base, quantity: 1 }];
    if (extraBlocks > 0) {
      const extra = process.env.STRIPE_PRICE_ID_LIFETIME_EXTRA_BLOCK;
      if (!extra) return NextResponse.json({ error: "Ek ürün blok fiyatı tanımlı değil" }, { status: 500 });
      line_items.push({ price: extra, quantity: extraBlocks });
    }

    const session = await stripe.checkout.sessions.create({
      ...common,
      mode: "payment",
      line_items,
      metadata: { restaurant_id: restaurant.id, product: "lifetime", item_count: String(itemCount) },
      success_url: `${origin}/panel?purchase=success`,
      cancel_url: `${origin}/panel?purchase=cancel`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Diğer tek seferlik satın almalar (görsel paketi / toplu iyileştirme)
  if (product) {
    const price = ONE_OFF[product as string];
    if (!price) return NextResponse.json({ error: "Geçersiz ürün" }, { status: 400 });
    const session = await stripe.checkout.sessions.create({
      ...common,
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      metadata: { restaurant_id: restaurant.id, product: String(product) },
      success_url: `${origin}/panel?purchase=success`,
      cancel_url: `${origin}/panel?purchase=cancel`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Abonelik (Başlangıç/Profesyonel × aylık/yıllık) + ilk kez ise kurulum ücreti
  const planTier = tier === "pro" ? "pro" : "starter";
  const planInterval = interval === "year" ? "year" : "month";
  const recurring = RECURRING[planTier][planInterval];
  if (!recurring) return NextResponse.json({ error: "Fiyat tanımlı değil" }, { status: 500 });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{ price: recurring, quantity: 1 }];
  if (!sub?.setup_fee_paid && process.env.STRIPE_PRICE_ID_SETUP) {
    line_items.push({ price: process.env.STRIPE_PRICE_ID_SETUP, quantity: 1 });
  }

  const session = await stripe.checkout.sessions.create({
    ...common,
    mode: "subscription",
    line_items,
    subscription_data: { metadata: { restaurant_id: restaurant.id, plan_interval: planInterval, tier: planTier } },
    success_url: `${origin}/panel?checkout=success`,
    cancel_url: `${origin}/panel?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
