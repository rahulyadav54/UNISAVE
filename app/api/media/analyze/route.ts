import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMediaUrl } from "@/server/services/media-service";
import { checkRateLimit } from "@/server/security/rate-limit";

const bodySchema = z.object({
  url: z.string().min(1).max(2048),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const rate = await checkRateLimit(`analyze:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "You're making requests too quickly. Please try again shortly.",
        errorCode: "RATE_LIMIT",
        retryAfter: rate.retryAfter,
      },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "That doesn't look like a valid media URL.",
        errorCode: "INVALID_URL",
      },
      { status: 400 },
    );
  }

  const result = await analyzeMediaUrl(parsed.data.url);
  const status = result.success ? 200 : 422;
  return NextResponse.json(result, { status });
}
