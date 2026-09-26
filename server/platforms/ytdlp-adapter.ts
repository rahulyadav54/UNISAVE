import type { PlatformAdapter } from "./types";
import type { AnalyzeResult, MediaFormat, MediaInfo } from "@/types/media";
import type { PlatformId, PlatformMeta } from "@/types/platform";
import { downloadWithYtDlp, fetchMediaInfo } from "@/server/services/ytdlp";
import { mapYtDlpFormatsToMediaFormats } from "@/server/services/format-mapper";
import { tryFallbackAnalysis } from "@/server/services/fallback-extractor";

export function createYtDlpAdapter(meta: PlatformMeta): PlatformAdapter {
  return {
    id: meta.id,
    name: meta.name,
    canHandle(url: string) {
      return meta.patterns.some((p) => new RegExp(p, "i").test(url.trim()));
    },

    validate(url: string) {
      if (!this.canHandle(url)) {
        return { valid: false, error: "URL does not match this platform." };
      }
      return { valid: true };
    },
    async analyze(url: string): Promise<AnalyzeResult> {
      try {
        const info = await fetchMediaInfo(url);
        const formats = mapYtDlpFormatsToMediaFormats(info.formats);
        const media: MediaInfo = {
          title: info.title,
          thumbnail: info.thumbnail,
          platform: meta.id,
          creator: info.uploader || info.channel,
          duration: info.duration,
          mediaType: info._type,
          description: info.description,
          isPublic: true,
          watermarkNote:
            formats.some((f) => f.hasWatermark)
              ? "Some variants may include platform watermarks."
              : "Original available where provided by the source.",
        };

        if (formats.length === 0) {
          return {
            success: false,
            platform: meta.id,
            media,
            formats: [],
            error: "No downloadable formats were returned for this link.",
            errorCode: "NO_FORMATS",
          };
        }

        return {
          success: true,
          platform: meta.id as PlatformId,
          media,
          formats,
        };
      } catch (err) {
        // Attempt fallback online analysis before giving up
        try {
          const fallbackResult = await tryFallbackAnalysis(url, meta.id as PlatformId);
          if (fallbackResult && fallbackResult.success && fallbackResult.formats.length > 0) {
            return fallbackResult;
          }
        } catch {
          // fallback failed, continue to standard error mapping
        }

        const message = err instanceof Error ? err.message : "Analysis failed.";
        let errorCode = "ANALYZE_FAILED";
        if (message.includes("publicly accessible")) errorCode = "PRIVATE_CONTENT";
        if (message.includes("doesn't support")) errorCode = "UNSUPPORTED";
        if (message.includes("not configured")) errorCode = "NOT_CONFIGURED";
        if (message.includes("timed out")) errorCode = "TIMEOUT";

        return {
          success: false,
          platform: meta.id,
          media: { platform: meta.id },
          formats: [],
          error: message,
          errorCode,
        };
      }
    },
    getFormatSelector(formatId: string, formats: MediaFormat[]): string {
      const match = formats.find((f) => f.id === formatId);
      if (!match?.ytdlpFormatId) {
        throw new Error("Invalid format selection.");
      }
      return match.ytdlpFormatId;
    },
  };
}

export { downloadWithYtDlp };
