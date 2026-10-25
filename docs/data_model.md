# White-Label Commerce Platform: Data Model Documentation

## 1. Control Plane Data Models

All control plane documents reside under `/control_plane/v1/`.

### 1.1 Tenant Model (`/control_plane/v1/tenants/{tenantId}`)
Represents a white-label client organisation (e.g., a regional poultry cooperative or farm enterprise).

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `id` | String | Unique slug / tenant identifier (e.g. `agro-poultry-hub`) | 3-32 lowercase alphanumeric with hyphens |
| `name` | String | Legal business name (e.g. "Apex Agro Poultry Hub") | Required, 2-100 chars |
| `contactEmail` | String | Primary administrative contact | Valid email format |
| `contactPhone` | String | Primary phone number with international prefix | E.164 format |
| `lifecycleState` | String | State machine enum: `draft` \| `provisioning` \| `active` \| `suspended` \| `terminated` | Required enum |
| `tier` | String | Commercial subscription: `starter` \| `growth` \| `enterprise` | Required enum |
| `businessVertical` | String | Vertical category (e.g., `poultry_farm`, `dairy`, `aquaculture`) | Default `poultry_farm` |
| `deploymentMode` | String | `dedicated_project` \| `shared_namespace` | Default `dedicated_project` |
| `firebaseProjectId` | String | Google Cloud / Firebase project ID for data plane | Valid GCP project id format |
| `customDomain` | String? | Optional custom domain for web portal | Valid FQDN or null |
| `createdAt` | Timestamp | Server timestamp of creation | Immutable |
| `updatedAt` | Timestamp | Server timestamp of last modification | Auto-updated |
| `version` | Number | Monotonically increasing schema revision | >= 1 |

### 1.2 Tenant Branding Model (`/control_plane/v1/branding/{tenantId}`)
Specifies the visual identity and terminology tokens consumed by web panels and Flutter mobile apps.

| Field | Type | Description | Validation / Constraints |
|---|---|---|---|
| `tenantId` | String | Foreign key to tenant record | Must match tenant ID |
| `displayName` | String | Public-facing app name (e.g. "Apex Poultry Express") | 2-50 chars |
| `logoUrl` | String | Full resolution SVG or PNG logo URL | Valid HTTPS URL |
| `iconUrl` | String? | Square app icon URL (512x512) | Valid HTTPS URL or null |
| `splashImageUrl` | String? | Mobile splash screen hero illustration | Valid HTTPS URL or null |
| `colors` | Map | Brand color palette hex codes: | Valid 6-character hex (`#RRGGBB`) |
| ├ `primary` | String | Primary brand accent (e.g. `#10B981` emerald green) | Hex format |
| ├ `secondary` | String | Secondary accent (e.g. `#F59E0B` amber) | Hex format |
| ├ `surface` | String | App surface/background tint (e.g. `#0F172A` or `#F8FAFC`) | Hex format |
| ├ `textOnPrimary` | String | Contrast foreground color (e.g. `#FFFFFF`) | Hex format |
| `typography` | Map | Font family preferences | e.g. `Inter`, `Poppins`, `Outfit` |
| `terminology` | Map | Localized vertical terminology overrides: | Key-value string map |
| ├ `itemUnit` | String | "Bird", "Crate", "Tray", "Kg", "Chick" | Default "Item" |
| ├ `sellerLabel` | String | "Farmer", "Breeder", "Hatchery", "Vendor" | Default "Seller" |
| ├ `categoryLabel` | String | "Livestock Section", "Feed Depot", "Equipment" | Default "Category" |
| `supportEmail` | String | Customer service contact email | Valid email |
| `supportPhone` | String | Customer service hotline | Phone format |
| `privacyPolicyUrl` | String | Legal privacy policy link | Valid HTTPS URL |
| `termsOfServiceUrl` | String | Terms and conditions link | Valid HTTPS URL |
| `defaultCurrency` | String | ISO 4217 currency code (e.g. `USD`, `INR`, `KES`, `EUR`) | 3 uppercase chars |
| `defaultLocale` | String | Default locale (e.g. `en_US`, `en_IN`, `sw_KE`) | BCP 47 format |
| `updatedAt` | Timestamp | Last update timestamp | Server timestamp |

### 1.3 Feature Entitlements Model (`/control_plane/v1/entitlements/{tenantId}`)
Controls which modules and runtime capabilities are unlocked for a specific tenant.

| Field | Type | Description |
|---|---|---|
| `tenantId` | String | Reference to tenant |
| `version` | Number | Entitlement specification version (e.g. 1) |
| `modules` | Map<String, EntitlementStatus> | Map of feature key to status object |

Each module status object:
```json
{
  "state": "enabled" | "disabled" | "requested" | "approved" | "suspended",
  "limits": {
    "maxSellers": 50,
    "maxProducts": 5000,
    "maxMonthlyOrders": 100000
  },
  "updatedAt": "2026-10-25T10:00:00Z",
  "reason": "Enterprise tier entitlement"
}
```

#### Standard Feature Keys:
1. `customer_catalogue`: Product browsing, search, categorization.
2. `seller_management`: Multi-vendor onboardings, KYC checks, farmer storefronts.
3. `inventory_management`: Batch tracking, hatch-date logging, live bird weight bands.
4. `order_processing`: Cart, checkout, order tracking, batch dispatch.
5. `delivery_logistics`: Farm-to-gate delivery, fleet dispatch, driver assigning.
6. `coupons_and_promotions`: Farm bundle deals, volume discounts, seasonal promo codes.
7. `push_notifications`: FCM alerts for hatch alerts, price drops, shipment tracking.
8. `reviews_and_ratings`: Verified buyer reviews for poultry batches and feed quality.
9. `analytics_dashboard`: Real-time sales, cohort retention, farm yield reports.
10. `advanced_reporting`: CSV/Excel export, tax reporting, mortality loss analytics.
11. `marketplace_commissions`: Platform fee deduction per transaction.
12. `seller_settlements`: Automated or manual vendor payout reconciliation.
13. `loyalty_program`: Farm reward points, repeat customer incentives.
14. `recurring_subscriptions`: Weekly egg subscriptions, scheduled feed deliveries.
15. `payment_integrations`: Multi-gateway checkout (M-Pesa, Stripe, Razorpay) - *Flagged for future phase*.

### 1.4 Audit Log Model (`/control_plane/v1/audit_logs/{logId}`)
Tamper-evident record of all privileged administrative modifications.

| Field | Type | Description |
|---|---|---|
| `id` | String | Auto-generated UUID |
| `timestamp` | Timestamp | Server timestamp when the action occurred |
| `actorUid` | String | Firebase Auth UID of the platform developer / admin |
| `actorEmail` | String | Email address of the actor |
| `actorRole` | String | Role (`developer`, `super_admin`) |
| `tenantId` | String? | Target tenant ID (or null for platform-wide actions) |
| `action` | String | Event type (e.g. `TENANT_CREATED`, `LIFECYCLE_STATE_CHANGED`, `ENTITLEMENTS_UPDATED`, `BRANDING_SAVED`) |
| `outcome` | String | `SUCCESS` \| `FAILURE` \| `REJECTED` |
| `ipAddress` | String? | Source IP address |
| `userAgent` | String? | Client user agent |
| `details` | Map | Sanitized diff of changed attributes (strictly excludes passwords or keys) |

### 1.5 Tenant Deployment Metadata (`/control_plane/v1/deployments/{tenantId}`)
Keeps track of cloud infrastructure configuration and build targets.

| Field | Type | Description |
|---|---|---|
| `tenantId` | String | Reference to tenant |
| `androidPackageName` | String | e.g. `com.whitelabel.apex_poultry` |
| `iosBundleId` | String | e.g. `com.whitelabel.apex-poultry` |
| `firebaseAppIdAndroid` | String | Registered Firebase Android App ID |
| `firebaseAppIdIos` | String | Registered Firebase iOS App ID |
| `firebaseAppIdWeb` | String | Registered Firebase Web App ID |
| `storageBucketUri` | String | Target GCS bucket URI |
| `fcmTopicName` | String | Main tenant broadcast topic |
| `provisioningChecklist` | Map<String, Boolean> | Checklist items (e.g. `gcp_project_created`, `auth_providers_configured`, `firestore_initialized`, `rules_deployed`) |

---

## 2. Tenant Data Plane Data Models

When deployed to an independent client project (or scoped under `/tenants/{tenantId}/` in shared mode):

### 2.1 User Profile (`users/{userId}`)
| Field | Type | Description |
|---|---|---|
| `uid` | String | Firebase Auth UID |
| `email` | String | User email address |
| `displayName` | String | Full name |
| `phoneNumber` | String? | Verified phone |
| `role` | String | `customer` \| `seller` \| `staff` \| `client_admin` |
| `tenantId` | String | Foreign key to tenant |
| `status` | String | `active` \| `pending_verification` \| `suspended` |
| `createdAt` | Timestamp | Registration timestamp |

### 2.2 Poultry Marketplace Product (`products/{productId}`)
| Field | Type | Description |
|---|---|---|
| `id` | String | Product UUID |
| `sellerId` | String | ID of the farm / hatchery seller |
| `title` | String | e.g. "Cobb 500 Day-Old Broiler Chicks" |
| `category` | String | `live_birds` \| `day_old_chicks` \| `fresh_eggs` \| `feed_nutrition` \| `hatchery_equipment` \| `medication` |
| `description` | String | Detailed batch and breed specifications |
| `pricePerUnit` | Number | Base price |
| `unit` | String | `bird`, `chick`, `tray_30_eggs`, `crate_360_eggs`, `50kg_bag` |
| `stockAvailable` | Number | Current available count |
| `minOrderQuantity` | Number | Minimum purchase quantity (e.g., 50 chicks) |
| `images` | Array<String> | Media URLs |
| `farmLocation` | Map | Origin farm address and geographic coordinates |
| `healthCertified` | Boolean | True if veterinary vaccination certificate is attached |
| `hatchDate` | Timestamp? | Expected or actual hatch date |
| `status` | String | `active` \| `out_of_stock` \| `draft` \| `archived` |
