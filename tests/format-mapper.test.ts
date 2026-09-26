import { describe, expect, it } from "vitest";
import { mapYtDlpFormatsToMediaFormats } from "@/server/services/format-mapper";

describe("mapYtDlpFormatsToMediaFormats", () => {
  it("creates merged video selectors for video-only DASH heights", () => {
    const formats = mapYtDlpFormatsToMediaFormats([
      {
        format_id: "137",
        ext: "mp4",
        height: 1080,
        vcodec: "avc1",
        acodec: "none",
      },
      {
        format_id: "140",
        ext: "m4a",
        acodec: "mp4a",
        vcodec: "none",
      },
    ]);

    const merged1080 = formats.find((f) => f.quality === "1080p" && f.type === "video");
    expect(merged1080).toBeDefined();
    expect(merged1080?.ytdlpFormatId).toContain("bestvideo");
    expect(merged1080?.ytdlpFormatId).toContain("bestaudio");
  });

  it("keeps progressive streams when video and audio are in the same format", () => {
    const formats = mapYtDlpFormatsToMediaFormats([
      {
        format_id: "22",
        ext: "mp4",
        height: 720,
        vcodec: "avc1",
        acodec: "mp4a",
      },
    ]);

    expect(formats.some((f) => f.ytdlpFormatId === "22" && f.quality === "720p")).toBe(
      true,
    );
  });

  it("includes a best merged video option", () => {
    const formats = mapYtDlpFormatsToMediaFormats([
      {
        format_id: "137",
        height: 1080,
        vcodec: "avc1",
        acodec: "none",
      },
    ]);
    expect(formats.some((f) => f.quality === "Best")).toBe(true);
  });
});
