import 'package:flutter/material.dart';
import '../tenant_config.dart';
import '../../core/branding/tenant_branding.dart';
import '../../core/entitlements/feature_entitlements.dart';

final TenantConfig apexPoultryConfig = TenantConfig(
  tenantId: 'apex_poultry',
  environment: 'production',
  businessName: 'Kisan Poultry Hub & Market',
  legalEntityName: 'Kisan Agro Poultry Technologies Private Limited',
  logoUrl:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
  iconUrl:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=128&auto=format&fit=crop&q=80',
  colors: const TenantColors(
    primary: Color(0xFF10B981), // Emerald Farm Green
    secondary: Color(0xFFF59E0B), // Harvest Gold
    surface: Color(0xFF0F172A),
    textOnPrimary: Colors.white,
  ),
  fontFamily: 'Inter',
  terminology: const TenantTerminology(
    itemUnit: 'Kg / Piece',
    sellerLabel: 'Farmer / Producer',
    categoryLabel: 'Poultry Category',
  ),
  supportEmail: 'support@kisanpoultry.in',
  supportPhone: '+91-1800-419-0233',
  supportAddress: 'Krishi Bhavan Road, Bengaluru, Karnataka 560001',
  termsOfServiceUrl: 'https://kisanpoultry.in/terms',
  privacyPolicyUrl: 'https://kisanpoultry.in/privacy',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
  defaultLocale: 'en_IN',
  approvedCategories: const [
    'Broiler Chicken',
    'Country Chicken',
    'Eggs',
    'Chicken Meat and Cuts',
    'Feeds & Nutrition',
    'Hatchery Equipment',
  ],
  featureModules: const {
    'customer_catalogue': EntitlementState.enabled,
    'seller_management': EntitlementState.enabled,
    'inventory_management': EntitlementState.enabled,
    'order_processing': EntitlementState.enabled,
    'delivery_logistics': EntitlementState.enabled,
    'coupons_and_promotions': EntitlementState.enabled,
    'push_notifications': EntitlementState.enabled,
    'reviews_and_ratings': EntitlementState.enabled,
    'analytics_dashboard': EntitlementState.disabled,
    'advanced_reporting': EntitlementState.disabled,
    'marketplace_commissions': EntitlementState.disabled,
    'seller_settlements': EntitlementState.disabled,
    'loyalty_program': EntitlementState.disabled,
    'recurring_subscriptions': EntitlementState.enabled,
    'payment_integrations':
        EntitlementState.disabled, // Explicitly disabled for Prompt 2
  },
);
