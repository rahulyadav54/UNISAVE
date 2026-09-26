import { getAdapterForUrl } from "@/server/platforms/registry";
import { validateMediaUrl, hashUrl } from "@/server/security/url-validator";
import { cacheAnalyze, getCachedAnalyze } from "@/server/queue/job-store";
import type { AnalyzeResult } from "@/types/media";
import { detectPlatform } from "@/lib/platforms";

export async function analyzeMediaUrl(rawUrl: string): Promise<AnalyzeResult> {
  const validation = await validateMediaUrl(rawUrl);
  if (!validation.valid || !validation.normalized) {
    return {
      success: false,
      platform: "unknown",
      media: { platform: "unknown" },
      formats: [],
      error: validation.error,
      errorCode: validation.errorCode,
    };
  }

  const url = validation.normalized;
  const platform = detectPlatform(url);
  if (platform === "unknown") {
    return {
      success: false,
      platform: "unknown",
      media: { platform: "unknown" },
      formats: [],
      error: "UNISAVE doesn't support this platform yet.",
      errorCode: "UNSUPPORTED_PLATFORM",
    };
  }

  const urlHash = hashUrl(url);
  const cached = await getCachedAnalyze(urlHash);
  if (cached?.result) {
    return cached.result as AnalyzeResult;
  }

  const adapter = getAdapterForUrl(url);
  if (!adapter) {
    return {
      success: false,
      platform,
      media: { platform },
      formats: [],
      error: "UNISAVE doesn't support this platform yet.",
      errorCode: "UNSUPPORTED_PLATFORM",
    };
  }

  const adapterValidation = adapter.validate(url);
  if (!adapterValidation.valid) {
    return {
      success: false,
      platform,
      media: { platform },
      formats: [],
      error: adapterValidation.error,
      errorCode: "INVALID_PLATFORM_URL",
    };
  }

  const result = await adapter.analyze(url);
  if (result.success) {
    await cacheAnalyze(urlHash, result, result.formats);
  }
  return result;
}
