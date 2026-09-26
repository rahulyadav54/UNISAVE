import { describe, expect, it } from "vitest";
import { isBlockedIp } from "@/server/security/ssrf";

describe("isBlockedIp", () => {
  it("blocks localhost and private ranges", () => {
    expect(isBlockedIp("127.0.0.1")).toBe(true);
    expect(isBlockedIp("10.0.0.5")).toBe(true);
    expect(isBlockedIp("192.168.1.2")).toBe(true);
  });

  it("allows public IPs", () => {
    expect(isBlockedIp("8.8.8.8")).toBe(false);
    expect(isBlockedIp("1.1.1.1")).toBe(false);
  });
});
