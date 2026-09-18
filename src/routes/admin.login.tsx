import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Connexion gérant — Brunch & Co" },
      { name: "description", content: "Accès réservé à l'équipe de Brunch & Co." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion gérant — Brunch & Co" },
      { property: "og:description", content: "Espace de gestion du menu Brunch & Co." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie");
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Compte créé");
          navigate({ to: "/admin", replace: true });
        } else {
          toast.success("Compte créé — vérifiez votre boîte mail pour confirmer l'adresse.");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-gold/25 bg-card p-6 shadow-xl">
        <p className="font-display text-2xl">
          Brunch <span className="text-gold">&amp; Co</span>
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold">
          {mode === "login" ? "Espace gérant" : "Créer un accès gérant"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Connectez-vous pour gérer le menu et les informations."
            : "Créez le compte de l'équipe pour gérer le menu."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@brunchandco.dz"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Créer un premier compte gérant" : "J'ai déjà un compte"}
        </button>
      </div>
    </div>
  );
}
