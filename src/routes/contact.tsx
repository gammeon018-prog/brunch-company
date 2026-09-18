import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContactBlock } from "@/components/contact-block";
import { QrDialog } from "@/components/qr-dialog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Nous contacter — Brunch & Co" },
      {
        name: "description",
        content:
          "Horaires, adresse, téléphone, WhatsApp et réseaux sociaux de Brunch & Co. Venez nous rendre visite.",
      },
      { property: "og:title", content: "Nous contacter — Brunch & Co" },
      {
        property: "og:description",
        content: "Horaires, adresse et contact direct par téléphone ou WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="bg-deep px-5 pb-8 pt-24 text-deep-foreground">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Nous trouver</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Infos & contact</h1>
        </div>
      </div>
      <main className="mx-auto max-w-3xl space-y-8 px-5 py-10">
        <ContactBlock />
        <div>
          <h2 className="mb-3 font-display text-2xl font-semibold">Menu à table</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Affichez ou téléchargez le QR code à poser sur les tables.
          </p>
          <QrDialog />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
