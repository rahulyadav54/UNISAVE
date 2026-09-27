import path from "node:path";
import { getAdapterForUrl } from "@/server/platforms/registry";
import { downloadWithYtDlp } from "@/server/services/ytdlp";
import {
  completeJob,
  failJob,
  getPendingDownload,
  updateJob,
} from "@/server/queue/job-store";
import { ensureStorageDir, registerFile } from "@/server/storage/temp-storage";
import { sanitizeFileName } from "@/server/security/filename";

function mimeFromExtension(ext: string): string {
  switch (ext.toLowerCase()) {
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      return "audio/mp4";
    case "webm":
      return "video/webm";
    case "mkv":
      return "video/x-matroska";
    case "mov":
      return "video/quicktime";
    default:
      return "video/mp4";
  }
}

export async function processDownloadJob(jobId: string): Promise<void> {
  const pending = await getPendingDownload(jobId);
  if (!pending) {
    await failJob(jobId, "Job not found or already processed.");
    return;
  }

  await updateJob(jobId, { status: "processing", progress: 10 });

  const adapter = getAdapterForUrl(pending.url);
  if (!adapter) {
    await failJob(jobId, "Unsupported platform.");
    return;
  }

  try {
    const selected = pending.formats.find((f) => f.id === pending.formatId);
    const formatSelector = adapter.getFormatSelector(
      pending.formatId,
      pending.formats,
    );
    const audioOnly = selected?.type === "audio";

    await updateJob(jobId, { progress: 35 });

    const root = await ensureStorageDir();
    const tempName = `${jobId}.%(ext)s`;
    const outputTemplate = path.join(root, tempName);

    if (pending.platform === "youtube") {
      const { downloadYouTubeStream } = await import("@/server/platforms/youtube-adapter");
      const targetExtension = audioOnly ? "m4a" : "mp4";
      const targetFilePath = path.join(root, `${jobId}.${targetExtension}`);
      await downloadYouTubeStream(pending.url, formatSelector, targetFilePath, { audioOnly });
    } else {
      try {
        await downloadWithYtDlp(pending.url, formatSelector, outputTemplate, {
          audioOnly,
        });
      } catch (downloadErr) {
        console.warn("[processDownloadJob] Primary download selector failed, trying progressive stream...", downloadErr);
        const progressiveSelector = audioOnly ? "bestaudio/best" : "best[ext=mp4]/best/worst";
        await downloadWithYtDlp(pending.url, progressiveSelector, outputTemplate, {
          audioOnly,
        });
      }
    }

    await updateJob(jobId, { progress: 85 });

    const { readdir } = await import("node:fs/promises");
    const files = await readdir(root);
    const downloaded = files.find((f) => f.startsWith(jobId));
    if (!downloaded) {
      throw new Error("Download completed but file was not found.");
    }

    const fullPath = path.join(root, downloaded);
    const ext = path.extname(downloaded).replace(".", "") || (audioOnly ? "m4a" : "mp4");
    const mime = mimeFromExtension(ext);
    const baseName = sanitizeFileName(
      `unisave-${pending.platform}-${audioOnly ? "audio" : "video"}.${ext}`,
    );

    const stored = registerFile(fullPath, baseName, mime);

    await completeJob(jobId, stored.token, stored.fileName);
  } catch (err) {
    console.error("[processDownloadJob] Fatal error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong while preparing your media.";
    await failJob(jobId, message);
  }
}
