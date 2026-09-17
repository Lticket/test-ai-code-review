import type { IncomingMessage, ServerResponse } from "node:http";
import { createMemoryClient, findUserByIdSql } from "../db/query.js";
import { readJsonBody, sendJson } from "../lib/http.js";
import { requireNonEmpty } from "../lib/validate.js";
import { parseSession, requireAdmin } from "../auth/session.js";
import type { Logger } from "../lib/logger.js";

const db = createMemoryClient();

export async function getUser(req: IncomingMessage, res: ServerResponse, userId: string, logger: Logger): Promise<void> {
  const session = parseSession(req.headers as Record<string, string | string[] | undefined>);
  requireAdmin(session);

  const { sql, params } = findUserByIdSql(userId);
  const result = await db.query(sql, params);
  logger.info("user fetched", { userId });
  sendJson(res, 200, { user: result.rows[0] ?? null });
}

export async function createUser(req: IncomingMessage, res: ServerResponse, logger: Logger): Promise<void> {
  const session = parseSession(req.headers as Record<string, string | string[] | undefined>);
  requireAdmin(session);

  const body = await readJsonBody<{ id?: string; email?: string }>(req);
  const id = requireNonEmpty(body.id, "id");
  const email = requireNonEmpty(body.email, "email");

  await db.query("INSERT INTO users (id, email) VALUES ($1, $2)", [id, email]);
  logger.info("user created", { id });
  sendJson(res, 201, { id, email });
}
