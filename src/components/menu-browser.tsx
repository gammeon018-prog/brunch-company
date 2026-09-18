import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriesQuery, productsQuery, formatPrice } from "@/lib/menu-data";
import type { Category, Product } from "@/lib/menu-data";

function ProductCard({ product }: { product: Product }) {
  return (
    <li className="flex gap-3 rounded-xl border border-border/70 bg-card p-3.5 shadow-sm">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-20 shrink-0 rounded-lg object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight font-semibold">{product.name}</h3>
          <span className="shrink-0 font-sans text-sm font-medium tracking-wide text-primary">
            {formatPrice(product.price_da)}
          </span>
        </div>
        {product.description ? (
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
            {product.description}
          </p>
        ) : null}
        {!product.is_available ? (
          <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            Indisponible
          </span>
        ) : product.is_popular ? (
          <span className="mt-2 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[11px] uppercase tracking-wider text-accent-foreground">
            Coup de cœur
          </span>
        ) : null}
      </div>
    </li>
  );
}

export function MenuBrowser() {
  const { data: categories, isLoading: loadingCats } = useQuery(categoriesQuery);
  const { data: products, isLoading: loadingProducts } = useQuery(productsQuery);
  const [active, setActive] = useState<string>("all");
  const [search, setSearch] = useState("");

  const groups = useMemo(() => {
    if (!categories || !products) return [];
    const term = search.trim().toLowerCase();
    const visibleCats: Category[] =
      active === "all" ? categories : categories.filter((c) => c.slug === active);
    return visibleCats
      .map((cat) => ({
        category: cat,
        items: products.filter(
          (p) =>
            p.category_id === cat.id &&
            (!term ||
              p.name.toLowerCase().includes(term) ||
              (p.description ?? "").toLowerCase().includes(term)),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, products, active, search]);

  const loading = loadingCats || loadingProducts;

  return (
    <div>
      <div className="sticky top-[68px] z-30 -mx-5 bg-background/95 px-5 pb-3 pt-3 backdrop-blur-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un plat, une boisson…"
            className="h-11 rounded-full pl-9"
          />
        </div>
        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <Chip label="Tout" active={active === "all"} onClick={() => setActive("all")} />
          {(categories ?? []).map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              active={active === cat.slug}
              onClick={() => setActive(cat.slug)}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Aucun résultat pour « {search} ».
        </p>
      ) : (
        <div className="mt-6 space-y-10">
          {groups.map(({ category, items }) => (
            <section key={category.id} id={category.slug}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-display text-2xl font-semibold">{category.name}</h2>
                <span className="h-px flex-1 bg-gold/50" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {category.group_label}
                </span>
              </div>
              <ul className="space-y-2.5">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-gold")
      }
    >
      {label}
    </button>
  );
}
