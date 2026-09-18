import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MenuBrowser } from "@/components/menu-browser";
import { QrDialog } from "@/components/qr-dialog";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Le menu — Brunch & Co" },
      {
        name: "description",
        content:
          "Menu complet de Brunch & Co : toasts salés, croissants garnis, brunchs, salades, pâtisseries, cafés, matcha, jus frais, mojitos et smoothies. Prix en DA.",
      },
      { property: "og:title", content: "Le menu — Brunch & Co" },
      {
        property: "og:description",
        content: "Toasts, brunchs, pâtisseries et boissons. Tous les prix en dinars algériens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="bg-deep px-5 pb-8 pt-24 text-deep-foreground">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Carte</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Notre menu</h1>
          <p className="mt-2 text-sm text-deep-foreground/80">
            Tous les prix sont en dinars algériens (DA).
          </p>
          <div className="mt-5">
            <QrDialog className="border-deep-foreground/40 bg-transparent text-deep-foreground hover:bg-deep-foreground/10" />
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-5 pb-16">
        <MenuBrowser />
      </main>
      <SiteFooter />
    </div>
  );
}
