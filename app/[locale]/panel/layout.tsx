import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { AccountMenu } from "./AccountMenu";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/panel");
  const t = await getTranslations("Panel.nav");

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--paper)" }}>
        <Link href="/panel" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("home")}</Link>
          <Link href="/panel" style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("panel")}</Link>
          <Link href="/panel/studio" style={{ fontSize: 13.5, color: "var(--muted)" }}>{t("studio")}</Link>
          <AccountMenu email={user.email ?? ""} />
        </div>
      </header>
      {children}
    </div>
  );
}
