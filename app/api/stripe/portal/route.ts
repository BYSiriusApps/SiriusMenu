import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("restaurant_id", restaurant.id)
    .single();
  if (!sub?.stripe_customer_id) return NextResponse.json({ error: "Önce abonelik başlatmalısın" }, { status: 400 });

  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/panel`,
  });

  return NextResponse.json({ url: session.url });
}
