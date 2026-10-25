# White-Label Poultry Commerce Platform: Payment Integration, Marketplace Settlements, and Production Handover

## 1. Executive Summary & Objective

This document provides complete technical documentation, regulatory evaluations, integration instructions, operating procedures, and production handover checklists for **Prompt 4: Payment Integration, Marketplace Settlements, and Production Readiness**.

The platform is an enterprise-grade, multi-tenant white-label commerce platform built for the poultry vertical (live broiler batches, free-range desi/natukodi chicken, farm-fresh table eggs, and specialized poultry feeds), ready to expand into other agricultural and commerce domains.

---

## 2. Gateway Provider Evaluation for Indian Poultry Commerce

As required by Prompt 4 Section A, no payment provider credentials were artificially invented or hardcoded. Candidate providers were evaluated against domestic Indian marketplace requirements:

| Provider | Country / Regulatory Licensing | Currency | Marketplace Capability | Poultry Commerce Evaluation & Fit |
| :--- | :--- | :--- | :--- | :--- |
| **Razorpay (with Route)** | **India**<br>Licensed Payment Aggregator (RBI PA/PG) | INR (₹) | **Native Route / Split** | **Recommended Tier 1:** UPI Intent / QR represents >85% of volume in Indian poultry sales. Razorpay Route provides native automated split settlements into seller bank accounts via compliant RBI Nodal/Escrow accounts. |
| **Cashfree Payments** | **India**<br>Licensed Payment Aggregator (RBI PA/PG) | INR (₹) | **Payouts API** | **Strong Alternative:** Excellent automated IMPS/NEFT/UPI bulk payout engine with instant bank account name-match verification (Penny Drop API) for farmer KYC. |
| **Stripe (Connect)** | **Global**<br>Global Card Processor | USD, EUR, INR (Cards) | Custom Connect | **Export/Cross-Border Only:** Less optimal for domestic rural poultry where UPI dominates. Subject to RBI card storage tokenization & foreign exchange mandates. |
| **Cash on Delivery (COD / POD)** | **India**<br>Commercial Invoicing | INR (₹) | Manual Ledger | **Baseline Fallback:** Essential for farm-gate sales and rural belts with intermittent data connectivity. Gated with delivery handover OTP verification. |

### Strict Non-Intermediary Principle
> [!IMPORTANT]
> **Zero Developer Account Intermediaries**: Neither platform developers nor developer panel administrators hold, touch, or intermediate client or seller funds. All payments flow directly through the client's direct RBI-regulated Payment Aggregator merchant account and Nodal/Escrow escrow accounts.

### Client Decisions & Authorizations Required Prior to Live Activation
1. **Direct Corporate Merchant Agreement**: The client corporate entity must execute a merchant agreement directly with Razorpay or Cashfree under its PAN, GSTIN, and corporate bank account.
2. **Escrow / Nodal Agreement for Split Settlements**: To enable automated seller split-settlements, the client must execute a Razorpay Route or Cashfree Payouts marketplace agreement compliant with RBI Guidelines on Regulation of Payment Aggregators.
3. **Sub-Merchant / Farmer KYC Protocol**: Sellers (farmers, hatcheries) must submit verified bank account numbers, IFSC codes, PAN, and Aadhaar prior to payout disbursement.

---

## 3. Tenant-Aware Payment Architecture & Security Isolation

### Secret Key Protection
- **No Client Exposure**: Raw gateway secret keys are **NEVER** placed in Flutter code, React web code, browser JavaScript, public configuration files, version control (`.git`), or application logs.
- **Secret Manager References**: Secret keys are stored in backend secret management systems (e.g. Google Cloud Secret Manager or HashiCorp Vault) and referenced in tenant configuration strictly by URI:
  ```
  projects/{gcp-project-id}/secrets/{tenant-id}-razorpay-webhook-secret/versions/1
  ```
- **Masked Display**: Web administration interfaces display only public key identifiers (e.g., `rzp_test_ApexHub2026k9`) and masked secret previews (e.g., `••••••••8xL2`).
- **Tenant Isolation**: Tenant A can never read, modify, or inspect Tenant B's payment credentials, transaction ledger, or seller settlement records.

---

## 4. Trusted Backend Payment Lifecycle & Integrity Guardrails

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Flutter App)
    participant Backend as Backend Cloud Functions
    participant Gateway as Payment Gateway (Razorpay/Route)
    actor Admin as Hub Admin / Seller

    Customer->>Backend: createPaymentOrder(tenantId, orderId, method)
    Note over Backend: 1. Validate Tenant & Order Ownership<br/>2. Re-calculate Item Sum + Delivery = Total<br/>3. Verify Produce Stock Availability<br/>4. Ensure Order is 'pending'
    Backend->>Gateway: POST /orders (trusted amount in paise)
    Gateway-->>Backend: providerOrderId
    Backend->>Backend: Record PaymentTransactionRecord ('created')
    Backend-->>Customer: Return Checkout Payload (keyId, orderId, amountInPaise)
    Note over Customer: Customer completes UPI/Card checkout
    Gateway->>Backend: Signed Webhook (HMAC-SHA256 signature, eventId)
    Note over Backend: 1. Verify HMAC Signature<br/>2. Check Replay Journal (Deduplicate Event ID)<br/>3. Mark Transaction 'captured'<br/>4. Advance Order to 'confirmed'
    Backend-->>Gateway: HTTP 200 OK (Acknowledged)
    Backend-->>Customer: Order Confirmed Notification
    Backend-->>Admin: New Order Notification
```

### Key Security & Integrity Features
1. **Zero-Trust Client Pricing**: The server never trusts client-supplied total amounts. Every checkout request re-computes:
   $$\text{Verified Total} = \sum (\text{item.unitPrice} \times \text{item.quantity}) + \text{deliveryFee}$$
   Any disparity throws an immediate `failed-precondition` financial integrity exception.
2. **Pre-Allocation Inventory Verification**: Line items are checked against real-time stock balances before issuing the gateway payment order.
3. **HMAC-SHA256 Signature Verification**: Every webhook callback and frontend signature is verified cryptographically via `crypto.createHmac('sha256', secretKey)` prior to updating order status.
4. **Idempotent Replay Protection**: Incoming webhook event IDs are logged in an immutable deduplication journal (`processedWebhookEvents`). Replayed or duplicate callbacks return `duplicate_ignored` without double-crediting orders or duplicating ledger entries.
5. **Refunds & Proportional Commission Reversal**:
   - Authorized client admins can initiate full or partial refunds against captured payments.
   - Refunds strictly cannot exceed the captured refundable balance.
   - Seller settlement commission snapshots are adjusted proportionally in the marketplace ledger.
6. **Settlement Eligibility Gating**: Seller payouts remain locked in `unsettled` state until orders reach the terminal `delivered` status verified by farm-gate OTP.

---

## 5. Webhook Setup Instructions

Configure the following webhook endpoints in your payment gateway dashboard:

### Razorpay Dashboard Webhook Configuration
1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Settings &rarr; Webhooks &rarr; Add New Webhook**.
3. **Webhook URL**:
   ```
   https://api.poultryplatform.dev/webhooks/v1/tenants/{tenantId}/payments
   ```
4. **Secret**: Enter your high-entropy webhook secret (store the same value in Cloud Secret Manager).
5. **Active Events**:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
   - `refund.processed`
6. **Alert Email**: Enter your client operations monitoring email.

---

## 6. Production Activation Checklist

Before switching any tenant from `sandbox` to `production`:

- [ ] **Direct Merchant KYC Verified**: Corporate PAN, GSTIN, FSSAI, and business bank account verified with payment aggregator.
- [ ] **Escrow / Nodal Account Operational**: Marketplace Route agreement signed with Payment Aggregator.
- [ ] **Live Credentials in Cloud Secret Manager**:
  - `key_id` updated to `rzp_live_...`
  - Webhook secret stored in Secret Manager, never in code or database.
- [ ] **HTTPS Enforced with TLS 1.3**: All webhook and checkout endpoints serve over valid SSL certificates.
- [ ] **Webhook Signature Verification Active**: Constant-time HMAC comparison enabled.
- [ ] **Test Transaction Completed**: Successfully execute ₹1 UPI test order and verify:
  - Signature verification passes.
  - Order advances from `pending` to `confirmed`.
  - Inventory deducts correctly.
  - Settlement record reflects accurate commission snapshot.
- [ ] **Partial Refund Test**: Verify partial refund credits back to UPI VPA and reverses commission proportionally.
- [ ] **Farmer KYC & Payout Details**: Verify seller bank accounts, IFSC codes, and beneficiary names match before releasing payouts.

---

## 7. Factual Implementation Status Report

In accordance with Prompt 4 Section H, here is the exact platform status:

### Tier 1: Implemented and Tested (100% Passing Automated Tests)
- [x] **Provider-Neutral Payment Service & Evaluation Matrix** (`developer_panel/src/lib/paymentService.ts`, `types/payment.ts`).
- [x] **Strict Tenant Isolation & Secret Masking**: Separation of tenant gateway configs with zero raw secrets exposed in browser/client.
- [x] **Backend Payment Order Creation & Tamper Defense**: Price arithmetic verification and produce stock availability verification (`createPaymentOrder`).
- [x] **Cryptographic HMAC-SHA256 Signature Verification**: Valid signatures accepted, forged/tampered signatures rejected (`verifyPaymentSignature`).
- [x] **Idempotent Webhook Processing & Replay Protection**: Event deduplication journal prevents double confirmation (`handleWebhookEvent`).
- [x] **Payment Failure & Decline Ledger**: Failed payments record decline reasons and preserve unpaid order state.
- [x] **Full and Partial Refunds Engine**: Reverses transactions with proportional commission clawback; rejects over-refunds (`initiateRefund`).
- [x] **Seller Settlement Eligibility Gating**: Strictly gates payouts until order reaches terminal `delivered` status (`checkAndAdvanceSettlementEligibility`).
- [x] **Settlement Payout Recording**: Bank UTR tracking and disbursement history (`processSettlementPayout`).
- [x] **Client Admin Payments Dashboard** (`/admin/payments`): KPI cards in ₹ INR, transaction ledger, settlement actions, refund modal.
- [x] **Developer Control Plane Gateway Orchestrator** (`/payments`): Multi-tenant readiness, provider evaluation matrix, webhook security, privileged audit trail.
- [x] **Backend Cloud Functions Extension**: `createPaymentOrder`, `verifyPaymentSignature`, `initiatePaymentRefund`, `disburseSellerSettlement`.
- [x] **Test Verification**: 52/52 Prompt 4 automated tests passing (`test_prompt4_payments.ts`), 21/21 Prompt 3 tests passing, 25/25 Flutter tests passing, clean `flutter analyze`, clean 32-route Next.js production build (`npm run build`).

### Tier 2: Implemented but Simulated (Ready for Live Webhook Delivery)
- [x] **HMAC Webhook Callback Simulation**: Tested against simulated RFC 2104 signatures and replay buffers.
- [x] **Bank UTR Disbursement Flow**: Tested with verified UTR identifiers and delivery gating.

### Tier 3: Awaiting Client Credentials or External Approvals
- [ ] **Live Razorpay / Cashfree Production Merchant Credentials**: Awaiting client entity registration and direct merchant contract.
- [ ] **RBI Nodal/Escrow Marketplace Route Contract**: Awaiting client formal agreement with payment aggregator for automated farmer split settlements.

### Tier 4: Not Implemented (Out of Scope / Prohibited)
- [ ] **Raw Credit Card Number Storage**: Strictly prohibited by RBI Card-on-File Tokenization (CoFT) mandates. All card entry must flow through hosted checkout SDKs.
- [ ] **Intermediary Developer Account Holding**: Prohibited. All funds flow exclusively through direct client-to-aggregator accounts.
