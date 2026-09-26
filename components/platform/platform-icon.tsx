import { getPlatformMeta } from "@/lib/platforms";
import type { PlatformId } from "@/types/platform";
import { cn } from "@/lib/utils";
import { PlatformLogo } from "./platform-logo";

export function PlatformIcon({
  platform,
  className,
}: {
  platform: PlatformId;
  className?: string;
}) {
  const meta = getPlatformMeta(platform);
  const label = meta?.name ?? "Media";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs font-medium text-foreground shadow-sm",
        className,
      )}
    >
      <PlatformLogo platform={platform} size="sm" className="!h-6 !w-6 !rounded-lg [&_svg]:!h-3 [&_svg]:!w-3" />
      {label}
    </span>
  );
}
