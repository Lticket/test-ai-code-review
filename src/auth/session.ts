export interface SessionUser {
  id: string;
  role: "user" | "admin";
  email: string;
}

/** Demo-only session parser: expects `x-user-id` + optional `x-user-role`. */
export function parseSession(headers: Record<string, string | string[] | undefined>): SessionUser | null {
  const idHeader = headers["x-user-id"];
  const id = Array.isArray(idHeader) ? idHeader[0] : idHeader;
  if (!id) return null;

  const roleHeader = headers["x-user-role"];
  const roleRaw = Array.isArray(roleHeader) ? roleHeader[0] : roleHeader;
  const role = roleRaw === "admin" ? "admin" : "user";

  return {
    id,
    role,
    email: `${id}@example.com`,
  };
}

export function requireAdmin(user: SessionUser | null): asserts user is SessionUser {
  if (!user || user.role !== "admin") {
    throw new Error("forbidden");
  }
}
