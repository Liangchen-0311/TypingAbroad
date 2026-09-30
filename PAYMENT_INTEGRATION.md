# TypeAbroad payment integration

The account and Alipay APIs are deployed, and production now runs in `live` mode. Free and member access are separated in the client experience, and a successful membership is always read from the authenticated server endpoint.

## Launch variables

```text
NEXT_PUBLIC_MEMBERSHIP_ACCESS_MODE=live
NEXT_PUBLIC_ACCOUNT_API_BASE=https://typeabroad.com/api
NEXT_PUBLIC_PAYMENT_API_BASE=https://typeabroad.com/api
```

Use `preview` only for a temporary review build where all practice content must stay open. The application defaults to `live` when this variable is omitted so a production build cannot silently expose member access.

Alipay application IDs, merchant private keys, Alipay public keys and webhook secrets are server-only values. Never expose them through a `NEXT_PUBLIC_` variable or commit them to Git.

## Required API contract

### Create an Alipay order

`POST {NEXT_PUBLIC_PAYMENT_API_BASE}/v1/orders/alipay`

Request:

```json
{
  "planId": "half-year",
  "mobile": "13800000000",
  "returnUrl": "https://typeabroad.com/payment/result"
}
```

Response:

```json
{
  "orderId": "TA202609070001",
  "checkoutUrl": "https://..."
}
```

The server must derive the amount from the plan ID. It must never trust a price supplied by a browser. Current server prices are:

- `half-year`: CNY 26.60
- `lifetime`: CNY 266.00

### Read order status

`GET {NEXT_PUBLIC_PAYMENT_API_BASE}/v1/orders/{orderId}/status`

Response status must be one of `pending`, `paid`, `failed`, or `closed`.

### Read the signed-in user's membership

`GET {NEXT_PUBLIC_ACCOUNT_API_BASE}/v1/me/membership`

Response:

```json
{
  "tier": "member",
  "planId": "half-year",
  "expiresAt": "2027-03-07T00:00:00.000Z"
}
```

For lifetime membership, `expiresAt` may be `null`.

## Webhook requirements

The Alipay asynchronous notification handler must:

1. Verify the Alipay signature with the server-held Alipay public key.
2. Verify seller/app identity, order number, currency and amount.
3. Process the notification idempotently so retries cannot grant duplicate time.
4. Mark an order paid and grant membership in one database transaction.
5. Return Alipay's required acknowledgement only after the transaction succeeds.
6. Record a minimal audit trail without storing payment passwords or full bank-card data.

The browser return URL is informational only. `PaymentResultPanel` asks the server for order status and never grants membership from URL parameters.
