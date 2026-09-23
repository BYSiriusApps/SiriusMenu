import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { DEFAULT_MENU, type Category, type SocialLinks } from "@/app/lib/menu";
import { PanelBuilder } from "./PanelBuilder";

export default async function PanelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/panel");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, slug, name, subtitle, theme, currency, menu, logo_url, social, published, plan, image_quota, image_quota_used, qr_token")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/giris?next=/panel");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, plan_interval")
    .eq("restaurant_id", restaurant.id)
    .single();

  const categories = (restaurant.menu as Category[] | null) ?? DEFAULT_MENU.categories;

  return (
    <PanelBuilder
      restaurant={{
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        subtitle: restaurant.subtitle,
        theme: restaurant.theme,
        currency: restaurant.currency,
        categories,
        published: restaurant.published,
        plan: restaurant.plan ?? "trial",
        image_quota: restaurant.image_quota ?? 0,
        image_quota_used: restaurant.image_quota_used ?? 0,
        qr_token: restaurant.qr_token ?? "",
        logo_url: restaurant.logo_url ?? "",
        social: (restaurant.social as SocialLinks | null) ?? {},
      }}
      subscription={{
        status: subscription?.status ?? "trialing",
        current_period_end: subscription?.current_period_end ?? null,
        plan_interval: subscription?.plan_interval ?? null,
      }}
      businessNumber={process.env.WHATSAPP_BUSINESS_NUMBER ?? ""}
    />
  );
}
