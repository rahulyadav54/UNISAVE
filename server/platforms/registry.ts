import { PLATFORMS } from "@/lib/platforms";
import { createYtDlpAdapter } from "./ytdlp-adapter";
import type { PlatformAdapter } from "./types";

const adapters: PlatformAdapter[] = PLATFORMS.map((meta) => createYtDlpAdapter(meta));

export function getAdapterForUrl(url: string): PlatformAdapter | null {
  return adapters.find((a) => a.canHandle(url)) ?? null;
}

export function getAllAdapters(): PlatformAdapter[] {
  return adapters;
}
