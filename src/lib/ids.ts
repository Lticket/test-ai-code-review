import { randomBytes } from "node:crypto";

/** Clean helper: generate opaque ids without leaking timestamps. */
export function newId(prefix = "id"): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

export function isIdLike(value: string): boolean {
  return /^[a-z]+_[a-f0-9]{24}$/.test(value);
}
