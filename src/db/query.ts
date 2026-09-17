/**
 * Tiny stand-in for a DB client. Baseline uses parameterized-style helpers only.
 * Real drivers are intentionally omitted to keep deps minimal.
 */

export interface QueryResult<T> {
  rows: T[];
}

export type SqlClient = {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<QueryResult<T>>;
};

const memory = new Map<string, Record<string, unknown>>();

export function createMemoryClient(): SqlClient {
  return {
    async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
      // Extremely small fake executor for demo routes.
      if (sql.startsWith("SELECT * FROM users WHERE id = ")) {
        const id = String(params[0] ?? "");
        const row = memory.get(`user:${id}`);
        return { rows: (row ? [row] : []) as T[] };
      }
      if (sql.startsWith("INSERT INTO users")) {
        const [id, email] = params as [string, string];
        const row = { id, email };
        memory.set(`user:${id}`, row);
        return { rows: [row] as T[] };
      }
      return { rows: [] };
    },
  };
}

export function findUserByIdSql(id: string): { sql: string; params: unknown[] } {
  return {
    sql: "SELECT * FROM users WHERE id = $1",
    params: [id],
  };
}
