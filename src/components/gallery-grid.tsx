import { useQuery } from "@tanstack/react-query";
import { galleryQuery } from "@/lib/menu-data";
import { Skeleton } from "@/components/ui/skeleton";

export function GalleryGrid({ limit }: { limit?: number }) {
  const { data, isLoading } = useQuery(galleryQuery);
  const images = limit ? (data ?? []).slice(0, limit) : (data ?? []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: limit ?? 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune photo pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
      {images.map((img, i) => (
        <figure
          key={img.id}
          className={
            "group relative overflow-hidden rounded-xl bg-muted " +
            (i === 0 ? "col-span-2 aspect-[4/3] md:col-span-2" : "aspect-square")
          }
        >
          <img
            src={img.image_url}
            alt={img.caption ?? "Brunch & Co"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {img.caption ? (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-[11px] leading-tight text-white">
              {img.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
