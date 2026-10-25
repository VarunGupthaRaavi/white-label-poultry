import 'package:flutter/material.dart';
import 'tenant_branding.dart';
import '../entitlements/feature_entitlements.dart';

class ThemeProvider extends ChangeNotifier {
  static final Map<String, TenantBranding> _preloadedBrandings = {
    'apex-poultry-hub': const TenantBranding(
      tenantId: 'apex-poultry-hub',
      displayName: 'Apex Poultry Express',
      logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
      iconUrl: null,
      colors: TenantColors(
        primary: Color(0xFF10B981), // Emerald
        secondary: Color(0xFFF59E0B), // Amber
        surface: Color(0xFF0F172A),
        textOnPrimary: Colors.white,
      ),
      fontFamily: 'Inter',
      terminology: TenantTerminology(
        itemUnit: 'Bird',
        sellerLabel: 'Farmer / Breeder',
        categoryLabel: 'Flock Category',
      ),
      supportEmail: 'support@apexpoultry.com',
      supportPhone: '+1-800-555-0142',
      defaultCurrency: 'USD',
      defaultLocale: 'en_US',
    ),
    'golden-yolk-hatcheries': const TenantBranding(
      tenantId: 'golden-yolk-hatcheries',
      displayName: 'Golden Yolk Market',
      logoUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80',
      iconUrl: null,
      colors: TenantColors(
        primary: Color(0xFFD97706), // Egg yolk orange
        secondary: Color(0xFF0284C7), // Sky blue
        surface: Color(0xFF111827),
        textOnPrimary: Colors.white,
      ),
      fontFamily: 'Poppins',
      terminology: TenantTerminology(
        itemUnit: 'Crate / Chick',
        sellerLabel: 'Hatchery Producer',
        categoryLabel: 'Poultry Section',
      ),
      supportEmail: 'help@goldenyolkfarms.com',
      supportPhone: '+1-800-555-0188',
      defaultCurrency: 'USD',
      defaultLocale: 'en_US',
    ),
    'safari-pastures-breeder': const TenantBranding(
      tenantId: 'safari-pastures-breeder',
      displayName: 'Safari Kienyeji Poultry',
      logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop&q=80',
      iconUrl: null,
      colors: TenantColors(
        primary: Color(0xFF059669), // Acacia green
        secondary: Color(0xFFDC2626), // Savannah crimson
        surface: Color(0xFF0F172A),
        textOnPrimary: Colors.white,
      ),
      fontFamily: 'Inter',
      terminology: TenantTerminology(
        itemUnit: 'Flock',
        sellerLabel: 'Poultry Breeder',
        categoryLabel: 'Livestock Category',
      ),
      supportEmail: 'support@safaripoultry.co.ke',
      supportPhone: '+254-700-555123',
      defaultCurrency: 'KES',
      defaultLocale: 'sw_KE',
    ),
  };

  static final Map<String, TenantEntitlements> _preloadedEntitlements = {
    'apex-poultry-hub': const TenantEntitlements(
      tenantId: 'apex-poultry-hub',
      version: 3,
      modules: {
        'customer_catalogue': EntitlementState.enabled,
        'seller_management': EntitlementState.enabled,
        'inventory_management': EntitlementState.enabled,
        'order_processing': EntitlementState.enabled,
        'delivery_logistics': EntitlementState.enabled,
        'coupons_and_promotions': EntitlementState.enabled,
        'push_notifications': EntitlementState.enabled,
        'reviews_and_ratings': EntitlementState.enabled,
        'analytics_dashboard': EntitlementState.enabled,
        'advanced_reporting': EntitlementState.enabled,
        'marketplace_commissions': EntitlementState.enabled,
        'seller_settlements': EntitlementState.enabled,
        'loyalty_program': EntitlementState.enabled,
        'recurring_subscriptions': EntitlementState.enabled,
        'payment_integrations': EntitlementState.disabled,
      },
    ),
    'golden-yolk-hatcheries': const TenantEntitlements(
      tenantId: 'golden-yolk-hatcheries',
      version: 1,
      modules: {
        'customer_catalogue': EntitlementState.enabled,
        'seller_management': EntitlementState.enabled,
        'inventory_management': EntitlementState.enabled,
        'order_processing': EntitlementState.enabled,
        'delivery_logistics': EntitlementState.enabled,
        'coupons_and_promotions': EntitlementState.enabled,
        'push_notifications': EntitlementState.enabled,
        'reviews_and_ratings': EntitlementState.enabled,
        'analytics_dashboard': EntitlementState.enabled,
        'advanced_reporting': EntitlementState.disabled,
        'marketplace_commissions': EntitlementState.disabled,
        'seller_settlements': EntitlementState.disabled,
        'loyalty_program': EntitlementState.disabled,
        'recurring_subscriptions': EntitlementState.disabled,
        'payment_integrations': EntitlementState.disabled,
      },
    ),
    'safari-pastures-breeder': const TenantEntitlements(
      tenantId: 'safari-pastures-breeder',
      version: 1,
      modules: {
        'customer_catalogue': EntitlementState.enabled,
        'seller_management': EntitlementState.enabled,
        'inventory_management': EntitlementState.enabled,
        'order_processing': EntitlementState.enabled,
        'delivery_logistics': EntitlementState.disabled,
        'coupons_and_promotions': EntitlementState.disabled,
        'push_notifications': EntitlementState.enabled,
        'reviews_and_ratings': EntitlementState.enabled,
        'analytics_dashboard': EntitlementState.disabled,
        'advanced_reporting': EntitlementState.disabled,
        'marketplace_commissions': EntitlementState.disabled,
        'seller_settlements': EntitlementState.disabled,
        'loyalty_program': EntitlementState.disabled,
        'recurring_subscriptions': EntitlementState.disabled,
        'payment_integrations': EntitlementState.disabled,
      },
    ),
  };

  String _currentTenantId = 'apex-poultry-hub';

  TenantBranding get branding =>
      _preloadedBrandings[_currentTenantId] ??
      _preloadedBrandings['apex-poultry-hub']!;

  TenantEntitlements get entitlements =>
      _preloadedEntitlements[_currentTenantId] ??
      _preloadedEntitlements['apex-poultry-hub']!;

  List<TenantBranding> get availableTenants =>
      _preloadedBrandings.values.toList();

  ThemeData get themeData => branding.toThemeData();

  void switchTenant(String tenantId) {
    if (_preloadedBrandings.containsKey(tenantId)) {
      _currentTenantId = tenantId;
      notifyListeners();
    }
  }

  void updateBrandingRuntime(TenantBranding updated) {
    _preloadedBrandings[updated.tenantId] = updated;
    if (_currentTenantId == updated.tenantId) {
      notifyListeners();
    }
  }
}
