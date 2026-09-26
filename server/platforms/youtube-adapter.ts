import ytdl from "@distube/ytdl-core";
import type { PlatformAdapter } from "./types";
import type { AnalyzeResult, MediaFormat } from "@/types/media";
import { stableFormatIdFromKey } from "@/server/services/format-mapper";
import { tryFallbackAnalysis } from "@/server/services/fallback-extractor";
import { downloadWithYtDlp } from "@/server/services/ytdlp";

export const youtubeAdapter: PlatformAdapter = {
  id: "youtube",
  name: "YouTube",
  canHandle(url: string) {
    return /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(url.trim());
  },
  validate(url: string) {
    if (!this.canHandle(url)) {
      return { valid: false, error: "Not a valid YouTube URL." };
    }
    return { valid: true };
  },
  async analyze(url: string): Promise<AnalyzeResult> {
    // 1. Instant extraction via oEmbed (fastest, takes < 200ms)
    try {
      const fastResult = await tryFallbackAnalysis(url, "youtube");
      if (fastResult && fastResult.success && fastResult.formats.length > 0) {
        return fastResult;
      }
    } catch {
      // ignore
    }

    // 2. Secondary fallback via ytdl with a strict 3-second timeout
    try {
      const infoPromise = ytdl.getInfo(url);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000),
      );

      const info = (await Promise.race([infoPromise, timeoutPromise])) as ytdl.videoInfo;
      if (info?.videoDetails) {
        const details = info.videoDetails;
        const formats: MediaFormat[] = [];
        const seen = new Set<string>();

        const progressive = info.formats.filter((f) => f.hasVideo && f.hasAudio);
        for (const f of progressive) {
          const quality = f.qualityLabel || `${f.height}p` || "Standard";
          if (seen.has(quality)) continue;
          seen.add(quality);

          formats.push({
            id: stableFormatIdFromKey(`yt-prog-${f.itag}`),
            type: "video",
            format: f.container || "mp4",
            quality,
            resolution: f.qualityLabel || (f.height ? `${f.height}p` : undefined),
            fps: f.fps,
            fileSize: f.contentLength ? parseInt(f.contentLength, 10) : undefined,
            label: `${quality} (Direct Stream)`,
            available: true,
            ytdlpFormatId: String(f.itag),
          });
        }

        const audioFormats = info.formats.filter((f) => f.hasAudio && !f.hasVideo);
        if (audioFormats.length > 0) {
          const bestAudio = audioFormats[0];
          formats.push({
            id: stableFormatIdFromKey(`yt-audio-${bestAudio.itag}`),
            type: "audio",
            format: "m4a",
            quality: "Audio",
            label: `${bestAudio.audioBitrate || 128} kbps High Quality Audio`,
            available: true,
            ytdlpFormatId: String(bestAudio.itag),
          });
        }

        if (formats.length > 0) {
          return {
            success: true,
            platform: "youtube",
            media: {
              title: details.title,
              thumbnail:
                details.thumbnails?.[details.thumbnails.length - 1]?.url ||
                details.thumbnails?.[0]?.url,
              platform: "youtube",
              creator: details.author?.name,
              duration: parseInt(details.lengthSeconds || "0", 10),
              description: details.description || undefined,
              isPublic: true,
              watermarkNote: "Direct audio & video streams available.",
            },
            formats,
          };
        }
      }
    } catch (err) {
      console.warn("[youtubeAdapter] ytdl.getInfo skipped or timed out:", err);
    }

    return {
      success: false,
      platform: "youtube",
      media: { platform: "youtube" },
      formats: [],
      error: "Could not access this YouTube video. Please ensure the link is public and accessible.",
      errorCode: "YOUTUBE_UNAVAILABLE",
    };
  },
  getFormatSelector(formatId: string, formats: MediaFormat[]): string {
    const match = formats.find((f) => f.id === formatId);
    return match?.ytdlpFormatId || "18";
  },
};

export async function downloadYouTubeStream(
  url: string,
  itagOrSelector: string,
  outputPath: string,
  options?: { audioOnly?: boolean },
): Promise<void> {
  const isAudio = options?.audioOnly;
  
  // ytdl-core is currently hanging on Vercel due to YouTube changes.
  // We rely entirely on yt-dlp which now uses the tv client to bypass bot checks.
  let format = itagOrSelector;
  
  if (!Number.isNaN(parseInt(format, 10))) {
    format = isAudio ? "140/bestaudio/best" : "22/18/best[ext=mp4]/best";
  }

  await downloadWithYtDlp(url, format, outputPath, options);
}
