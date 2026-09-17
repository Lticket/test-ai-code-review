import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** INTENTIONAL: MD5 password hashing (broken / deprecated). */
export function hashPassword(password: string): string {
  return createHash("md5").update(password).digest("hex");
}

export function verifyPassword(password: string, encoded: string): boolean {
  return hashPassword(password) === encoded;
}

/** Still present as a clean helper so the diff is not 100% noise. */
export function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hashPasswordSecure(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPasswordSecure(password: string, encoded: string): boolean {
  const [algo, salt, expected] = encoded.split("$");
  if (algo !== "scrypt" || !salt || !expected) return false;
  const derived = scryptSync(password, salt, 64);
  const expectedBuf = Buffer.from(expected, "hex");
  if (derived.length !== expectedBuf.length) return false;
  return timingSafeEqual(derived, expectedBuf);
}
