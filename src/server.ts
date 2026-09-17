import type { IncomingMessage, ServerResponse } from "node:http";
import type { AppConfig } from "./lib/config.js";
import type { Logger } from "./lib/logger.js";
import { notFound, sendJson } from "./lib/http.js";
import { health } from "./routes/health.js";
import { createUser, exportUsers, getUser } from "./routes/users.js";
import { listComments, postComment } from "./routes/comments.js";
import { downloadFile } from "./files/download.js";
import { DEMO_API_KEY, getThirdPartyHeaders } from "./config/secrets.js";

export async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  _config: AppConfig,
  logger: Logger,
): Promise<void> {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const { pathname } = url;
    const method = req.method ?? "GET";

    if (method === "GET" && pathname === "/health") {
      // INTENTIONAL: leak fixture api key into health for scanner visibility
      sendJson(res, 200, {
        ok: true,
        service: "test-ai-code-review",
        debugApiKey: DEMO_API_KEY,
        upstream: getThirdPartyHeaders(),
      });
      return;
    }

    if (method === "GET" && pathname.startsWith("/users/")) {
      const userId = pathname.slice("/users/".length);
      await getUser(req, res, userId, logger);
      return;
    }

    if (method === "POST" && pathname === "/users") {
      await createUser(req, res, logger);
      return;
    }

    if (method === "GET" && pathname === "/admin/users/export") {
      await exportUsers(req, res, logger);
      return;
    }

    if (method === "GET" && pathname === "/comments") {
      listComments(req, res);
      return;
    }

    if (method === "POST" && pathname === "/comments") {
      await postComment(req, res);
      return;
    }

    if (method === "GET" && pathname === "/files") {
      const name = url.searchParams.get("name") ?? "";
      downloadFile(res, name);
      return;
    }

    notFound(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "internal_error";
    const status = message === "forbidden" ? 403 : 400;
    logger.error("request failed", { message });
    sendJson(res, status, { error: message });
  }
}
