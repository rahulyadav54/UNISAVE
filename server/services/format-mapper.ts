import { createHash } from "node:crypto";
import type { MediaFormat } from "@/types/media";
import type { YtDlpFormat } from "./ytdlp";

export function stableFormatIdFromKey(key: string): string {
  return `format_${createHash("sha256").update(key).digest("hex").slice(0, 12)}`;
}

function videoMergeSelector(height: number): string {
  return [
    `bestvideo[height=${height}][ext=mp4]+bestaudio[ext=m4a]`,
    `bestvideo[height<=${height}]+bestaudio`,
    `best[height<=${height}][vcodec!=none][acodec!=none]`,
    `best[height<=${height}]`,
  ].join("/");
}

function hasVideo(f: YtDlpFormat): boolean {
  if (f.vcodec && f.vcodec !== "none") return true;
  if (f.width || f.height) return true;
  if (f.format_id && (f.format_id === "sd" || f.format_id === "hd" || f.format_id.includes("video"))) return true;
  return false;
}

function hasAudio(f: YtDlpFormat): boolean {
  if (f.acodec && f.acodec !== "none") return true;
  // Many pre-merged standard formats like sd/hd omit acodec in metadata
  if (f.format_id && (f.format_id === "sd" || f.format_id === "hd" || f.format_note === "sd" || f.format_note === "hd" || f.format_id === "0")) return true;
  return false;
}

/**
 * Builds user-facing formats with yt-dlp selectors that produce playable video
 * (video+audio), not silent video-only DASH streams.
 */
export function mapYtDlpFormatsToMediaFormats(
  ytdlpFormats: YtDlpFormat[] = [],
): MediaFormat[] {
  const results: MediaFormat[] = [];
  const seenVideoQualities = new Set<string>();

  for (const f of ytdlpFormats) {
    if (!f.format_id || !hasVideo(f) || !hasAudio(f)) continue;

    const height = f.height;
    const quality = height ? `${height}p` : f.format_note || "Source";
    const dedupeKey = height ? `h-${height}` : `p-${f.format_id}`;
    if (seenVideoQualities.has(dedupeKey)) continue;
    seenVideoQualities.add(dedupeKey);

    results.push({
      id: stableFormatIdFromKey(`progressive-${dedupeKey}-${f.format_id}`),
      type: "video",
      format: f.ext || "mp4",
      quality,
      resolution: f.resolution,
      fileSize: f.filesize || f.filesize_approx,
      fps: f.fps,
      label: f.format_note,
      available: true,
      ytdlpFormatId: f.format_id,
      hasWatermark: /watermark/i.test(f.format_note || ""),
    });
  }

  const videoHeights = [
    ...new Set(
      ytdlpFormats
        .filter((f) => hasVideo(f) && f.height)
        .map((f) => f.height as number),
    ),
  ].sort((a, b) => b - a);

  for (const height of videoHeights) {
    const quality = `${height}p`;
    if (seenVideoQualities.has(`h-${height}`)) continue;
    seenVideoQualities.add(`h-${height}`);

    results.push({
      id: stableFormatIdFromKey(`merged-${height}`),
      type: "video",
      format: "mp4",
      quality,
      resolution: `${height}p`,
      available: true,
      ytdlpFormatId: videoMergeSelector(height),
      label: "Merged video + audio",
    });
  }

  const hasAnyVideo = videoHeights.length > 0 || results.some((r) => r.type === "video");
  if (hasAnyVideo && !results.some((r) => r.quality === "Best")) {
    results.unshift({
      id: stableFormatIdFromKey("merged-best"),
      type: "video",
      format: "mp4",
      quality: "Best",
      label: "Best available",
      available: true,
      ytdlpFormatId: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[vcodec!=none][acodec!=none]/best[ext=mp4]/best",
    });
  }

  const hasAudioTrack = ytdlpFormats.some((f) => hasAudio(f));
  if (hasAudioTrack) {
    results.push({
      id: stableFormatIdFromKey("audio-best"),
      type: "audio",
      format: "m4a",
      quality: "Audio",
      label: "Best audio",
      available: true,
      ytdlpFormatId: "bestaudio/best",
    });
  }

  return results
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "video" ? -1 : 1;
      const ah =
        a.quality === "Best"
          ? 10_000
          : parseInt(a.quality?.replace("p", "") || "0", 10);
      const bh =
        b.quality === "Best"
          ? 10_000
          : parseInt(b.quality?.replace("p", "") || "0", 10);
      return bh - ah;
    })
    .slice(0, 20);
}
