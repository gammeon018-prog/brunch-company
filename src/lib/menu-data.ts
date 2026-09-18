import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name: string;
  group_label: string;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_da: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  sort_order: number;
};

export type RestaurantInfo = {
  id: string;
  name: string;
  tagline: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  about_text: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  maps_link: string | null;
  maps_embed: string | null;
  opening_hours: string | null;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name, group_label, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, category_id, name, description, price_da, image_url, is_available, is_popular, sort_order",
      )
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const infoQuery = queryOptions({
  queryKey: ["restaurant_info"],
  queryFn: async (): Promise<RestaurantInfo | null> => {
    const { data, error } = await supabase
      .from("restaurant_info")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as RestaurantInfo) ?? null;
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async (): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from("gallery")
      .select("id, image_url, caption, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export function formatPrice(price: number) {
  if (!price) return "Sur mesure";
  return `${price.toLocaleString("fr-FR")} DA`;
}

export function digitsOnly(value: string | null | undefined) {
  return (value ?? "").replace(/[^\d+]/g, "");
}

const BUCKET = "menu-images";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file to storage and returns a long-lived signed URL. */
export async function uploadImage(file: File, folder: "products" | "gallery") {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError) throw signError;
  return data.signedUrl;
}
