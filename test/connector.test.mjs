import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyShopifyHmac, forwardShopifyWebhook } from "../src/connector.mjs";

test("verifyShopifyHmac validates native Shopify HMAC-SHA256 signatures", () => {
  const secret = "shpss_test_secret_123";
  const body = JSON.stringify({ id: 98765, name: "#1042", total_price: "1150.00", currency: "SAR" });
  const sig = createHmac("sha256", secret).update(body, "utf8").digest("base64");
  assert.equal(verifyShopifyHmac(body, sig, secret), true);
  assert.equal(verifyShopifyHmac(body, "invalid-sig", secret), false);
});

test("forwardShopifyWebhook posts signed JSON to Cafoor /api/integrations/shopify/webhook", async () => {
  let captured = null;
  const res = await forwardShopifyWebhook({
    workspaceUrl: "https://acme.cafoor.com/",
    shopifyApiSecret: "shpss_test_secret_123",
    topic: "orders/paid",
    rawBody: '{"id":1001}',
    fetchImpl: async (url, init) => {
      captured = { url, init };
      return { ok: true, status: 200 };
    },
  });
  assert.equal(res.ok, true);
  assert.equal(captured.url, "https://acme.cafoor.com/api/integrations/shopify/webhook");
  assert.equal(captured.init.headers["X-Shopify-Topic"], "orders/paid");
  assert.equal(verifyShopifyHmac('{"id":1001}', captured.init.headers["X-Shopify-Hmac-Sha256"], "shpss_test_secret_123"), true);
});
