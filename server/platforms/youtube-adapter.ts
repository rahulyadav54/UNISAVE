import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import ytdl from "@distube/ytdl-core";
import type { PlatformAdapter } from "./types";
import type { AnalyzeResult, MediaFormat, MediaInfo } from "@/types/media";
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
    try {
      const info = await ytdl.getInfo(url);
      const details = info.videoDetails;

      const formats: MediaFormat[] = [];
      const seen = new Set<string>();

      // Progressive formats (both video and audio included)
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

      // If no progressive formats found, check adaptive video formats
      if (formats.length === 0) {
        const videoFormats = info.formats.filter((f) => f.hasVideo);
        for (const f of videoFormats) {
          const quality = f.qualityLabel || `${f.height}p` || "HD";
          if (seen.has(quality)) continue;
          seen.add(quality);

          formats.push({
            id: stableFormatIdFromKey(`yt-vid-${f.itag}`),
            type: "video",
            format: f.container || "mp4",
            quality,
            resolution: f.qualityLabel || (f.height ? `${f.height}p` : undefined),
            label: `${quality} Video`,
            available: true,
            ytdlpFormatId: String(f.itag),
          });
        }
      }

      // Best Audio Format
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

      const media: MediaInfo = {
        title: details.title,
        thumbnail: details.thumbnails?.[details.thumbnails.length - 1]?.url || details.thumbnails?.[0]?.url,
        platform: "youtube",
        creator: details.author?.name,
        duration: parseInt(details.lengthSeconds || "0", 10),
        description: details.description || undefined,
        isPublic: true,
        watermarkNote: "Direct audio & video streams available.",
      };

      if (formats.length > 0) {
        return {
          success: true,
          platform: "youtube",
          media,
          formats,
        };
      }
    } catch (err) {
      console.warn("[youtubeAdapter] ytdl.getInfo failed, attempting fallback extractor...", err);
    }

    // Fallback extraction
    const fallback = await tryFallbackAnalysis(url, "youtube");
    if (fallback && fallback.success && fallback.formats.length > 0) {
      return fallback;
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
  const itagNum = parseInt(itagOrSelector, 10);

  // Try pure JS stream download first
  if (!Number.isNaN(itagNum)) {
    try {
      console.log(`[downloadYouTubeStream] Streaming YouTube itag ${itagNum} to ${outputPath}...`);
      const stream = ytdl(url, {
        quality: itagNum,
        filter: options?.audioOnly ? "audioonly" : undefined,
        highWaterMark: 1 << 25,
      });

      const writeStream = createWriteStream(outputPath);
      await pipeline(stream, writeStream);
      console.log(`[downloadYouTubeStream] Stream download completed for ${outputPath}`);
      return;
    } catch (streamErr) {
      console.warn("[downloadYouTubeStream] Native ytdl stream failed, attempting yt-dlp fallback...", streamErr);
    }
  }

  // Fallback to yt-dlp binary with android/ios client
  const format = options?.audioOnly ? "140/bestaudio/best" : "22/18/best[ext=mp4]/best";
  await downloadWithYtDlp(url, format, outputPath, options);
}
