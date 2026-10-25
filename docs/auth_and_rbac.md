# Authentication and Role-Based Access Control (RBAC) Design

## 1. Role Hierarchy & Privilege Matrix

| Role | Scope | Description | Capabilities |
|---|---|---|---|
| **Platform Developer (`developer` / `super_admin`)** | Global Platform | Systems architects, platform engineers, and support leads | • Full access to Control Plane (`/control_plane/...`)<br>• Create, suspend, configure, and terminate tenants<br>• Grant and revoke feature entitlements<br>• Inspect platform-wide audit logs and health telemetry<br>• Provision new client environments |
| **Client Administrator (`client_admin`)** | Single Tenant Data Plane | Farm enterprise directors or marketplace managers | • Manage tenant-level business operations<br>• Approve and onboard farmer sellers<br>• Configure localized store categories and tax rates<br>• Manage orders, disputes, and staff accounts |
| **Seller (`seller`)** | Single Tenant Data Plane | Poultry breeders, hatcheries, feed mills, equipment vendors | • Publish product lots (chicks, broilers, feed, crates)<br>• Update batch availability, vaccination records, and pricing<br>• Fulfill orders, print dispatch notes, request pickups |
| **Customer (`customer`)** | Single Tenant Data Plane | Poultry farmers (buying chicks/feed), restaurants, wholesalers | • Browse catalog, add to cart, create purchase orders<br>• Track delivery batches, view veterinary certificates<br>• Leave ratings and reviews for delivered stock |
| **Staff (`staff`)** | Single Tenant Data Plane | Logistics agents, warehouse sorters, field veterinarians | • Update shipment milestone checkpoints, scan QR crates |

---

## 2. Authentication Mechanism & Custom Claims Architecture

Firebase Authentication provides the identity foundation (email/password, OAuth, and phone SMS OTP). 

### 2.1 Firebase Auth Custom Claims
To achieve O(1) authorization checks in Firestore rules, Storage rules, and backend API gateways, the platform utilizes **Firebase Auth Custom Claims**.

When a user authenticates, their ID token contains cryptographically signed custom claims:
```json
{
  "iss": "https://securetoken.google.com/platform-poultry-hub",
  "sub": "user_firebase_uid_123",
  "aud": "platform-poultry-hub",
  "email": "lead.architect@platform.dev",
  "role": "developer",
  "tenantId": "platform_control_plane",
  "permissions": [
    "tenants:create",
    "tenants:update",
    "tenants:suspend",
    "entitlements:manage",
    "branding:edit",
    "audit:read"
  ]
}
```

### 2.2 Security Guarantee: Preventing Privilege Escalation
1. **Zero Client-Side Trust**:
   Under no circumstances can a user alter their own `role` or `tenantId`. Firestore rules explicitly reject `request.resource.data.role != resource.data.role` unless the caller possesses verified super-admin claims.
2. **Dedicated Cloud Functions for Claim Minting**:
   Custom claims are exclusively minted via trusted Firebase Cloud Functions utilizing the Firebase Admin SDK (`admin.auth().setCustomUserClaims(uid, claims)`).
3. **Revocation & Refresh Handling**:
   When a user's role is modified or suspended, the backend updates their Firestore record and invalidates active refresh tokens via `admin.auth().revokeRefreshTokens(uid)`. The client application listens for token invalidation and forces a token refresh via `getIdToken(true)`.

---

## 3. Developer Panel Gatekeeper Logic

The Next.js Developer Panel implements a strict two-stage gatekeeper:
1. **Client-Side Route Guard**:
   Checks whether the authenticated Firebase user has `token.claims.role === 'developer'` or `token.claims.role === 'super_admin'`. If not, it redirects to the unauthorized access screen.
2. **Server-Side API / Callable Functions Validation**:
   Every mutation endpoint executes `verifyPlatformDeveloper(context)`:
   ```typescript
   export function verifyPlatformDeveloper(context: CallableContext) {
     if (!context.auth) {
       throw new HttpsError('unauthenticated', 'Caller must be authenticated.');
     }
     const role = context.auth.token.role;
     if (role !== 'developer' && role !== 'super_admin') {
       throw new HttpsError('permission-denied', 'Caller lacks platform developer privileges.');
     }
   }
   ```
3. **Database Level Enforcement**:
   Even if an attacker bypassed the UI and made a direct SDK call, Firestore Security Rules verify:
   ```
   function isPlatformDeveloper() {
     return request.auth != null && 
            request.auth.token.role in ['developer', 'super_admin'];
   }
   ```
   Direct writes to `/control_plane/...` without this claim are rejected at the database engine level.
