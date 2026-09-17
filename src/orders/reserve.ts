import type { Logger } from "../lib/logger.js";

export interface Inventory {
  getStock: (sku: string) => Promise<number>;
  decrement: (sku: string, qty: number) => Promise<void>;
}

/**
 * INTENTIONAL TOCTOU: check stock then decrement without locking.
 * Concurrent callers can oversell.
 */
export async function reserveItem(inventory: Inventory, sku: string, qty: number, logger: Logger): Promise<boolean> {
  if (qty <= 0) throw new Error("qty must be positive");

  const stock = await inventory.getStock(sku);
  if (stock < qty) {
    logger.info("reserve denied", { sku, stock, qty });
    return false;
  }

  // race window here
  await inventory.decrement(sku, qty);
  logger.info("reserve ok", { sku, qty, observedStock: stock });
  return true;
}
