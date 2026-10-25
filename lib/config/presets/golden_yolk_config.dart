import 'package:flutter/material.dart';
import '../tenant_config.dart';
import '../../core/branding/tenant_branding.dart';
import '../../core/entitlements/feature_entitlements.dart';

final TenantConfig goldenYolkConfig = TenantConfig(
  tenantId: 'golden_yolk',
  environment: 'staging',
  businessName: 'Golden Yolk Egg Depot',
  legalEntityName: 'Golden Yolk Poultry Producers LLP',
  logoUrl:
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80',
  iconUrl:
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=128&auto=format&fit=crop&q=80',
  colors: const TenantColors(
    primary: Color(0xFFD97706), // Egg yolk amber
    secondary: Color(0xFF0284C7), // Sky blue
    surface: Color(0xFF111827),
    textOnPrimary: Colors.white,
  ),
  fontFamily: 'Poppins',
  terminology: const TenantTerminology(
    itemUnit: 'Tray / Box',
    sellerLabel: 'Poultry Farm Partner',
    categoryLabel: 'Egg & Bird Section',
  ),
  supportEmail: 'care@goldenyolk.in',
  supportPhone: '+91-1800-200-1122',
  supportAddress: 'Poultry Estate, Namakkal, Tamil Nadu 637001',
  termsOfServiceUrl: 'https://goldenyolk.in/terms',
  privacyPolicyUrl: 'https://goldenyolk.in/privacy',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
  defaultLocale: 'en_IN',
  approvedCategories: const ['Eggs', 'Broiler Chicken', 'Country Chicken'],
  featureModules: const {
    'customer_catalogue': EntitlementState.enabled,
    'seller_management': EntitlementState.enabled,
    'inventory_management': EntitlementState.enabled,
    'order_processing': EntitlementState.enabled,
    'delivery_logistics': EntitlementState.enabled,
    'coupons_and_promotions': EntitlementState.disabled, // Disabled
    'push_notifications': EntitlementState.enabled,
    'reviews_and_ratings':
        EntitlementState.disabled, // Disabled to test feature gating
    'analytics_dashboard': EntitlementState.disabled,
    'advanced_reporting': EntitlementState.disabled,
    'marketplace_commissions': EntitlementState.disabled,
    'seller_settlements': EntitlementState.disabled,
    'loyalty_program': EntitlementState.disabled,
    'recurring_subscriptions': EntitlementState.disabled, // Disabled
    'payment_integrations': EntitlementState.disabled,
  },
);
