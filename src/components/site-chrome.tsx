import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Instagram, Menu, MapPin, Phone, X } from "lucide-react";
import { infoQuery, phoneHref } from "@/lib/menu-data";
import { OpeningStatus } from "@/components/opening-status";
import { MobileActionBar } from "@/components/mobile-action-bar";

const NAV = [
  { label: "Accueil", to: "/" as const },
  { label: "Menu", to: "/menu" as const },
  { label: "Galerie", to: "/galerie" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (scrolled || open ? "bg-deep/95 backdrop-blur-md shadow-lg" : "bg-transparent")
      }
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 md:flex md:justify-between md:py-4">
        <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className="flex shrink-0 items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight text-deep-foreground">
            Brunch
          </span>
          <span className="font-display text-2xl font-semibold text-gold">&amp; Co</span>
        </Link>
        <OpeningStatus className="hidden max-w-56 truncate border-gold/25 bg-deep/70 text-deep-foreground lg:inline-flex" />
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm uppercase tracking-[0.18em] text-deep-foreground/80 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-gold/40 p-2 text-deep-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-gold/20 bg-deep px-5 pb-5 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3 text-sm uppercase tracking-[0.18em] text-deep-foreground/85"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { data: info } = useQuery(infoQuery);

  return (
    <>
    <footer className="bg-deep px-5 pb-28 pt-10 text-center text-deep-foreground md:pb-10">
      <p className="font-display text-2xl">
        Brunch <span className="text-gold">&amp; Co</span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-deep-foreground/60">
        Brunch · Café · Pâtisseries
      </p>
      <div className="mx-auto mt-5 flex max-w-2xl flex-col items-center gap-2 text-sm text-deep-foreground/75 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
        {info?.address ? (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold" />
            {info.address}
          </span>
        ) : null}
        {info?.phone ? (
          <a href={phoneHref(info.phone)} className="flex items-center gap-1.5 hover:text-gold">
            <Phone className="size-3.5 text-gold" />
            {info.phone}
          </a>
        ) : null}
        {info?.phone_secondary ? (
          <a href={`tel:${digitsOnly(info.phone_secondary)}`} className="hover:text-gold">
            {info.phone_secondary}
          </a>
        ) : null}
        {info?.instagram ? (
          <a href={info.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold">
            <Instagram className="size-3.5 text-gold" />
            brunch &amp; co
          </a>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-deep-foreground/70">
        <Link to="/menu" className="hover:text-gold">
          Menu
        </Link>
        <Link to="/galerie" className="hover:text-gold">
          Galerie
        </Link>
        <Link to="/contact" className="hover:text-gold">
          Contact
        </Link>
        <Link to="/admin/login" className="hover:text-gold">
          Espace gérant
        </Link>
      </div>
    </footer>
    <MobileActionBar />
    </>
  );
}
