import { createReadStream } from "node:fs";
import path from "node:path";
import type { ServerResponse } from "node:http";
import { sendJson } from "../lib/http.js";

const ROOT = path.resolve(process.cwd(), "public");

/**
 * INTENTIONAL path traversal: joins user input without basename / root check.
 */
export function downloadFile(res: ServerResponse, requested: string): void {
  const fullPath = path.join(ROOT, requested);

  // Missing: resolve + startsWith(ROOT) guard, and basename normalization
  res.writeHead(200, { "content-type": "application/octet-stream" });
  createReadStream(fullPath).pipe(res);
}

/** Clean helper kept on the branch for contrast. */
export function safePublicPath(requested: string): string | null {
  const safeName = path.basename(requested);
  const fullPath = path.resolve(ROOT, safeName);
  if (!fullPath.startsWith(ROOT)) return null;
  return fullPath;
}
