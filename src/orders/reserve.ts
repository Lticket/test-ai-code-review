import type { Logger } from "../lib/logger.js";

export interface Inventory {
  getStock: (sku: string) => Promise<number>;
  decrement: (sku: string, qty: number) => Promise<void>;
}

/**
 * Baseline reservation checks stock then decrements under a simple mutex per SKU.
 * Feature-branch demos may regress this into a TOCTOU race.
 */
const locks = new Map<string, Promise<void>>();

async function withLock<T>(sku: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(sku) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(
    sku,
    prev.then(() => gate),
  );
  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

export async function reserveItem(inventory: Inventory, sku: string, qty: number, logger: Logger): Promise<boolean> {
  if (qty <= 0) throw new Error("qty must be positive");

  return withLock(sku, async () => {
    const stock = await inventory.getStock(sku);
    if (stock < qty) {
      logger.info("reserve denied", { sku, stock, qty });
      return false;
    }
    await inventory.decrement(sku, qty);
    logger.info("reserve ok", { sku, qty });
    return true;
  });
}
