import path from "node:path";
import { stat, readdir } from "node:fs/promises";
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
    let formatSelector = adapter.getFormatSelector(
      pending.formatId,
      pending.formats,
    );
    const audioOnly = selected?.type === "audio";

    await updateJob(jobId, { progress: 35 });

    const root = await ensureStorageDir();
    const tempName = `${jobId}.%(ext)s`;
    const outputTemplate = path.join(root, tempName);

    if (formatSelector.startsWith("http://") || formatSelector.startsWith("https://")) {
      // Direct stream URL
      const { writeFile } = await import("node:fs/promises");
      const targetExtension = audioOnly ? "m4a" : "mp4";
      const targetFilePath = path.join(root, `${jobId}.${targetExtension}`);
      const directRes = await fetch(formatSelector, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!directRes.ok) throw new Error(`Failed to fetch media stream (${directRes.status})`);
      const arrayBuffer = await directRes.arrayBuffer();
      await writeFile(targetFilePath, Buffer.from(arrayBuffer));
    } else if (pending.platform === "youtube") {
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
        console.warn("[processDownloadJob] Primary selector failed, trying progressive stream...", downloadErr);
        const progressiveSelector = audioOnly
          ? "bestaudio/best"
          : "bestvideo+bestaudio/best[vcodec!=none][acodec!=none]/hd/sd/best[ext=mp4]/best";
        await downloadWithYtDlp(pending.url, progressiveSelector, outputTemplate, {
          audioOnly,
        });
      }
    }

    await updateJob(jobId, { progress: 85 });

    const files = await readdir(root);
    const matchingFiles = files.filter((f) => f.startsWith(jobId) && !f.endsWith(".part") && !f.endsWith(".ytdl"));

    let downloadedFile: string | undefined;

    if (audioOnly) {
      downloadedFile = matchingFiles.find((f) => f.endsWith(".m4a") || f.endsWith(".mp3") || f.endsWith(".aac") || f.endsWith(".ogg")) || matchingFiles[0];
    } else {
      // For video, strictly find video files and choose the largest one
      const videoFiles = matchingFiles.filter((f) =>
        f.endsWith(".mp4") || f.endsWith(".webm") || f.endsWith(".mkv") || f.endsWith(".mov") || f.endsWith(".avi")
      );

      if (videoFiles.length > 0) {
        // Sort by file size descending so we get the full video
        const withSizes = await Promise.all(
          videoFiles.map(async (f) => ({
            name: f,
            size: (await stat(path.join(root, f))).size,
          }))
        );
        withSizes.sort((a, b) => b.size - a.size);
        downloadedFile = withSizes[0].name;
      }
    }

    if (!downloadedFile) {
      if (!audioOnly) {
        throw new Error("Could not extract a valid video stream from this link. Please verify the link is public.");
      }
      throw new Error("Download completed but media file was not found.");
    }

    const fullPath = path.join(root, downloadedFile);
    const ext = path.extname(downloadedFile).replace(".", "") || (audioOnly ? "m4a" : "mp4");
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
