# White-Label Commerce Platform: Architecture Blueprint

## 1. System Overview

This platform is a multi-tenant white-label commerce platform built for independent commercial enterprises, with its initial reference client implementation targeting poultry farm marketplaces (managing broilers, layers, day-old chicks, feed, medication, and hatchery equipment).

The architecture strictly decouples the **Control Plane** (platform management, tenant registry, feature entitlements, branding, audit trails) from the **Tenant Data Plane** (individual business data, product catalogues, customer orders, inventory, and transactions).

```
                      ┌──────────────────────────────────────────────┐
                      │             PLATFORM DEVELOPER               │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTPS (mTLS/Admin JWT)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │    DEVELOPER CONTROL PANEL (Next.js 14)      │
                      │  - Tenant Registry & Lifecycle Management    │
                      │  - Dynamic Branding Editor                   │
                      │  - Entitlement Matrix & Tiering              │
                      │  - Deployment & Firebase Project Checklist   │
                      │  - Audit Log Explorer & Platform Health      │
                      └──────────────────────┬───────────────────────┘
                                             │
                       Callable Functions    │ Firestore Admin
                                             ▼
       ┌─────────────────────────────────────────────────────────────────────────────┐
       │                FIREBASE CONTROL PLANE (Platform Project)                    │
       │                                                                             │
       │  Collections:                                                               │
       │   - /control_plane/v1/tenants/{tenantId}                                    │
       │   - /control_plane/v1/branding/{tenantId}                                   │
       │   - /control_plane/v1/entitlements/{tenantId}                               │
       │   - /control_plane/v1/deployments/{tenantId}                                │
       │   - /control_plane/v1/audit_logs/{logId}                                    │
       │   - /control_plane/v1/platform_metrics/overview                             │
       │                                                                             │
       │  Cloud Functions:                                                           │
       │   - createTenant / updateTenantLifecycle                                    │
       │   - updateTenantEntitlements / updateTenantBranding                         │
       │   - assignUserRole / verifyPlatformDeveloper                                │
       │   - recordAuditEvent                                                        │
       └─────────────────────────────────────────────────────────────────────────────┘
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             │ Provisioning / Config Sync                                    │ App Configuration Delivery
             ▼                                                               ▼
┌─────────────────────────────────────────┐     ┌─────────────────────────────────────────┐
│     TENANT 1 DATA PLANE (PROJECT A)     │     │     TENANT 2 DATA PLANE (PROJECT B)     │
│   e.g. "Sunrise Poultry Hatcheries"     │     │      e.g. "Golden Yolk Farms"           │
│                                         │     │                                         │
│ - Dedicated Firestore Instance          │     │ - Dedicated Firestore Instance          │
│   /products, /orders, /sellers          │     │   /products, /orders, /sellers          │
│ - Dedicated Cloud Storage Bucket        │     │ - Dedicated Cloud Storage Bucket        │
│   tenants/tenant1/media/                │     │   tenants/tenant2/media/                │
│ - Dedicated Firebase Auth User Pool     │     │ - Dedicated Firebase Auth User Pool     │
│ - Custom Domain & FCM Topic             │     │ - Custom Domain & FCM Topic             │
└───────────────────▲─────────────────────┘     └───────────────────▲─────────────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌──────────────────────────────────────────────┐
                    │      WHITE-LABEL CUSTOMER APPLICATION        │
                    │               (Flutter & Dart)               │
                    │                                              │
                    │  - Dynamic Theme & Asset Injection           │
                    │  - Runtime Tenant Configuration Resolver     │
                    │  - Entitlement-Guarded UI Modules            │
                    │  - Role-Aware Navigation (Buyer/Seller)      │
                    │  - Poultry Marketplace Modules               │
                    └──────────────────────────────────────────────┘
```

## 2. Architectural Boundaries & Tenancy Model

### 2.1 The Two-Tier Multi-Tenancy Strategy
1. **Production Deployment Strategy: Separate Firebase Project per Tenant**
   - In production, each enterprise client is provisioned with their own Google Cloud / Firebase project (Data Plane).
   - This provides **hard physical isolation**: compute quotas, database throughput, cryptographic keys, GDPR/data sovereignty compliance, and storage buckets are strictly isolated. No cross-tenant data leaks can occur via shared query execution.
2. **Platform Management Environment: Dedicated Platform Project**
   - The developer control panel connects exclusively to the platform-level Firebase project hosting the Control Plane collections and trusted Cloud Functions.
3. **Staging / Shared Multi-Tenant Mode: Logical Tenant Namespace**
   - For dev/testing environments where provisioning multiple GCP projects is impractical, the platform supports logical data partitioning under root `/tenants/{tenantId}/...` with strict Firestore Security Rules.

## 3. Technology Stack Breakdown

| Component | Technology | Rationale |
|---|---|---|
| **Customer Mobile App** | Flutter 3.44+ (Dart 3.12+) | Cross-platform (iOS & Android) with 60/120fps UI performance, unified canvas rendering, and dynamic run-time branding injection. |
| **Developer Control Panel** | React 18, Next.js (TypeScript), Lucide Icons | Server-side rendering, secure session handling, rich data tables, live branding customizers. |
| **Backend & Cloud Functions** | Firebase Functions (Node.js 20/22, TypeScript) | Event-driven microservices, atomic triggers, custom token & claim minting, centralized audit log recording. |
| **Database** | Cloud Firestore | Highly scalable NoSQL document database with real-time sync, offline persistence, and fine-grained declarative security rules. |
| **Object Storage** | Firebase Cloud Storage | High-throughput asset storage for farm product media, KYC certificates, compliance paperwork, and brand logos. |
| **Authentication** | Firebase Authentication | Enterprise-ready identity management with custom JWT claims (`role`, `tenantId`, `permissions`). |
| **Integrity & Security** | Firebase App Check + Storage & Firestore Rules | Device attestation (Play Integrity / DeviceCheck / reCAPTCHA Enterprise) blocking rogue API clients. |

## 4. Key Subsystems
1. **Tenant Registry**: Authoritative directory of all commercial partners, their billing/subscription status, technical endpoints, and lifecycle state.
2. **Feature Entitlement Engine**: Centralized, version-controlled capability matrix that unlocks modules based on tenant tier.
3. **Dynamic White-Label Branding Engine**: Translates brand color tokens, typography scales, poultry terminology (e.g., "Flock", "Crate", "Tray", "Broiler"), and media URLs into native Flutter `ThemeData` at runtime.
4. **Security & Audit Logger**: Cryptographically verifies developer identity before any privileged mutation, storing tamper-resistant audit records.
