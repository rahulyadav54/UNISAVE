import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
