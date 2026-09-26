import { PLATFORMS } from "@/lib/platforms";
import { PlatformCard } from "@/components/platform/platform-card";

export default function PlatformsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-foreground">Platforms</h1>
      <p className="mt-3 text-muted-foreground">
        Modular adapters for publicly accessible media on major platforms.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((p) => (
          <PlatformCard key={p.id} platform={p} />
        ))}
      </div>
    </div>
  );
}
