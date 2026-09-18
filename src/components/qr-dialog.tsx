import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QrDialog({ className }: { className?: string }) {
  const [url, setUrl] = useState("");
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}/menu`);
  }, []);

  const download = () => {
    const canvas = wrapper.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "brunch-and-co-qr-menu.png";
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <QrCode className="size-4" />
          QR du menu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">QR code du menu</DialogTitle>
          <DialogDescription>
            À imprimer et poser sur les tables : vos clients scannent et accèdent au menu.
          </DialogDescription>
        </DialogHeader>
        <div
          ref={wrapper}
          className="mx-auto flex flex-col items-center gap-3 rounded-xl border border-gold/40 bg-card p-5"
        >
          {url ? (
            <QRCodeCanvas value={url} size={220} level="M" includeMargin marginSize={2} />
          ) : (
            <div className="size-[220px] animate-pulse rounded bg-muted" />
          )}
          <p className="text-center text-xs text-muted-foreground break-all">{url}</p>
        </div>
        <Button onClick={download} disabled={!url}>
          <Download className="size-4" />
          Télécharger le QR code
        </Button>
      </DialogContent>
    </Dialog>
  );
}
