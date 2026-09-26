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

  if (/members.only|join this channel|exclusive perks|member.?only/i.test(message)) {
    return "This is a members-only video. You must be a paying channel member to access it.";
  }
  if (/private|login|sign in|authentication/i.test(message)) {
    return "This content isn't publicly accessible.";
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
  if (/confirm.*not a bot|bot|captcha|verify/i.test(message)) {
    return "YouTube is blocking automated access. Please try again in a moment.";
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
  return "We couldn't access this media right now. Please try a different URL.";
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

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    args.push("youtube:player_client=ios,web");
    args.push("youtube:player_skip=web");
  } else if (lowerUrl.includes("instagram.com")) {
    args.push("instagram:player_client=web");
  } else if (lowerUrl.includes("tiktok.com")) {
    args.push("tiktok:player_client=web");
  } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
    args.push("twitter:player_client=web");
  } else if (lowerUrl.includes("facebook.com")) {
    args.push("facebook:player_client=web");
  } else if (lowerUrl.includes("reddit.com")) {
    args.push("reddit:player_client=web");
  } else if (lowerUrl.includes("pinterest.com")) {
    args.push("pinterest:player_client=web");
  } else if (lowerUrl.includes("vimeo.com")) {
    args.push("vimeo:player_client=web");
  } else if (lowerUrl.includes("threads.com")) {
    args.push("threads:player_client=web");
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
  const args = [
    ...ytDlpGlobalArgs(),
    "-f",
    formatSelector,
    "--no-playlist",
    "--no-warnings",
    "--no-part",
    "-o",
    outputPath,
  ];

  if (options?.audioOnly) {
    args.push("--extract-audio", "--audio-format", "m4a");
  } else {
    args.push("--merge-output-format", "mp4", "--remux-video", "mp4");
  }

  args.push(url);

  await runYtDlp(args, DOWNLOAD_TIMEOUT_MS);
}

export function stableFormatId(format: YtDlpFormat): string {
  const raw = `${format.format_id}-${format.ext}-${format.height ?? ""}-${format.vcodec ?? ""}`;
  return `format_${createHash("sha256").update(raw).digest("hex").slice(0, 12)}`;
}
