import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/server/queue/job-store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json(
      { status: "failed", error: "Job not found.", errorCode: "JOB_NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: job.status,
    progress: job.progress,
    downloadUrl: job.downloadUrl,
    fileName: job.fileName,
    error: job.error,
  });
}
