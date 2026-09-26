import { describe, expect, it, afterEach } from "vitest";
import { getQueueMode, isRedisEnabled } from "@/server/redis/client";

describe("queue mode", () => {
  const original = process.env.REDIS_URL;

  afterEach(() => {
    process.env.REDIS_URL = original;
  });

  it("uses memory mode without REDIS_URL", () => {
    delete process.env.REDIS_URL;
    expect(isRedisEnabled()).toBe(false);
    expect(getQueueMode()).toBe("memory");
  });

  it("uses redis mode when REDIS_URL is set", () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    expect(isRedisEnabled()).toBe(true);
    expect(getQueueMode()).toBe("redis");
  });
});
