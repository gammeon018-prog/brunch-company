import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const OPENING_MINUTES = 7 * 60 + 30;
const CLOSING_MINUTES = 22 * 60;

function getAlgiersMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Algiers",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function OpeningStatus({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => {
      const minutes = getAlgiersMinutes(new Date());
      setIsOpen(minutes >= OPENING_MINUTES && minutes < CLOSING_MINUTES);
    };

    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (isOpen === null) return null;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
        isOpen
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border bg-background/80 text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-2 shrink-0">
        {isOpen ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" /> : null}
        <span className={cn("relative inline-flex size-2 rounded-full", isOpen ? "bg-primary" : "bg-muted-foreground")} />
      </span>
      {isOpen ? "Ouvert actuellement (fermeture à 22h00)" : "Fermé actuellement (ouvre à 07h30)"}
    </span>
  );
}