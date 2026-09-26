"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { AnalyzeResult, MediaFormat } from "@/types/media";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/platform/platform-icon";
import { formatDuration, formatFileSize } from "@/lib/utils";
import type { PlatformId } from "@/types/platform";
import { Progress } from "@/components/ui/progress";

interface MediaResultCardProps {
  result: AnalyzeResult;
  onDownload: (formatId: string) => Promise<void>;
  downloadProgress?: number;
  downloadStatus?: "idle" | "processing" | "ready" | "error";
  downloadUrl?: string;
  downloadFileName?: string;
  downloadError?: string;
}

export function MediaResultCard({
  result,
  onDownload,
  downloadProgress = 0,
  downloadStatus = "idle",
  downloadUrl,
  downloadFileName,
  downloadError,
}: MediaResultCardProps) {
  const videoFormats = useMemo(
    () => result.formats.filter((f) => f.type === "video"),
    [result.formats],
  );
  const audioFormats = useMemo(
    () => result.formats.filter((f) => f.type === "audio"),
    [result.formats],
  );

  const [mediaKind, setMediaKind] = useState<"video" | "audio">(
    videoFormats.length ? "video" : "audio",
  );

  const activeFormats = mediaKind === "video" ? videoFormats : audioFormats;
  const defaultFormat = activeFormats[0] ?? result.formats[0];
  const [selectedId, setSelectedId] = useState(defaultFormat?.id ?? "");

  useEffect(() => {
    const nextKind = videoFormats.length ? "video" : "audio";
    setMediaKind(nextKind);
    const list = nextKind === "video" ? videoFormats : audioFormats;
    setSelectedId(list[0]?.id ?? result.formats[0]?.id ?? "");
  }, [result, videoFormats, audioFormats]);

  useEffect(() => {
    const first = activeFormats[0];
    if (first && !activeFormats.some((f) => f.id === selectedId)) {
      setSelectedId(first.id);
    }
  }, [mediaKind, activeFormats, selectedId]);

  const selected = result.formats.find((f) => f.id === selectedId);

  const qualities = useMemo(() => {
    return activeFormats.filter((f) => f.quality || f.label);
  }, [activeFormats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden p-6 sm:p-8 shadow-xl">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--card-border)] bg-black/30 shadow-inner">
            {result.media.thumbnail ? (
              <Image
                src={result.media.thumbnail}
                alt={result.media.title || "Media thumbnail"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No thumbnail
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PlatformIcon platform={result.platform as PlatformId} />
              <span className="rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {formatDuration(result.media.duration)}
              </span>
              {result.media.isPublic && (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Public Media
                </span>
              )}
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {result.media.title || "Untitled media"}
            </h3>
            {result.media.creator && (
              <p className="mt-1 text-sm font-medium text-muted-foreground">by {result.media.creator}</p>
            )}
            {result.media.watermarkNote && (
              <p className="mt-2 text-xs font-medium text-muted-foreground/80">{result.media.watermarkNote}</p>
            )}
          </div>
        </div>

        {(videoFormats.length > 0 || audioFormats.length > 0) && (
          <div className="mt-6 flex gap-2">
            {videoFormats.length > 0 && (
              <button
                type="button"
                onClick={() => setMediaKind("video")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  mediaKind === "video"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "bg-[var(--input-bg)] text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                }`}
              >
                Video Formats
              </button>
            )}
            {audioFormats.length > 0 && (
              <button
                type="button"
                onClick={() => setMediaKind("audio")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  mediaKind === "audio"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "bg-[var(--input-bg)] text-muted-foreground hover:bg-violet-500/10 hover:text-foreground"
                }`}
              >
                Audio Formats
              </button>
            )}
          </div>
        )}

        {mediaKind === "video" && (
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            Video downloads are merged with audio when required so files play with full sound.
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Select Quality</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {qualities.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                    selectedId === f.id
                      ? "border-violet-500 bg-violet-600/15 text-violet-600 dark:text-violet-300 shadow-sm"
                      : "border-[var(--card-border)] bg-[var(--input-bg)] text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                  }`}
                >
                  {f.quality || f.label || f.format}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Format Options</p>
            <select
              className="mt-2.5 h-11 w-full rounded-xl border border-[var(--input-border)] bg-[var(--card-bg)] px-3.5 text-sm font-medium text-foreground focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {activeFormats.map((f: MediaFormat) => (
                <option key={f.id} value={f.id} className="bg-[var(--background)] text-foreground">
                  {(f.quality || f.label || f.type).toUpperCase()} · {f.format.toUpperCase()}
                  {f.fileSize ? ` · ${formatFileSize(f.fileSize)}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {downloadStatus === "processing" && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-sm font-semibold text-foreground">Preparing your media download...</p>
              <Progress value={downloadProgress} className="mt-3" />
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">{downloadProgress}% completed</p>
            </div>
          )}

          {downloadStatus === "ready" && downloadUrl && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Your media file is ready!</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" asChild>
                <a
                  href={downloadUrl}
                  download={downloadFileName || true}
                >
                  Download {mediaKind === "video" ? "Video File" : "Audio File"}
                </a>
              </Button>
            </div>
          )}

          {downloadStatus === "error" && downloadError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-600 dark:text-red-300">{downloadError}</p>
            </div>
          )}

          {downloadStatus === "idle" && (
            <Button
              type="button"
              size="lg"
              disabled={!selected}
              className="w-full sm:w-auto px-8 font-semibold shadow-lg shadow-violet-500/25"
              onClick={() => selected && onDownload(selected.id)}
            >
              Download {mediaKind === "video" ? "Video" : "Audio"}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

