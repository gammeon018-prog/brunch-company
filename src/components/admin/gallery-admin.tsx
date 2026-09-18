import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { galleryQuery, uploadImage } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GalleryAdmin() {
  const qc = useQueryClient();
  const { data: images } = useQuery(galleryQuery);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["gallery"] });

  const add = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "gallery");
      const { error } = await supabase.from("gallery").insert({
        image_url: url,
        caption: caption.trim() || null,
        sort_order: (images?.length ?? 0) + 1,
      });
      if (error) throw error;
      setCaption("");
      toast.success("Photo ajoutée à la galerie");
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Photo retirée");
      invalidate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="caption">Légende (optionnelle)</Label>
          <Input
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ex : Tiramisu pistache"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="file">Photo</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void add(file);
              e.target.value = "";
            }}
          />
        </div>
        {uploading ? <p className="text-xs text-muted-foreground">Envoi en cours…</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(images ?? []).map((img) => (
          <figure key={img.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <img src={img.image_url} alt={img.caption ?? ""} className="aspect-square w-full object-cover" />
            <figcaption className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs text-muted-foreground">{img.caption ?? "—"}</span>
              <Button size="icon" variant="ghost" onClick={() => remove(img.id)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
