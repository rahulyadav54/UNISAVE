import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { getStoredFile, deleteStoredFile } from "@/server/storage/temp-storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const record = getStoredFile(token);
  if (!record) {
    return NextResponse.json(
      { error: "Download link expired or invalid." },
      { status: 404 },
    );
  }

  try {
    const fileStat = await stat(record.filePath);
    const nodeStream = createReadStream(record.filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const response = new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": record.mimeType,
        "Content-Length": String(fileStat.size),
        "Content-Disposition": `attachment; filename="${record.fileName}"`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    });

    nodeStream.on("end", () => {
      void deleteStoredFile(token);
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "File is no longer available." },
      { status: 410 },
    );
  }
}
