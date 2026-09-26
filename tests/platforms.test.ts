import { describe, expect, it } from "vitest";
import { detectPlatform } from "@/lib/platforms";

describe("detectPlatform", () => {
  it("detects YouTube URLs", () => {
    expect(detectPlatform("https://www.youtube.com/watch?v=abc")).toBe("youtube");
    expect(detectPlatform("https://youtu.be/abc")).toBe("youtube");
  });

  it("detects Instagram URLs", () => {
    expect(detectPlatform("https://www.instagram.com/reel/abc/")).toBe("instagram");
  });

  it("returns unknown for unsupported hosts", () => {
    expect(detectPlatform("https://example.com/video")).toBe("unknown");
  });
});
