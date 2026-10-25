# White-Label Platform: Operations, Administration, and Production Deployment Guide

## 1. Overview & Architectural Boundaries

The platform operates across three tightly integrated yet cryptographically isolated planes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PLATFORM DEVELOPER CONTROL PLANE                    │
│   Web: http://localhost:3000/  (Routes: /, /clients/*, /audit-logs)    │
│   Clearance: Platform Developer / Super Admin                          │
│   Scope: Global Tenant Registry, Entitlement Engine, Cloud Deployments │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │                                                   │
┌──────────▼─────────────────────────┐   ┌─────────────────────▼───────────────┐
│     CLIENT ADMINISTRATION PANEL     │   │         SELLER FARM PORTAL          │
│ Web: /admin/*                      │   │ Web: /seller/*                      │
│ Scope: Tenant Operations, Sellers, │   │ Scope: Farm Produce, Batch Stock,   │
│ Orders, Logistics, Staff, Branding │   │ Permitted Packaging Fulfillment     │
│ Boundary: Isolated to `tenantId`   │   │ Boundary: Isolated to `sellerId`    │
└──────────────────┬─────────────────┘   └─────────────────────┬───────────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                      ┌──────────────────▼──────────────────┐
                      │    CUSTOMER MOBILE CLIENT (FLUTTER)  │
                      │ Apps: Android, iOS, Mobile Web      │
                      │ Scope: Storefront, Cart, Checkout   │
                      │ Currency: Indian Rupees (₹ / INR)   │
                      └─────────────────────────────────────┘
```

---

## 2. Order Lifecycle State Machine

The order lifecycle strictly enforces deterministic transitions across actors. The state machine prevents overselling, duplicate processing, and privileged actor bypass.

### Transition Graph

| Current State | Allowed Next States | Permitted Actors | Stock Inventory Impact |
| :--- | :--- | :--- | :--- |
| `pending` | `confirmed`, `cancelled` | Client Admin, Developer, Customer (cancel only) | Reserved upon order creation |
| `confirmed` | `preparing`, `cancelled` | Client Admin, Seller (preparing only) | Reserved |
| `preparing` | `ready_for_dispatch`, `cancelled` | Client Admin, Seller (ready only) | Packaging & dressing in progress |
| `ready_for_dispatch` | `out_for_delivery`, `cancelled` | Client Admin, Dispatch Officer | Crated at hub loading bay |
| `out_for_delivery` | `delivered`, `failed_delivery` | Client Admin, Dispatch Officer | In transit with chilled carrier |
| `delivered` | *Terminal State* | - | Finalized / Eligible for Settlement |
| `cancelled` | *Terminal State* | Client Admin | **Released back to product stock** |
| `failed_delivery` | `ready_for_dispatch`, `cancelled` | Client Admin, Dispatch Officer | Re-staged or cancelled |

### Actor Permissions Matrix

- **Platform Developer**: Full audit & emergency state override with signed logging.
- **Client Administrator**: Transitions orders across any valid state within their tenant.
- **Seller / Farmer**: Restricted to `preparing` and `ready_for_dispatch`. Prohibited from marking `delivered` or modifying order items/financial totals.
- **Customer**: Allowed to cancel exclusively while in `pending` unconfirmed status.

---

## 3. Security Hardening & Isolation Policies

### Storage Security (`storage.rules`)
- **Public Assets**: `/tenants/{tenantId}/public/*` is readable by all users (logos, public broiler photos).
- **KYC Isolation**: `/tenants/{tenantId}/sellers/{sellerId}/documents/*` is strictly non-public. Only the seller owner, tenant client admin, and platform developer can read or upload veterinary passes and biosecurity audit certificates.

### Firestore Security (`firestore.rules`)
- **Tenant Scoping**: All operations require matching `request.auth.token.tenantId == tenantId`.
- **Privilege Escalation Protection**: Users cannot mutate `role`, `status`, or `tenantId`.
- **Seller Self-Approval Prevention**: Sellers cannot alter `status`, `commissionRatePercent`, or `reviewedBy` on their own profile.
- **Immutable Audit Trails**: `/control_plane/v1/audit_logs/*` and `/tenants/{tenantId}/audit_logs/*` allow `create` but strictly prohibit `update` and `delete`.

---

## 4. Production Deployment Checklist

### A. Developer Control Plane (`developer_panel/`)
- [ ] Run production build: `npm run build` (Next.js 14 App Router, 30 static pages).
- [ ] Verify environment variables:
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=white-label-poultry.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=white-label-poultry
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=white-label-poultry.appspot.com
  NEXT_PUBLIC_CONTROL_PLANE_URL=https://control.poultryplatform.dev
  ```
- [ ] Deploy to Vercel or Firebase Hosting:
  ```bash
  firebase deploy --only hosting:developer-panel
  ```

### B. Client Admin Panel (`/admin/*`) & Seller Portal (`/seller/*`)
- [ ] Included in the Next.js deployment or deployable under tenant custom domains:
  - `admin.kisanpoultry.in` -> CNAME mapped to `/admin`
  - `farm.kisanpoultry.in` -> CNAME mapped to `/seller`
- [ ] Verify role-based gateway clearance (`Gatekeeper.tsx`).

### C. Tenant-Specific Firebase Projects
- [ ] Provision dedicated GCP project (e.g. `client-apex-poultry-hub`).
- [ ] Deploy Firestore Security Rules:
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] Deploy Cloud Storage Security Rules:
  ```bash
  firebase deploy --only storage
  ```
- [ ] Deploy Cloud Functions (Node.js 20 / TypeScript):
  ```bash
  cd functions && npm run build
  firebase deploy --only functions
  ```

### D. Initial Administrator Provisioning
- [ ] Provision Platform Developer root identity via Firebase Auth CLI:
  ```bash
  firebase auth:import users.json --hash-algo=SCRYPT
  ```
- [ ] Set custom claims on developer account:
  ```json
  { "role": "developer", "tenantId": "control_plane" }
  ```
- [ ] Provision first tenant administrator (`Vikramaditya Rao`):
  ```json
  { "role": "client_admin", "tenantId": "apex-poultry-hub" }
  ```

---

## 5. Verification & Test Summary

| Test Suite | Component | Tests Executed | Passed | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Operational & Security Suite** | Operations & State Machine | 21 assertions | **21 / 21** | **ALL PASSED** |
| **Flutter Customer App** | Mobile UI & Business Logic | 25 widget tests | **25 / 25** | **ALL PASSED** |
| **Next.js Web Build** | Developer, Admin, Seller Portals | 30 routes | **30 / 30** | **BUILD CLEAN (0)** |
| **Firebase Cloud Functions** | Callable Backend Functions | TypeScript Compiler | **Clean (0)** | **COMPILED** |
| **Flutter Static Analysis** | Mobile Engine Codebase | 0 issues found | **Clean (0)** | **PASSED** |

### Verified Security Boundaries:
1. **State Machine Validation**: Delivered terminal orders reject subsequent transitions (`cancelled` rejected).
2. **Illegal Skips**: Direct skip from `preparing` to `delivered` strictly rejected by the backend state machine.
3. **Cross-Seller Isolation**: Farm A cannot view, fulfill, or transition orders allocated to Farm B.
4. **Seller Role Boundary**: Sellers cannot self-certify doorstep delivery or edit payment records.
5. **Inventory Restoration**: Order cancellation automatically restores produce units back to live stock.
6. **Feature Entitlement Gating**: Modules disabled in control plane (`coupons_and_promotions`, `reviews_and_ratings`) render locked states with self-approval barrier.
