"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="btn-ghost btn"
      style={{ padding: "8px 14px", fontSize: 13.5 }}
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Çıkış yap
    </button>
  );
}
