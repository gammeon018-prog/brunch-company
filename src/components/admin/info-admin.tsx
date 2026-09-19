import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { infoQuery } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Form = Record<string, string>;

const FIELDS: Array<{ key: string; label: string; type?: "text" | "area" }> = [
  { key: "tagline", label: "Accroche courte" },
  { key: "hero_title", label: "Titre principal (accueil)" },
  { key: "hero_subtitle", label: "Sous-titre (accueil)", type: "area" },
  { key: "about_text", label: "Texte « La maison »", type: "area" },
  { key: "phone", label: "Téléphone" },
  { key: "phone_secondary", label: "Deuxième téléphone" },
  { key: "whatsapp", label: "Numéro WhatsApp" },
  { key: "whatsapp_secondary", label: "Deuxième WhatsApp" },
  { key: "instagram", label: "Lien Instagram" },
  { key: "facebook", label: "Lien Facebook" },
  { key: "address", label: "Adresse" },
  { key: "maps_link", label: "Lien Google Maps" },
  { key: "maps_embed", label: "Lien de la carte intégrée (iframe src)" },
  { key: "opening_hours", label: "Horaires (une ligne par jour)", type: "area" },
];

export function InfoAdmin() {
  const qc = useQueryClient();
  const { data: info } = useQuery(infoQuery);
  const [form, setForm] = useState<Form>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!info) return;
    const next: Form = {};
    for (const f of FIELDS) next[f.key] = (info as unknown as Form)[f.key] ?? "";
    setForm(next);
  }, [info]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, updated_at: new Date().toISOString() };
      if (info?.id) {
        const { error } = await supabase.from("restaurant_info").update(payload).eq("id", info.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("restaurant_info").insert(payload);
        if (error) throw error;
      }
      toast.success("Informations enregistrées");
      qc.invalidateQueries({ queryKey: ["restaurant_info"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={"space-y-1.5 " + (f.type === "area" ? "sm:col-span-2" : "")}>
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.type === "area" ? (
              <Textarea
                id={f.key}
                rows={3}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                id={f.key}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer les informations"}
      </Button>
    </div>
  );
}
