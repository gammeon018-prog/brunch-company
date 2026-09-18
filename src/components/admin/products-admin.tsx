import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, productsQuery, formatPrice, uploadImage } from "@/lib/menu-data";
import type { Product } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Draft = {
  id?: string;
  category_id: string;
  name: string;
  description: string;
  price_da: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
};

const emptyDraft = (categoryId: string): Draft => ({
  category_id: categoryId,
  name: "",
  description: "",
  price_da: "0",
  image_url: null,
  is_available: true,
  is_popular: false,
});

export function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: categories } = useQuery(categoriesQuery);
  const { data: products } = useQuery(productsQuery);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);

  const catName = (id: string) => categories?.find((c) => c.id === id)?.name ?? "—";

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (filter === "all" || p.category_id === filter) &&
        (!term || p.name.toLowerCase().includes(term)),
    );
  }, [products, search, filter]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        category_id: d.category_id,
        name: d.name.trim(),
        description: d.description.trim() || null,
        price_da: Number(d.price_da) || 0,
        image_url: d.image_url,
        is_available: d.is_available,
        is_popular: d.is_popular,
      };
      if (d.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Produit enregistré");
      setDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produit supprimé");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleAvailability = async (p: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !p.is_available })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else invalidate();
  };

  const onFile = async (file: File) => {
    if (!draft) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setDraft({ ...draft, image_url: url });
      toast.success("Photo ajoutée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit"
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {(categories ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setDraft(emptyDraft(categories?.[0]?.id ?? ""))}
          disabled={!categories?.length}
        >
          <Plus className="size-4" />
          Nouveau produit
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{visible.length} produit(s)</p>

      <ul className="space-y-2">
        {visible.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="size-14 rounded-lg object-cover" />
            ) : (
              <div className="size-14 rounded-lg bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {catName(p.category_id)} · {formatPrice(p.price_da)}
                {p.is_popular ? " · Coup de cœur" : ""}
              </p>
            </div>
            <Switch
              checked={p.is_available}
              onCheckedChange={() => toggleAvailability(p)}
              aria-label="Disponibilité"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setDraft({
                  id: p.id,
                  category_id: p.category_id,
                  name: p.name,
                  description: p.description ?? "",
                  price_da: String(p.price_da),
                  image_url: p.image_url,
                  is_available: p.is_available,
                  is_popular: p.is_popular,
                })
              }
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                if (confirm(`Supprimer « ${p.name} » ?`)) remove.mutate(p.id);
              }}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {draft?.id ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Select
                    value={draft.category_id}
                    onValueChange={(v) => setDraft({ ...draft, category_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Prix (DA)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.price_da}
                    onChange={(e) => setDraft({ ...draft, price_da: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Photo</Label>
                {draft.image_url ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={draft.image_url}
                      alt="Aperçu"
                      className="size-20 rounded-lg object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDraft({ ...draft, image_url: null })}
                    >
                      Retirer
                    </Button>
                  </div>
                ) : null}
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onFile(file);
                  }}
                />
                {uploading ? <p className="text-xs text-muted-foreground">Envoi…</p> : null}
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label>Disponible</Label>
                <Switch
                  checked={draft.is_available}
                  onCheckedChange={(v) => setDraft({ ...draft, is_available: v })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label>Coup de cœur (page d'accueil)</Label>
                <Switch
                  checked={draft.is_popular}
                  onCheckedChange={(v) => setDraft({ ...draft, is_popular: v })}
                />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Annuler
            </Button>
            <Button
              onClick={() => draft && save.mutate(draft)}
              disabled={save.isPending || !draft?.name.trim() || !draft?.category_id}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
