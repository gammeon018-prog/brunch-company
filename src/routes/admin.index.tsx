import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/admin/admin-guard";
import { ProductsAdmin } from "@/components/admin/products-admin";
import { InfoAdmin } from "@/components/admin/info-admin";
import { GalleryAdmin } from "@/components/admin/gallery-admin";
import { QrDialog } from "@/components/qr-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Brunch & Co" },
      { name: "description", content: "Gestion du menu, des informations et de la galerie." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tableau de bord — Brunch & Co" },
      { property: "og:description", content: "Espace de gestion réservé à l'équipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-deep px-5 py-5 text-deep-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl">
              Brunch <span className="text-gold">&amp; Co</span>
            </p>
            <h1 className="font-display text-2xl font-semibold">Tableau de bord</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <QrDialog className="border-deep-foreground/40 bg-transparent text-deep-foreground hover:bg-deep-foreground/10" />
            <Button
              asChild
              variant="outline"
              className="border-deep-foreground/40 bg-transparent text-deep-foreground hover:bg-deep-foreground/10"
            >
              <Link to="/">
                <ExternalLink className="size-4" />
                Voir le site
              </Link>
            </Button>
            <Button onClick={signOut} className="bg-gold text-gold-foreground hover:bg-gold/90">
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <Tabs defaultValue="products">
          <TabsList className="w-full">
            <TabsTrigger value="products" className="flex-1">
              Menu
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              Informations
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1">
              Galerie
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <ProductsAdmin />
          </TabsContent>
          <TabsContent value="info" className="mt-6">
            <InfoAdmin />
          </TabsContent>
          <TabsContent value="gallery" className="mt-6">
            <GalleryAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
