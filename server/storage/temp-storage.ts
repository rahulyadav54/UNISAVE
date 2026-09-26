import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";

const TTL_MS = 30 * 60 * 1000;

export interface StoredFile {
  token: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  expiresAt: number;
}

const tokenIndex = new Map<string, StoredFile>();

const DEFAULT_STORAGE_ROOT = process.env.VERCEL
  ? path.join(os.tmpdir(), "unisave-storage")
  : path.join(process.cwd(), ".storage");

function storageRoot(): string {
  return process.env.STORAGE_PATH || DEFAULT_STORAGE_ROOT;
}


export async function ensureStorageDir(): Promise<string> {
  const root = storageRoot();
  await mkdir(root, { recursive: true });
  return root;
}

export function registerFile(
  filePath: string,
  fileName: string,
  mimeType: string,
  ttlMs = TTL_MS,
): StoredFile {
  const token = randomBytes(24).toString("hex");
  const record: StoredFile = {
    token,
    filePath,
    fileName,
    mimeType,
    expiresAt: Date.now() + ttlMs,
  };
  tokenIndex.set(token, record);
  return record;
}

export function getStoredFile(token: string): StoredFile | null {
  const record = tokenIndex.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    tokenIndex.delete(token);
    return null;
  }
  return record;
}

export async function deleteStoredFile(token: string): Promise<void> {
  const record = tokenIndex.get(token);
  if (!record) return;
  tokenIndex.delete(token);
  try {
    await unlink(record.filePath);
  } catch {
    // ignore
  }
}

export async function cleanupExpiredFiles(): Promise<number> {
  let removed = 0;
  const now = Date.now();
  for (const [token, record] of tokenIndex.entries()) {
    if (now > record.expiresAt) {
      tokenIndex.delete(token);
      try {
        await unlink(record.filePath);
        removed++;
      } catch {
        // ignore
      }
    }
  }

  try {
    const root = await ensureStorageDir();
    const files = await readdir(root);
    for (const file of files) {
      const full = path.join(root, file);
      const s = await stat(full);
      if (now - s.mtimeMs > TTL_MS) {
        await unlink(full).catch(() => undefined);
        removed++;
      }
    }
  } catch {
    // ignore
  }

  return removed;
}
