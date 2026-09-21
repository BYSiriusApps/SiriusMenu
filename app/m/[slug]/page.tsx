import { createClient } from "../../lib/supabase/server";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { DEFAULT_MENU, type Category } from "../../lib/menu";
import { MenuView } from "../../lib/MenuView";

export const revalidate = 0;

export default async function PublicMenu({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ k?: string }> }) {
  const { slug } = await params;
  const { k } = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Menü henüz yayında değil</div>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>Bu işletme panelini kurmayı tamamlamadı.</p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, subtitle, theme, currency, menu, published, qr_token")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!restaurant) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Menü bulunamadı</div>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>Bu bağlantı artık aktif değil.</p>
        </div>
      </main>
    );
  }

  // QR görseline gömülen anahtar (k) varsa ve güncel token'la eşleşmiyorsa: bu, yenilenmiş/geçersiz kılınmış
  // eski bir basılı QR'dır. Düz /m/{slug} linki (k olmadan) her zaman çalışmaya devam eder.
  if (k && restaurant.qr_token && k !== restaurant.qr_token) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Bu QR kodu artık geçerli değil</div>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>Güncel menü için lütfen personelden yeni QR kodu iste.</p>
        </div>
      </main>
    );
  }

  const categories = (restaurant.menu as Category[] | null) ?? DEFAULT_MENU.categories;

  return (
    <main style={{ minHeight: "100vh" }}>
      <MenuView
        menu={{
          name: restaurant.name,
          subtitle: restaurant.subtitle,
          theme: restaurant.theme,
          currency: restaurant.currency,
          categories,
        }}
      />
    </main>
  );
}
