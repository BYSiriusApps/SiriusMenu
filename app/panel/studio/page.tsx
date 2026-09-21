import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { DEFAULT_MENU, backfillCodes, type Category } from "../../lib/menu";
import { StudioBuilder } from "./StudioBuilder";

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/panel/studio");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, menu, image_quota, image_quota_used")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/giris?next=/panel/studio");

  const categories = backfillCodes((restaurant.menu as Category[] | null) ?? DEFAULT_MENU.categories);

  return (
    <StudioBuilder
      restaurantId={restaurant.id}
      initialCategories={categories}
      imageQuota={restaurant.image_quota ?? 0}
      imageQuotaUsed={restaurant.image_quota_used ?? 0}
    />
  );
}
