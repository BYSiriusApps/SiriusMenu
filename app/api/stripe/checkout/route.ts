import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { createClient } from "../../../lib/supabase/server";

// Tek seferlik ürün -> Stripe price env eşlemesi
const ONE_OFF: Record<string, string | undefined> = {
  image_pack: process.env.STRIPE_PRICE_ID_IMAGE_PACK,
  bulk50: process.env.STRIPE_PRICE_ID_BULK50,
  bulk100: process.env.STRIPE_PRICE_ID_BULK100,
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { interval, product } = await req.json().catch(() => ({}));

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
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

  // Tek seferlik satın alma (görsel paketi / toplu iyileştirme)
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

  // Abonelik (aylık / yıllık) + ilk kez ise kurulum ücreti
  const recurring = interval === "year" ? process.env.STRIPE_PRICE_ID_YEARLY : process.env.STRIPE_PRICE_ID_MONTHLY;
  if (!recurring) return NextResponse.json({ error: "Fiyat tanımlı değil" }, { status: 500 });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{ price: recurring, quantity: 1 }];
  if (!sub?.setup_fee_paid && process.env.STRIPE_PRICE_ID_SETUP) {
    line_items.push({ price: process.env.STRIPE_PRICE_ID_SETUP, quantity: 1 });
  }

  const session = await stripe.checkout.sessions.create({
    ...common,
    mode: "subscription",
    line_items,
    subscription_data: { metadata: { restaurant_id: restaurant.id, plan_interval: interval === "year" ? "year" : "month" } },
    success_url: `${origin}/panel?checkout=success`,
    cancel_url: `${origin}/panel?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
