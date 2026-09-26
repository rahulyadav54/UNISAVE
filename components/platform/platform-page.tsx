import { MediaDownloader } from "@/components/downloader/media-downloader";
import type { PlatformMeta } from "@/types/platform";
import { Card } from "@/components/ui/card";

export function PlatformPage({ platform }: { platform: PlatformMeta }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{platform.name} Media Downloader</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Analyze and save publicly accessible {platform.name} links with UNISAVE. Private, login-only,
        or restricted content is not supported.
      </p>

      <div className="mt-8">
        <MediaDownloader />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">Supported Media Types</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Public posts, videos, and reels where the platform exposes accessible media metadata.
            Actual formats depend on the source and are shown after analysis.
          </p>
        </Card>
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">Usage & Guidelines</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            UNISAVE does not bypass DRM, authentication, paywalls, or technical restrictions.
            You are responsible for having rights to download or process content.
          </p>
        </Card>
      </div>
    </div>
  );
}

