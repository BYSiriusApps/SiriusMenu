import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { createClient, createServiceClient } from "../../../lib/supabase/server";
import { LEGAL_DOC_VERSION } from "../../../lib/legal/versions";
import { sendPurchaseConsentMail } from "../../../lib/mailer";
import { PRICING, SERVICE_NEEDS_AI_NOTICE, SERVICE_SCENARIOS, normalizeTier, serviceQuote, type Category } from "../../../lib/menu";

// Tek seferlik ürün -> Stripe price env eşlemesi
const ONE_OFF: Record<string, string | undefined> = {
  image_pack: process.env.STRIPE_PRICE_ID_IMAGE_PACK,
  bulk50: process.env.STRIPE_PRICE_ID_BULK50,
  bulk100: process.env.STRIPE_PRICE_ID_BULK100,
};

// Abonelik seviyesi + dönem -> Stripe price env eşlemesi
const RECURRING: Record<string, Record<string, string | undefined>> = {
  basic: { month: process.env.STRIPE_PRICE_ID_MONTHLY_BASIC, year: process.env.STRIPE_PRICE_ID_YEARLY_BASIC },
  starter: { month: process.env.STRIPE_PRICE_ID_MONTHLY, year: process.env.STRIPE_PRICE_ID_YEARLY },
  pro: { month: process.env.STRIPE_PRICE_ID_MONTHLY_PRO, year: process.env.STRIPE_PRICE_ID_YEARLY_PRO },
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { interval, product, tier, consent } = body;

  // Mesafeli satış: ödeme öncesi elektronik sözleşme onayı zorunlu.
  if (consent !== true) {
    return NextResponse.json({ error: "Satın alma sözleşmelerini onaylamalısın" }, { status: 400 });
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, menu")
    .eq("user_id", user.id)
    .single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  // Onayın kanıtı: sürüm, zaman, IP ve tarayıcı bilgisiyle kalıcı kayıt.
  await createServiceClient().from("purchase_consents").insert({
    restaurant_id: restaurant.id,
    user_id: user.id,
    product: product ?? "subscription",
    tier: product ? null : normalizeTier(tier),
    plan_interval: product ? null : interval === "year" ? "year" : "month",
    doc_version: LEGAL_DOC_VERSION,
    accepted_prelim: true,
    accepted_contract: true,
    accepted_waiver: true,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    user_agent: req.headers.get("user-agent"),
  });
  if (user.email) {
    await sendPurchaseConsentMail({
      to: user.email,
      origin: new URL(req.url).origin,
      productLabel: [product ?? "subscription", !product && tier ? tier : null, !product && interval ? interval : null].filter(Boolean).join(" / "),
      docVersion: LEGAL_DOC_VERSION,
      at: new Date(),
    });
  }

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

  // Anahtar teslim kurulum hizmeti. Tutar her zaman sunucuda serviceQuote() ile hesaplanır
  // (istemciden gelen fiyat kullanılmaz); sabit Stripe price'ı gerekmez, price_data kullanılır.
  if (product === "service") {
    const scenario = SERVICE_SCENARIOS.find((s) => s === body.scenario);
    const itemCount = Math.floor(Number(body.itemCount));
    if (!scenario || !Number.isFinite(itemCount) || itemCount < 1 || itemCount > 1000) {
      return NextResponse.json({ error: "Geçersiz hizmet seçimi" }, { status: 400 });
    }
    // Telif/hak beyanı her senaryoda, "görsel temsilidir" onayı üretilmiş görsel içeren senaryolarda zorunlu.
    if (body.ack?.rights !== true || (SERVICE_NEEDS_AI_NOTICE[scenario] && body.ack?.ai !== true)) {
      return NextResponse.json({ error: "Hizmet onaylarını işaretlemelisin" }, { status: 400 });
    }
    const amount = serviceQuote(scenario, itemCount);
    const session = await stripe.checkout.sessions.create({
      ...common,
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "try",
          unit_amount: amount * 100,
          product_data: { name: `Anahtar teslim kurulum (${scenario}, ${itemCount} ürün)` },
        },
      }],
      metadata: { restaurant_id: restaurant.id, product: "service", scenario, item_count: String(itemCount), ack_ai: String(body.ack?.ai === true) },
      success_url: `${origin}/panel?purchase=success`,
      cancel_url: `${origin}/panel?purchase=cancel`,
    });
    return NextResponse.json({ url: session.url });
  }

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

  // Abonelik (Temel/Full/Profesyonel × aylık/yıllık) + ilk kez ise kurulum ücreti
  const planTier = normalizeTier(tier);
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
