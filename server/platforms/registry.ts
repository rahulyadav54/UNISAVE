import { PLATFORMS } from "@/lib/platforms";
import { createYtDlpAdapter } from "./ytdlp-adapter";
import { youtubeAdapter } from "./youtube-adapter";
import type { PlatformAdapter } from "./types";

const adapters: PlatformAdapter[] = PLATFORMS.map((meta) =>
  meta.id === "youtube" ? youtubeAdapter : createYtDlpAdapter(meta),
);

export function getAdapterForUrl(url: string): PlatformAdapter | null {
  return adapters.find((a) => a.canHandle(url)) ?? null;
}

export function getAllAdapters(): PlatformAdapter[] {
  return adapters;
}
