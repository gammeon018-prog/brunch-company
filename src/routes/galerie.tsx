import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { GalleryGrid } from "@/components/gallery-grid";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie photos — Brunch & Co" },
      {
        name: "description",
        content:
          "Découvrez en images les assiettes, pâtisseries, cafés et l'ambiance de Brunch & Co.",
      },
      { property: "og:title", content: "Galerie photos — Brunch & Co" },
      {
        property: "og:description",
        content: "Nos assiettes, nos desserts et l'ambiance de la maison en images.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="bg-deep px-5 pb-8 pt-24 text-deep-foreground">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">En images</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Galerie</h1>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-5 py-10">
        <GalleryGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
