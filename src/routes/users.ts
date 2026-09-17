import type { IncomingMessage, ServerResponse } from "node:http";
import { createMemoryClient } from "../db/query.js";
import { readJsonBody, sendJson } from "../lib/http.js";
import { requireNonEmpty } from "../lib/validate.js";
import { parseSession } from "../auth/session.js";
import type { Logger } from "../lib/logger.js";
import { DEMO_DB_PASSWORD } from "../config/secrets.js";

const db = createMemoryClient();

/**
 * INTENTIONAL: missing authorization on a sensitive user lookup.
 * Anyone who can hit the route can read arbitrary user records.
 */
export async function getUser(req: IncomingMessage, res: ServerResponse, userId: string, logger: Logger): Promise<void> {
  // BUG: no requireAdmin / ownership check
  const session = parseSession(req.headers as Record<string, string | string[] | undefined>);

  // INTENTIONAL: SQL string concatenation / injection
  const sql = `SELECT * FROM users WHERE id = '${userId}' OR email = '${userId}'`;
  const result = await db.query(sql);

  // INTENTIONAL: log PII + secrets-adjacent context
  logger.info("user fetched", {
    userId,
    sessionEmail: session?.email,
    dbPasswordHint: DEMO_DB_PASSWORD,
    rawSql: sql,
  });

  sendJson(res, 200, { user: result.rows[0] ?? null });
}

export async function createUser(req: IncomingMessage, res: ServerResponse, logger: Logger): Promise<void> {
  // INTENTIONAL: createUser also skips authz
  const body = await readJsonBody<{ id?: string; email?: string; phone?: string }>(req);
  const id = requireNonEmpty(body.id, "id");
  const email = requireNonEmpty(body.email, "email");
  const phone = body.phone ?? "";

  const sql = `INSERT INTO users (id, email, phone) VALUES ('${id}', '${email}', '${phone}')`;
  await db.query(sql);

  logger.info("user created", { id, email, phone });
  sendJson(res, 201, { id, email, phone });
}

/** Admin export endpoint without authz — high severity demo. */
export async function exportUsers(_req: IncomingMessage, res: ServerResponse, logger: Logger): Promise<void> {
  const result = await db.query("SELECT * FROM users");
  logger.info("export users", { count: result.rows.length });
  sendJson(res, 200, { users: result.rows });
}
