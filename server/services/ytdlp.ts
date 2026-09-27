import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, chmodSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export interface YtDlpFormat {
  format_id: string;
  ext?: string;
  resolution?: string;
  height?: number;
  width?: number;
  vcodec?: string;
  acodec?: string;
  filesize?: number;
  filesize_approx?: number;
  fps?: number;
  format_note?: string;
  tbr?: number;
}

export interface YtDlpInfo {
  id?: string;
  title?: string;
  thumbnail?: string;
  uploader?: string;
  channel?: string;
  duration?: number;
  description?: string;
  extractor?: string;
  formats?: YtDlpFormat[];
  _type?: string;
}

const DEFAULT_TIMEOUT_MS = 45_000;
const DOWNLOAD_TIMEOUT_MS = 10 * 60_000;

let cachedBinaryPath: string | null = null;
let downloadPromise: Promise<string> | null = null;

export async function ensureYtDlpBinary(): Promise<string> {
  if (process.env.YT_DLP_PATH) {
    return process.env.YT_DLP_PATH;
  }
  if (cachedBinaryPath && existsSync(cachedBinaryPath)) {
    return cachedBinaryPath;
  }
  if (downloadPromise) {
    return downloadPromise;
  }

  downloadPromise = (async () => {
    const isWin = process.platform === "win32";
    const isMac = process.platform === "darwin";
    const isArm64 = process.arch === "arm64";

    const binName = isWin
      ? "yt-dlp.exe"
      : isMac
      ? "yt-dlp_macos"
      : isArm64
      ? "yt-dlp_linux_aarch64"
      : "yt-dlp_linux";

    const binDir = path.join(os.tmpdir(), "unisave-bin");
    const targetPath = path.join(binDir, binName);

    if (existsSync(targetPath)) {
      try {
        if (!isWin) chmodSync(targetPath, 0o755);
      } catch {
        // ignore
      }
      cachedBinaryPath = targetPath;
      return targetPath;
    }

    try {
      await mkdir(binDir, { recursive: true });
      const downloadUrl = isWin
        ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
        : isMac
        ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
        : isArm64
        ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_aarch64"
        : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";

      console.log(`[UNISAVE] Downloading yt-dlp standalone binary from ${downloadUrl}...`);
      const res = await fetch(downloadUrl, {
        headers: { "User-Agent": "Mozilla/5.0 UNISAVE-Downloader" },
      });

      if (!res.ok) {
        throw new Error(`Failed to download yt-dlp binary: ${res.statusText}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      await writeFile(targetPath, Buffer.from(arrayBuffer));
      if (!isWin) {
        chmodSync(targetPath, 0o755);
      }

      console.log(`[UNISAVE] yt-dlp binary ready at ${targetPath}`);
      cachedBinaryPath = targetPath;
      return targetPath;
    } catch (err) {
      console.error("[UNISAVE] Failed to ensure yt-dlp binary:", err);
      return "yt-dlp";
    }
  })();

  return downloadPromise;
}

export function getYtDlpBinary(): string {
  return process.env.YT_DLP_PATH || cachedBinaryPath || "yt-dlp";
}

function ytDlpGlobalArgs(): string[] {
  const args: string[] = [];
  const ffmpeg = process.env.FFMPEG_PATH?.trim();
  if (ffmpeg) {
    args.push("--ffmpeg-location", ffmpeg);
  }
  return args;
}

function mapYtDlpError(message: string): string {
  // Log raw error to server for debugging
  console.error("[yt-dlp raw error]", message);

  if (/confirm.*not a bot|bot|captcha|verify/i.test(message)) {
    return "YouTube requested bot verification on this server. Retrying with alternate client...";
  }
  if (/members.only|join this channel|exclusive perks|member.?only/i.test(message)) {
    return "This is a members-only video. You must be a paying channel member to access it.";
  }
  if (/private video|login to view|sign in to view/i.test(message)) {
    return "This content is private or requires login.";
  }
  if (/unsupported url|no suitable/i.test(message)) {
    return "UNISAVE doesn't support this URL yet.";
  }
  if (/ffmpeg|merging/i.test(message)) {
    return "Video processing requires ffmpeg. Install ffmpeg and try again.";
  }
  if (/requested format|format is not available/i.test(message)) {
    return "That quality is not available for this video. Try another format.";
  }
  if (/age.?gat|age.?restrict|18\+/i.test(message)) {
    return "This content is age-restricted and cannot be accessed.";
  }
  if (/unavailable|removed|deleted|no longer available/i.test(message)) {
    return "This video is unavailable or has been removed.";
  }
  if (/network|connection|timeout|ssl/i.test(message)) {
    return "Network error. Please check your connection and try again.";
  }
  return "Could not download this media. Please try another format or quality.";
}

async function runYtDlp(args: string[], timeoutMs = DEFAULT_TIMEOUT_MS): Promise<string> {
  let bin = process.env.YT_DLP_PATH || "yt-dlp";
  try {
    bin = await ensureYtDlpBinary();
  } catch {
    // fallback
  }

  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Media analysis timed out. Please try again."));
    }, timeoutMs);

    child.on("error", (err) => {
      clearTimeout(timer);
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new Error(
            "Media processor is not configured. Please install yt-dlp or allow automatic binary download.",
          ),
        );
      } else {
        reject(err);
      }
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
        return;
      }
      const message = stderr.trim() || stdout.trim() || `yt-dlp exited with code ${code}`;
      reject(new Error(mapYtDlpError(message)));
    });
  });
}


const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function getExtractorArgs(url: string): string[] {
  const lowerUrl = url.toLowerCase();
  const args: string[] = [];

  // YouTube downloads are handled by ytdl-core (not yt-dlp), so no args needed here.
  // Only add extractor args for platforms that actually support them.
  if (lowerUrl.includes("instagram.com")) {
    // Instagram doesn't use player_client but benefits from no warnings
  } else if (lowerUrl.includes("tiktok.com")) {
    // TikTok works best with defaults
  }

  return args;
}

export async function fetchMediaInfo(url: string): Promise<YtDlpInfo> {
  const args: string[] = [
    ...ytDlpGlobalArgs(),
    "--dump-single-json",
    "--no-playlist",
    "--no-warnings",
    "--add-header",
    `User-Agent:${USER_AGENT}`,
  ];

  const extractorArgs = getExtractorArgs(url);
  if (extractorArgs.length > 0) {
    args.push("--extractor-args", extractorArgs.join(";"));
  }

  args.push(url);

  let output: string;
  try {
    output = await runYtDlp(args);
  } catch (firstErr) {
    const fallbackArgs = [
      ...ytDlpGlobalArgs(),
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      "--add-header",
      `User-Agent:${USER_AGENT}`,
      url,
    ];
    try {
      output = await runYtDlp(fallbackArgs);
    } catch {
      throw firstErr;
    }
  }

  const parsed = JSON.parse(output) as YtDlpInfo;
  return parsed;
}

export async function downloadWithYtDlp(
  url: string,
  formatSelector: string,
  outputPath: string,
  options?: { audioOnly?: boolean },
): Promise<void> {
  const isAudio = Boolean(options?.audioOnly);

  const baseArgs = [
    ...ytDlpGlobalArgs(),
    "--no-playlist",
    "--no-warnings",
    "--no-part",
    "--add-header",
    `User-Agent:${USER_AGENT}`,
  ];

  const extractorArgs = getExtractorArgs(url);
  if (extractorArgs.length > 0) {
    baseArgs.push("--extractor-args", extractorArgs.join(";"));
  }

  const primaryArgs = [
    ...baseArgs,
    "-f",
    formatSelector,
    "-o",
    outputPath,
  ];

  if (isAudio) {
    primaryArgs.push("--extract-audio", "--audio-format", "m4a");
  } else {
    const ffmpeg = process.env.FFMPEG_PATH?.trim();
    if (ffmpeg) {
      primaryArgs.push("--merge-output-format", "mp4", "--remux-video", "mp4");
    }
  }

  primaryArgs.push(url);

  try {
    await runYtDlp(primaryArgs, DOWNLOAD_TIMEOUT_MS);
  } catch (err) {
    console.warn("[downloadWithYtDlp] Primary selector failed, trying fallback format...", err);

    // Fallback attempt: use standard progressive mp4 stream (hd/sd/best)
    const fallbackSelector = isAudio
      ? "bestaudio/best"
      : "hd/sd/best[ext=mp4]/best/worst";
    const fallbackArgs = [
      ...baseArgs,
      "-f",
      fallbackSelector,
      "-o",
      outputPath,
    ];

    if (isAudio) {
      fallbackArgs.push("--extract-audio", "--audio-format", "m4a");
    }

    fallbackArgs.push(url);
    await runYtDlp(fallbackArgs, DOWNLOAD_TIMEOUT_MS);
  }
}

export function stableFormatId(format: YtDlpFormat): string {
  const raw = `${format.format_id}-${format.ext}-${format.height ?? ""}-${format.vcodec ?? ""}`;
  return `format_${createHash("sha256").update(raw).digest("hex").slice(0, 12)}`;
}
