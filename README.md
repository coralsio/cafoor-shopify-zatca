# Cafoor Cloud ERP & ZATCA Phase 2 Connector for Shopify

Official open-source Shopify connector & `shopify.app.toml` configuration for **[Cafoor Cloud ERP](https://cafoor.com)** — syncs Shopify store orders into automated **Saudi ZATCA Phase 2**, **UAE FTA / PINT AE**, **Egypt ETA**, and **Jordan JoFotara** e-invoicing, multi-warehouse stock, and double-entry accounting.

## Supported Webhooks
- `orders/create`, `orders/paid`, `orders/cancelled`, `products/update`
- Verified natively via constant-time `X-Shopify-Hmac-Sha256` on `https://<workspace>.cafoor.com/api/integrations/shopify/webhook`

## Direct Setup (Zero Coding)
1. Start a free 14-day Cafoor workspace at **[cafoor.com](https://cafoor.com/en/signup?utm_source=github&utm_medium=shopify_connector)**.
2. Open **Cafoor → Settings → Integrations → Shopify**, paste your Shopify Admin Access Token & API Secret.
3. In **Shopify Admin → Settings → Notifications → Webhooks**, add `https://<your-workspace>.cafoor.com/api/integrations/shopify/webhook` for `Order payment` & `Order creation`.

## Resources
- Free Tax Invoice & ZATCA QR Generator: https://cafoor.com/en/tools/free-invoice-generator
- Live Interactive Demo: https://cafoor.com/en/demo
- Documentation: https://cafoor.com/en/docs/mena-integrations
