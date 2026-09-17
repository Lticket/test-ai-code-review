import type { ServerResponse } from "node:http";
import { sendJson } from "../lib/http.js";

export function health(_reqUrl: URL, res: ServerResponse): void {
  sendJson(res, 200, { ok: true, service: "test-ai-code-review" });
}
