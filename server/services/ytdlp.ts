import { spawn } from "node:child_process";
import { createHash } from "node:crypto";

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

export function getYtDlpBinary(): string {
  return process.env.YT_DLP_PATH || "yt-dlp";
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
  if (/private|login|sign in|authentication|members only/i.test(message)) {
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
  return "We couldn't access this media right now.";
}

function runYtDlp(args: string[], timeoutMs = DEFAULT_TIMEOUT_MS): Promise<string> {
  return new Promise((resolve, reject) => {
    const bin = getYtDlpBinary();
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
            "Media processor is not configured. Install yt-dlp and set YT_DLP_PATH in your environment.",
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

export async function fetchMediaInfo(url: string): Promise<YtDlpInfo> {
  const output = await runYtDlp([
    ...ytDlpGlobalArgs(),
    "--dump-single-json",
    "--no-playlist",
    "--no-warnings",
    url,
  ]);
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
