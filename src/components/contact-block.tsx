import { useQuery } from "@tanstack/react-query";
import { Clock, Instagram, Facebook, MapPin, Phone, MessageCircle, Navigation } from "lucide-react";
import { directionsUrl, infoQuery, phoneHref, whatsappHref } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { OpeningStatus } from "@/components/opening-status";

export function ContactBlock() {
  const { data: info } = useQuery(infoQuery);
  const whatsapp = info?.whatsapp ?? info?.phone;
  const whatsappSecondary = info?.whatsapp_secondary ?? info?.phone_secondary;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<Clock className="size-4 text-gold" />} title="Horaires">
          {info?.opening_hours ? (
            <div className="space-y-3">
              <OpeningStatus />
              <ul className="space-y-0.5">
              {info.opening_hours.split("\n").map((line) => (
                <li key={line}>{line}</li>
              ))}
              </ul>
            </div>
          ) : (
            <p>Horaires à renseigner.</p>
          )}
        </InfoCard>

        <InfoCard icon={<MapPin className="size-4 text-gold" />} title="Adresse">
          <p>{info?.address || "Adresse à renseigner."}</p>
          <Button asChild size="sm" className="mt-3">
            <a href={directionsUrl(info?.address)} target="_blank" rel="noreferrer">
              <Navigation className="size-4" />
              Calculer mon itinéraire
            </a>
          </Button>
        </InfoCard>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {info?.phone ? (
          <Button asChild>
            <a href={phoneHref(info.phone)}>
              <Phone className="size-4" />
              {info.phone}
            </a>
          </Button>
        ) : null}
        {info?.phone_secondary ? (
          <Button asChild variant="outline">
            <a href={phoneHref(info.phone_secondary)}>
              <Phone className="size-4" />
              {info.phone_secondary}
            </a>
          </Button>
        ) : null}
        {whatsapp ? (
          <Button asChild variant="secondary">
            <a href={whatsappHref(whatsapp)} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp {info?.whatsapp ?? info?.phone}
            </a>
          </Button>
        ) : null}
        {whatsappSecondary ? (
          <Button asChild variant="secondary">
            <a href={whatsappHref(whatsappSecondary)} target="_blank" rel="noreferrer">
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
