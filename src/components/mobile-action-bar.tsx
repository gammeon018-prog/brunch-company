import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, MessageCircle, Phone, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  directionsUrl,
  infoQuery,
  phoneHref,
  whatsappHref,
} from "@/lib/menu-data";

export function MobileActionBar() {
  const { data: info } = useQuery(infoQuery);
  const phone = info?.phone ?? "0552841547";
  const whatsapp = info?.whatsapp ?? phone;
  const address = info?.address ?? "Brunch & Co, Rue Said Ouzeffoune, Tizi Ouzou";

  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/25 bg-deep/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <Action href={phoneHref(phone)} icon={<Phone />} label="Appeler" />
        <Action href={whatsappHref(whatsapp)} icon={<MessageCircle />} label="WhatsApp" external />
        <Action href={directionsUrl(address)} icon={<MapPin />} label="Itinéraire" external />
        <Button asChild variant="ghost" className="h-12 flex-col gap-0.5 px-1 text-deep-foreground hover:bg-deep-foreground/10 hover:text-gold">
          <Link to="/menu">
            <UtensilsCrossed className="size-4 text-gold" />
            <span className="text-[10px]">Menu</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}

function Action({
  href,
  icon,
  label,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Button asChild variant="ghost" className="h-12 flex-col gap-0.5 px-1 text-deep-foreground hover:bg-deep-foreground/10 hover:text-gold">
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        <span className="text-gold [&_svg]:size-4">{icon}</span>
        <span className="text-[10px]">{label}</span>
      </a>
    </Button>
  );
}