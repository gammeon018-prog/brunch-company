import { useQuery } from "@tanstack/react-query";
import { Clock, Instagram, Facebook, MapPin, Phone, MessageCircle } from "lucide-react";
import { infoQuery, digitsOnly } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";

export function ContactBlock() {
  const { data: info } = useQuery(infoQuery);
  const whatsapp = digitsOnly(info?.whatsapp ?? info?.phone);
  const whatsappSecondary = digitsOnly(info?.whatsapp_secondary ?? info?.phone_secondary);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<Clock className="size-4 text-gold" />} title="Horaires">
          {info?.opening_hours ? (
            <ul className="space-y-0.5">
              {info.opening_hours.split("\n").map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p>Horaires à renseigner.</p>
          )}
        </InfoCard>

        <InfoCard icon={<MapPin className="size-4 text-gold" />} title="Adresse">
          <p>{info?.address || "Adresse à renseigner."}</p>
          {info?.maps_link ? (
            <a
              href={info.maps_link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-primary underline-offset-4 hover:underline"
            >
              Ouvrir dans Google Maps
            </a>
          ) : null}
        </InfoCard>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {info?.phone ? (
          <Button asChild>
            <a href={`tel:${digitsOnly(info.phone)}`}>
              <Phone className="size-4" />
              {info.phone}
            </a>
          </Button>
        ) : null}
        {info?.phone_secondary ? (
          <Button asChild variant="outline">
            <a href={`tel:${digitsOnly(info.phone_secondary)}`}>
              <Phone className="size-4" />
              {info.phone_secondary}
            </a>
          </Button>
        ) : null}
        {whatsapp ? (
          <Button asChild variant="secondary">
            <a href={`https://wa.me/${whatsapp.replace("+", "")}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp {info?.whatsapp ?? info?.phone}
            </a>
          </Button>
        ) : null}
        {whatsappSecondary ? (
          <Button asChild variant="secondary">
            <a href={`https://wa.me/${whatsappSecondary.replace("+", "")}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp {info?.whatsapp_secondary ?? info?.phone_secondary}
            </a>
          </Button>
        ) : null}
        {info?.instagram ? (
          <Button asChild variant="outline">
            <a href={info.instagram} target="_blank" rel="noreferrer">
              <Instagram className="size-4" />
              brunch &amp; co
            </a>
          </Button>
        ) : null}
        {info?.facebook ? (
          <Button asChild variant="outline">
            <a href={info.facebook} target="_blank" rel="noreferrer">
              <Facebook className="size-4" />
              Facebook
            </a>
          </Button>
        ) : null}
      </div>

      {info?.maps_embed ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            title="Carte Brunch & Co"
            src={info.maps_embed}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      </div>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
