import Redis from "ioredis";

let sharedClient: Redis | null = null;

export function isRedisEnabled(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;

  if (!sharedClient) {
    sharedClient = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  }
  return sharedClient;
}

export async function pingRedis(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;
  try {
    if (client.status !== "ready") await client.connect();
    const result = await client.ping();
    return result === "PONG";
  } catch {
    return false;
  }
}

export function getQueueMode(): "redis" | "memory" {
  return isRedisEnabled() ? "redis" : "memory";
}
