import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok">("loading");

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data.user) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      setState("ok");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/admin/login", replace: true });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Vérification de l'accès…</p>
      </div>
    );
  }

  return <>{children}</>;
}
