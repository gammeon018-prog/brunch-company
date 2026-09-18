import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight text-deep-foreground">
            Brunch
          </span>
          <span className="font-display text-2xl font-semibold text-gold">&amp; Co</span>
        </Link>

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
  return (
    <footer className="bg-deep px-5 py-10 text-center text-deep-foreground">
      <p className="font-display text-2xl">
        Brunch <span className="text-gold">&amp; Co</span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-deep-foreground/60">
        Brunch · Café · Pâtisseries
      </p>
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
  );
}
