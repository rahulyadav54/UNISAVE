import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stat } from "node:fs/promises";
import ytdl from "@distube/ytdl-core";
import type { PlatformAdapter } from "./types";
import type { AnalyzeResult, MediaFormat } from "@/types/media";
import { stableFormatIdFromKey } from "@/server/services/format-mapper";
import { tryFallbackAnalysis } from "@/server/services/fallback-extractor";

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

/**
 * Download a YouTube video/audio using pure Node.js (ytdl-core).
 * This avoids yt-dlp binary entirely — critical for Vercel where
 * yt-dlp gets bot-checked by YouTube on datacenter IPs.
 */
export async function downloadYouTubeStream(
  url: string,
  _itagOrSelector: string,
  outputPath: string,
  options?: { audioOnly?: boolean },
): Promise<void> {
  const isAudio = options?.audioOnly;
  const STREAM_TIMEOUT_MS = 120_000; // 2 minutes max

  // Determine the best quality option for ytdl-core
  const itagNum = parseInt(_itagOrSelector, 10);
  const qualityOpts: ytdl.downloadOptions = {
    highWaterMark: 1 << 25, // 32 MB buffer for fast streaming
  };

  if (!Number.isNaN(itagNum)) {
    // We have a specific itag from ytdl analysis
    qualityOpts.quality = itagNum;
  } else if (isAudio) {
    qualityOpts.quality = "highestaudio";
    qualityOpts.filter = "audioonly";
  } else {
    // For video, prefer progressive streams (has both audio+video)
    qualityOpts.quality = "highest";
    qualityOpts.filter = "audioandvideo";
  }

  console.log(`[downloadYouTubeStream] Starting ytdl-core download: ${url} -> ${outputPath}`);
  console.log(`[downloadYouTubeStream] Options:`, JSON.stringify(qualityOpts));

  // Attempt 1: Try with specific quality
  try {
    await streamWithTimeout(url, outputPath, qualityOpts, STREAM_TIMEOUT_MS);
    return;
  } catch (err1) {
    console.warn("[downloadYouTubeStream] Attempt 1 failed:", err1 instanceof Error ? err1.message : err1);
  }

  // Attempt 2: Try with relaxed quality (any progressive for video, any audio)
  const fallbackOpts: ytdl.downloadOptions = {
    highWaterMark: 1 << 25,
  };
  if (isAudio) {
    fallbackOpts.filter = "audioonly";
  } else {
    fallbackOpts.filter = "audioandvideo";
  }
  console.log(`[downloadYouTubeStream] Retrying with fallback options...`);

  try {
    await streamWithTimeout(url, outputPath, fallbackOpts, STREAM_TIMEOUT_MS);
    return;
  } catch (err2) {
    console.warn("[downloadYouTubeStream] Attempt 2 failed:", err2 instanceof Error ? err2.message : err2);
  }

  // Attempt 3: Absolute last resort - any format
  console.log(`[downloadYouTubeStream] Last resort: downloading any available format...`);
  await streamWithTimeout(url, outputPath, { highWaterMark: 1 << 25 }, STREAM_TIMEOUT_MS);
}

/**
 * Stream a YouTube video to a file with an absolute timeout.
 * Cleans up properly on failure.
 */
async function streamWithTimeout(
  url: string,
  outputPath: string,
  opts: ytdl.downloadOptions,
  timeoutMs: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    let bytesReceived = 0;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { stream.destroy(); } catch { /* ignore */ }
        try { ws.destroy(); } catch { /* ignore */ }
        reject(new Error(`YouTube stream timed out after ${timeoutMs / 1000}s (received ${bytesReceived} bytes)`));
      }
    }, timeoutMs);

    const stream = ytdl(url, opts);
    const ws = createWriteStream(outputPath);

    stream.on("data", (chunk: Buffer) => {
      bytesReceived += chunk.length;
    });

    stream.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        try { ws.destroy(); } catch { /* ignore */ }
        reject(err);
      }
    });

    ws.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        try { stream.destroy(); } catch { /* ignore */ }
        reject(err);
      }
    });

    pipeline(stream, ws)
      .then(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          console.log(`[downloadYouTubeStream] Completed: ${bytesReceived} bytes written to ${outputPath}`);
          resolve();
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      });
  });
}
