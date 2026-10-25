# White-Label Flutter Customer Application Configuration & Build Guide

This document details the compile-time configuration, tenant flavor management, secret-free templates, and production build pipelines for the White-Label Flutter Customer Application.

---

## 1. Multi-Tenant Architecture Overview

The platform uses a single, shared Flutter codebase across multiple independent commerce clients. To ensure tenant isolation and prevent malicious cross-tenant switching, the customer mobile application resolves its identity **at compile-time** using Dart environment declarations (`--dart-define=TENANT=...`).

### Security Principles:
- **No Client-Side Firebase Project Switching**: Customers are never permitted to switch Firebase projects or alter tenant parameters at runtime in production builds.
- **Fail-Safe Loading**: The configuration loader validates every parameter upon initialization. If required fields are missing or invalid, the app throws a `TenantConfigValidationException` rather than silently granting unauthorized privileges.
- **Backend-Enforced Authorization**: UI feature gating is complemented by backend security rules and Firestore RBAC. A hidden button does not constitute authorization.
- **Indian Rupee (₹ / INR) Currency Engine**: All prices, sub-totals, delivery fees, and taxes are strictly handled and formatted in Indian Rupees using standard agricultural GST calculations.

---

## 2. Configured Tenants

The platform currently includes two pre-configured, validated tenants:

| Parameter | Primary Tenant: Kisan Poultry Hub | Second Reference Tenant: Golden Yolk Egg Depot |
|---|---|---|
| **Tenant ID** | `apex_poultry` | `golden_yolk` |
| **Business Name** | Kisan Poultry Hub & Market | Golden Yolk Egg Depot |
| **Legal Entity** | Kisan Agro Poultry Technologies Pvt Ltd | Golden Yolk Poultry Producers LLP |
| **Currency** | `INR` (`₹`) | `INR` (`₹`) |
| **Locale** | `en_IN` | `en_IN` |
| **Categories** | Broiler Chicken, Country Chicken, Eggs, Cuts, Feeds, Equipment | Eggs, Broiler Chicken, Country Chicken |
| **Reviews & Ratings** | **Enabled** (`EntitlementState.enabled`) | **Disabled** (`EntitlementState.disabled`) |
| **Promotions & Coupons** | **Enabled** (`EntitlementState.enabled`) | **Disabled** (`EntitlementState.disabled`) |
| **Payment Gateway** | **Disabled** (Payment-Pending COD/POD) | **Disabled** (Payment-Pending COD/POD) |

---

## 3. Configuration File Templates (Without Secrets)

### 3.1 Template: `lib/config/presets/tenant_template.dart`
```dart
import 'package:flutter/material.dart';
import '../tenant_config.dart';
import '../../core/branding/tenant_branding.dart';
import '../../core/entitlements/feature_entitlements.dart';

final TenantConfig sampleTenantConfig = TenantConfig(
  tenantId: 'sample_client',
  environment: 'production', // 'development' | 'staging' | 'production'
  businessName: 'Sample Agro Hub',
  legalEntityName: 'Sample Agro Commerce Private Limited',
  logoUrl: 'https://cdn.example.com/assets/logo.png',
  iconUrl: 'https://cdn.example.com/assets/icon.png',
  colors: const TenantColors(
    primary: Color(0xFF10B981), // Primary brand color
    secondary: Color(0xFFF59E0B), // Accent color
    surface: Color(0xFF0F172A),
    textOnPrimary: Colors.white,
  ),
  fontFamily: 'Inter',
  terminology: const TenantTerminology(
    itemUnit: 'Kg / Unit',
    sellerLabel: 'Producer / Farmer',
    categoryLabel: 'Product Category',
  ),
  supportEmail: 'support@sampleagro.in',
  supportPhone: '+91-1800-000-0000',
  supportAddress: 'Industrial Agro Zone, Bengaluru, Karnataka 560001',
  termsOfServiceUrl: 'https://sampleagro.in/terms',
  privacyPolicyUrl: 'https://sampleagro.in/privacy',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
  defaultLocale: 'en_IN',
  approvedCategories: const [
    'Broiler Chicken',
    'Country Chicken',
    'Eggs',
    'Feeds & Nutrition',
  ],
  featureModules: const {
    'customer_catalogue': EntitlementState.enabled,
    'seller_management': EntitlementState.enabled,
    'inventory_management': EntitlementState.enabled,
    'order_processing': EntitlementState.enabled,
    'delivery_logistics': EntitlementState.enabled,
    'coupons_and_promotions': EntitlementState.disabled,
    'push_notifications': EntitlementState.enabled,
    'reviews_and_ratings': EntitlementState.enabled,
    'payment_integrations': EntitlementState.disabled, // Explicitly disabled
  },
);
```

---

## 4. Compile-Time Build & Run Commands

### 4.1 Running with Primary Tenant (Kisan Poultry Hub)
```bash
# Debug Run
flutter run --dart-define=TENANT=apex_poultry

# Release APK Build
flutter build apk --release --dart-define=TENANT=apex_poultry

# Release Web Bundle
flutter build web --release --dart-define=TENANT=apex_poultry
```

### 4.2 Running with Second Tenant (Golden Yolk Egg Depot)
```bash
# Debug Run (Notice reviews and coupons will be automatically disabled)
flutter run --dart-define=TENANT=golden_yolk

# Release APK Build
flutter build apk --release --dart-define=TENANT=golden_yolk

# Release Web Bundle
flutter build web --release --dart-define=TENANT=golden_yolk
```

---

## 5. Cart & Order Architecture

### 5.1 Single-Seller Cart Policy
- A customer cannot mix items from multiple poultry producers in the same shopping cart.
- When an item from Seller B is added while items from Seller A are present, the application prompts the customer via `SingleSellerConflictDialog` to either keep their current cart or clear it and start fresh with Seller B.
- This constraint is isolated in `InMemoryCartRepository` and `CartProvider` so that multi-seller checkout can be introduced in a future release without UI rewrites.

### 5.2 Unpaid / Payment-Pending Workflow
- In compliance with Phase 2 requirements, **no payment gateway SDK is embedded**.
- Orders are placed in `PaymentStatus.pending` (`paymentStatus = PaymentStatus.pending`), clearly communicating that payment is due upon delivery (**Cash on Delivery / Pay on Delivery**).
- Server/repository re-calculates official totals (subtotal, ₹ 50 delivery fee if subtotal < ₹ 500, and 5% GST) rather than trusting client numbers.
- Double-submission debouncing (`isPlacingOrder`) prevents accidental duplicate orders.
- Historical snapshots of item titles, prices in ₹, units, and descriptions are preserved in the `CustomerOrder` record so future seller catalog edits do not corrupt completed/pending order invoices.

---

## 6. Verification Checklist

To verify the code quality and correctness of the Flutter customer application:

```bash
# 1. Code Formatting
dart format .

# 2. Static Analysis (Zero warnings, Zero errors)
flutter analyze

# 3. Comprehensive Unit & Widget Test Suite
flutter test

# 4. Flutter Bundle Compilation
flutter build bundle
```
