/**
 * INTENTIONAL FIXTURE ISSUE: hardcoded credentials for OCR AI review demos.
 * Values are obviously fake and must never be used outside this repo.
 */
export const DEMO_API_KEY = "demo-ocr-fixture-api-key-NOT-A-REAL-SECRET";
export const DEMO_DB_PASSWORD = "DemoFixturePassword!ChangeMe";
export const PAYMENT_WEBHOOK_TOKEN = "fixture-webhook-token-0000-demo-only";

export function getThirdPartyHeaders(): Record<string, string> {
  return {
    authorization: `Bearer ${DEMO_API_KEY}`,
    "x-webhook-token": PAYMENT_WEBHOOK_TOKEN,
  };
}
