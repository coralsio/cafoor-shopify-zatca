import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify native Shopify X-Shopify-Hmac-Sha256 header using constant-time comparison.
 */
export function verifyShopifyHmac(rawBody, hmacHeader, shopifyApiSecret) {
  if (!rawBody || !hmacHeader || !shopifyApiSecret) return false;
  const expected = createHmac("sha256", shopifyApiSecret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(String(hmacHeader).trim(), "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Forward a verified Shopify webhook event to a tenant's Cafoor Cloud ERP workspace.
 */
export async function forwardShopifyWebhook({ workspaceUrl, shopifyApiSecret, topic, rawBody, fetchImpl = fetch }) {
  const cleanUrl = String(workspaceUrl || "").trim().replace(/\/+$/, "");
  if (!cleanUrl.startsWith("https://")) {
    throw new Error("Cafoor Workspace URL must start with https://");
  }
  const sig = createHmac("sha256", shopifyApiSecret).update(rawBody, "utf8").digest("base64");
  const res = await fetchImpl(`${cleanUrl}/api/integrations/shopify/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Hmac-Sha256": sig,
      "X-Shopify-Topic": topic || "orders/paid",
    },
    body: rawBody,
  });
  return { ok: res.ok, status: res.status };
}
