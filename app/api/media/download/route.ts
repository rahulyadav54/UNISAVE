import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateMediaUrl, hashUrl } from "@/server/security/url-validator";
import { checkRateLimit } from "@/server/security/rate-limit";
import { getAdapterForUrl } from "@/server/platforms/registry";
import { getCachedAnalyze, createDownloadJob } from "@/server/queue/job-store";
import { enqueueDownloadJob } from "@/server/queue/download-queue";
import { processDownloadJob } from "@/server/workers/process-download";
import { getQueueMode } from "@/server/redis/client";

const bodySchema = z.object({
  url: z.string().min(1).max(2048),
  formatId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const rate = await checkRateLimit(`download:${ip}`, 20);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "You're making requests too quickly. Please try again shortly.",
        errorCode: "RATE_LIMIT",
      },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid download request." },
      { status: 400 },
    );
  }

  const validation = await validateMediaUrl(parsed.data.url);
  if (!validation.valid || !validation.normalized) {
    return NextResponse.json(
      { success: false, error: validation.error, errorCode: validation.errorCode },
      { status: 400 },
    );
  }

  const url = validation.normalized;
  const adapter = getAdapterForUrl(url);
  if (!adapter) {
    return NextResponse.json(
      {
        success: false,
        error: "UNISAVE doesn't support this platform yet.",
        errorCode: "UNSUPPORTED_PLATFORM",
      },
      { status: 422 },
    );
  }

  const urlHash = hashUrl(url);
  const cached = await getCachedAnalyze(urlHash);
  const formats = cached?.formats ?? [];
  if (!formats.some((f) => f.id === parsed.data.formatId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Please analyze the URL again before downloading.",
        errorCode: "FORMAT_NOT_FOUND",
      },
      { status: 400 },
    );
  }

  const job = await createDownloadJob(
    url,
    adapter.id,
    parsed.data.formatId,
    formats,
    urlHash,
  );

  const enqueued = await enqueueDownloadJob(job.id);
  if (!enqueued) {
    void processDownloadJob(job.id);
  }

  return NextResponse.json({
    success: true,
    jobId: job.id,
    status: job.status,
    queueMode: getQueueMode(),
    processing: enqueued ? "worker" : "inline",
  });
}
