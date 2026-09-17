import { createReadStream } from "node:fs";
import path from "node:path";
import type { ServerResponse } from "node:http";
import { sendJson } from "../lib/http.js";

const ROOT = path.resolve(process.cwd(), "public");

export function downloadFile(res: ServerResponse, requested: string): void {
  const safeName = path.basename(requested);
  const fullPath = path.join(ROOT, safeName);

  if (!fullPath.startsWith(ROOT)) {
    sendJson(res, 400, { error: "invalid_path" });
    return;
  }

  res.writeHead(200, { "content-type": "application/octet-stream" });
  createReadStream(fullPath).pipe(res);
}
