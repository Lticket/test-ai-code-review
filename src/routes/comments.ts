import type { IncomingMessage, ServerResponse } from "node:http";
import { readJsonBody, sendHtml, sendJson } from "../lib/http.js";
import { requireNonEmpty } from "../lib/validate.js";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function postComment(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readJsonBody<{ author?: string; body?: string }>(req);
  const author = escapeHtml(requireNonEmpty(body.author, "author"));
  const text = escapeHtml(requireNonEmpty(body.body, "body"));

  const html = `<!doctype html><html><body><h1>Comment</h1><p><strong>${author}</strong>: ${text}</p></body></html>`;
  sendHtml(res, 201, html);
}

export function listComments(_req: IncomingMessage, res: ServerResponse): void {
  sendJson(res, 200, { comments: [] });
}
