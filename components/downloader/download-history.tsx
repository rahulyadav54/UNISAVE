"use client";

import Image from "next/image";
import { useDownloadHistory } from "@/hooks/use-download-history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DownloadHistory({ className }: { className?: string }) {
  const { items, clear } = useDownloadHistory();
  if (!items.length) return null;

  return (
    <div className={cn(className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Downloads</h3>
        <Button variant="ghost" size="sm" type="button" onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">
          Clear History
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="flex gap-3 p-3.5 transition-all hover:border-violet-500/30">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/30 border border-[var(--card-border)]">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {item.platform} · {item.format}
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                {new Date(item.date).toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

