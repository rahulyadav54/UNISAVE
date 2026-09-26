import { getRedisClient, isRedisEnabled } from "@/server/redis/client";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

interface Bucket {
  count: number;
  resetAt: number;
}

const memoryBuckets = new Map<string, Bucket>();

export async function checkRateLimit(
  key: string,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (isRedisEnabled()) {
    const client = getRedisClient();
    if (client) {
      try {
        if (client.status !== "ready") await client.connect();
        const redisKey = `ratelimit:${key}`;
        const count = await client.incr(redisKey);
        if (count === 1) {
          await client.pexpire(redisKey, windowMs);
        }
        if (count > limit) {
          const ttl = await client.pttl(redisKey);
          return {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil(ttl / 1000)),
          };
        }
        return { allowed: true };
      } catch {
        // fall through to memory
      }
    }
  }

  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { allowed: true };
}
