import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { AccountSettings } from "./AccountSettings";

export default async function HesapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/panel/hesap");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  const { data: subscription } = restaurant
    ? await supabase
        .from("subscriptions")
        .select("status, plan_interval")
        .eq("restaurant_id", restaurant.id)
        .maybeSingle()
    : { data: null };

  return (
    <AccountSettings
      email={user.email ?? ""}
      restaurantName={restaurant?.name ?? ""}
      subscriptionStatus={subscription?.status ?? "trialing"}
      planInterval={subscription?.plan_interval ?? null}
    />
  );
}
