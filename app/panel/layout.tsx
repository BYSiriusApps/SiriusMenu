import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/panel");

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--paper)" }}>
        <Link href="/" className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>SiriusMenu</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/panel" style={{ fontSize: 13.5, color: "var(--muted)" }}>Panel</Link>
          <Link href="/panel/studio" style={{ fontSize: 13.5, color: "var(--muted)" }}>Stüdyo</Link>
          <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
