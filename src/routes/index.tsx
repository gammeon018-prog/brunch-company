import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Quote, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { GalleryGrid } from "@/components/gallery-grid";
import { ContactBlock } from "@/components/contact-block";
import { QrDialog } from "@/components/qr-dialog";
import { infoQuery, productsQuery, formatPrice } from "@/lib/menu-data";
import heroImage from "@/assets/toast-tomate.jpg.asset.json";
import tiramisu from "@/assets/tiramisu-pistache.jpg.asset.json";
import cafe from "@/assets/cafe-signature.jpg.asset.json";
import boissons from "@/assets/boissons.jpg.asset.json";
import { OpeningStatus } from "@/components/opening-status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brunch & Co — Brunch, café de spécialité & pâtisseries" },
      {
        name: "description",
        content:
          "Brunch & Co : toasts gourmands, croissants garnis, salades fraîches, pâtisseries maison et café de spécialité. Découvrez le menu complet en ligne.",
      },
      { property: "og:title", content: "Brunch & Co — Brunch, café & pâtisseries" },
      {
        property: "og:description",
        content: "Une cuisine généreuse et un café de caractère. Menu digital accessible en un scan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const POPULAR_IMAGES = [tiramisu.url, cafe.url, boissons.url];
const REVIEWS = [
  {
    quote: "Gâteaux et cocktails aux fruits divins, dans une ambiance cosy et chaleureuse.",
    name: "Amel B.",
  },
  {
    quote: "Le meilleur brunch de Tizi Ouzou, avec des pâtisseries toujours fraîches.",
    name: "Lina K.",
  },
  {
    quote: "Accueil attentionné, assiettes généreuses et café excellent. Une adresse à retenir.",
    name: "Nassim M.",
  },
];

function Home() {
  const { data: info } = useQuery(infoQuery);
  const { data: products } = useQuery(productsQuery);
  const popular = (products ?? []).filter((p) => p.is_popular && p.is_available).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImage.url}
          alt="Toast à la crème d'avocat et tomates confites"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/30" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-16">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-gold">
            <Sparkles className="size-3.5" />
            Fait maison chaque jour
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] font-semibold text-deep-foreground sm:text-6xl">
            {info?.hero_title ?? "Brunch & Co"}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-deep-foreground/85">
            {info?.hero_subtitle ??
              "Une cuisine généreuse, des produits frais et un café de caractère — du matin jusqu'au dessert."}
          </p>
          <OpeningStatus className="mt-5 border-deep-foreground/25 bg-deep/65 text-deep-foreground" />
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/menu">
                Voir le menu
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-deep-foreground/40 bg-transparent text-deep-foreground hover:bg-deep-foreground/10"
            >
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Avis clients</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Ce que disent nos clients</h2>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-md border border-gold/35 bg-card px-4 py-3 shadow-sm">
              <div className="flex text-gold" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}
              </div>
              <div>
                <p className="text-sm font-semibold">4,9/5</p>
                <p className="text-[11px] text-muted-foreground">sur Google</p>
              </div>
            </div>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((review) => (
              <figure key={review.name} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <Quote className="size-5 text-gold" />
                <blockquote className="mt-4 text-sm leading-relaxed">“{review.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-border pt-3 text-xs font-medium text-muted-foreground">
                  {review.name} · Google
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl font-semibold">Les coups de cœur</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Les incontournables de la maison, choisis par nos habitués.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p, i) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <img
                src={p.image_url ?? POPULAR_IMAGES[i % POPULAR_IMAGES.length]}
                alt={p.name}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <span className="shrink-0 text-sm font-medium text-primary">
                    {formatPrice(p.price_da)}
                  </span>
                </div>
                {p.description ? (
                  <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                    {p.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Button asChild>
            <Link to="/menu">
              Menu complet
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <QrDialog />
        </div>
      </section>

      <section className="bg-deep px-5 py-14 text-deep-foreground">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold">La maison</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-deep-foreground/85">
            {info?.about_text ??
              "Brunch & Co est une maison de brunch où chaque assiette est préparée le jour même."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">Galerie</h2>
          <Link to="/galerie" className="text-sm text-primary hover:underline">
            Tout voir
          </Link>
        </div>
        <GalleryGrid limit={5} />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="mb-6 font-display text-3xl font-semibold">Infos & contact</h2>
        <ContactBlock />
      </section>

      <SiteFooter />
    </div>
  );
}
