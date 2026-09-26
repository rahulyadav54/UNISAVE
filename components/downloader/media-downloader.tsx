"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyzeResult } from "@/types/media";
import { UrlInput } from "./url-input";
import { AnalyzeProgress } from "./analyze-progress";
import { MediaResultCard } from "@/components/media-result/media-result-card";
import { useDownloadHistory } from "@/hooks/use-download-history";

type FlowState = "idle" | "analyzing" | "result" | "error";

export function MediaDownloader({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [state, setState] = useState<FlowState>("idle");
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "processing" | "ready" | "error"
  >("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>();
  const [downloadFileName, setDownloadFileName] = useState<string>();
  const [downloadError, setDownloadError] = useState<string>();
  const { addItem } = useDownloadHistory();

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  const analyze = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setState("analyzing");
    setError(null);
    setResult(null);
    setDownloadStatus("idle");
    setDownloadFileName(undefined);
    setAnalyzeStep(0);

    const timers = [0, 1, 2, 3].map((step, i) =>
      window.setTimeout(() => setAnalyzeStep(step), i * 450),
    );

    try {
      const res = await fetch("/api/media/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as AnalyzeResult & { retryAfter?: number };

      timers.forEach(clearTimeout);

      if (!res.ok || !data.success) {
        setState("error");
        setError(
          data.error ||
            (res.status === 429
              ? "You're making requests too quickly. Please try again shortly."
              : "We couldn't analyze this link."),
        );
        return;
      }

      setAnalyzeStep(4);
      setResult(data);
      setState("result");
    } catch {
      timers.forEach(clearTimeout);
      setState("error");
      setError("Something went wrong while analyzing your link.");
    }
  }, [url]);

  const pollJob = useCallback(async (jobId: string) => {
    const poll = async () => {
      const res = await fetch(`/api/media/status/${jobId}`);
      const data = await res.json();
      setDownloadProgress(data.progress ?? 0);

      if (data.status === "completed" && data.downloadUrl) {
        setDownloadProgress(100);
        setTimeout(() => {
          setDownloadStatus("ready");
          setDownloadUrl(data.downloadUrl);
          if (data.fileName) setDownloadFileName(data.fileName);
          if (result) {
            const format = result.formats.find((f) => f.id === data.formatId);
            addItem({
              title: result.media.title || "Download",
              platform: result.platform,
              format: format?.format || "file",
              thumbnail: result.media.thumbnail,
            });
          }
        }, 800);
        return;
      }
      if (data.status === "failed" || data.status === "expired") {
        setDownloadStatus("error");
        setDownloadError(
          data.error || "Something went wrong while preparing your media.",
        );
        return;
      }
      setTimeout(poll, 800);
    };
    await poll();
  }, [addItem, result]);

  const download = useCallback(
    async (formatId: string) => {
      if (!result) return;
      setDownloadStatus("processing");
      setDownloadProgress(8);
      setDownloadError(undefined);

      try {
        const res = await fetch("/api/media/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), formatId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setDownloadStatus("error");
          setDownloadError(data.error || "Download could not be started.");
          return;
        }

        if (data.status === "completed" && data.downloadUrl) {
          setDownloadProgress(100);
          // Allow the progress bar to animate to 100% smoothly before showing the button
          setTimeout(() => {
            setDownloadStatus("ready");
            setDownloadUrl(data.downloadUrl);
            if (data.fileName) setDownloadFileName(data.fileName);
            const format = result.formats.find((f) => f.id === formatId);
            addItem({
              title: result.media.title || "Download",
              platform: result.platform,
              format: format?.format || "file",
              thumbnail: result.media.thumbnail,
            });
          }, 800);
          return;
        }

        await pollJob(data.jobId);
      } catch {
        setDownloadStatus("error");
        setDownloadError("Something went wrong while preparing your media.");
      }
    },
    [pollJob, result, url],
  );

  return (
    <div className="space-y-6">
      <UrlInput
        value={url}
        onChange={setUrl}
        onAnalyze={analyze}
        loading={state === "analyzing"}
      />
      <p className="text-xs text-muted">
        Tip: Press{" "}
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-1.5 py-0.5 text-[var(--foreground)]">
          Ctrl
        </kbd>
        +
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-1.5 py-0.5 text-[var(--foreground)]">
          K
        </kbd>{" "}
        to focus the URL field.
      </p>

      {state === "analyzing" && <AnalyzeProgress activeStep={analyzeStep} />}

      {state === "error" && error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {state === "result" && result && (
        <MediaResultCard
          result={result}
          onDownload={download}
          downloadStatus={downloadStatus}
          downloadProgress={downloadProgress}
          downloadUrl={downloadUrl}
          downloadFileName={downloadFileName}
          downloadError={downloadError}
        />
      )}
    </div>
  );
}
