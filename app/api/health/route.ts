import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { getQueueMode, pingRedis } from "@/server/redis/client";
import { getYtDlpBinary } from "@/server/services/ytdlp";

async function commandExists(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, ["-version"], { windowsHide: true, stdio: "ignore" });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

export async function GET() {
  const redisConnected = await pingRedis();
  const ffmpegAvailable = await commandExists(process.env.FFMPEG_PATH || "ffmpeg");

  return NextResponse.json({
    status: "ok",
    service: "unisave",
    queueMode: getQueueMode(),
    redis: {
      configured: getQueueMode() === "redis",
      connected: redisConnected,
    },
    mediaProcessor: {
      ytDlp: getYtDlpBinary(),
      ffmpegAvailable,
    },
    timestamp: new Date().toISOString(),
  });
}
