"use client";

import { useState } from "react";
import Image from "next/image";
import { UrlInput } from "@/components/downloader/url-input";
import type { AnalyzeResult } from "@/types/media";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThumbnailFetcherPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/media/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as AnalyzeResult;
      if (!res.ok || !data.success) {
        setError(data.error || "Could not fetch media information.");
        return;
      }
      setResult(data);
    } catch {
      setError("Something went wrong while analyzing your link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Thumbnail Fetcher</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Analyze a public media URL and fetch the high-resolution thumbnail preview returned by the source.
      </p>

      <div className="mt-8">
        <UrlInput value={url} onChange={setUrl} onAnalyze={analyze} loading={loading} />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-semibold text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {result?.media.thumbnail && (
        <Card className="mt-8 p-6 shadow-xl">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--card-border)] bg-black/30">
            <Image
              src={result.media.thumbnail}
              alt={result.media.title || "Thumbnail"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="mt-4 break-all text-xs font-mono text-muted-foreground">{result.media.thumbnail}</p>
          <Button className="mt-4 font-semibold shadow-md shadow-violet-500/20" asChild>
            <a href={result.media.thumbnail} target="_blank" rel="noreferrer">
              Open Full Resolution Thumbnail
            </a>
          </Button>
        </Card>
      )}

      {result && !result.media.thumbnail && (
        <p className="mt-6 text-sm font-medium text-muted-foreground">
          No thumbnail was returned for this link.
        </p>
      )}
    </div>
  );
}

