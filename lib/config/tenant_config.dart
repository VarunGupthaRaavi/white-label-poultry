import '../core/branding/tenant_branding.dart';
import '../core/entitlements/feature_entitlements.dart';

class TenantConfigValidationException implements Exception {
  final String message;
  const TenantConfigValidationException(this.message);

  @override
  String toString() => 'TenantConfigValidationException: $message';
}

class TenantConfig {
  final String tenantId;
  final String environment;
  final String businessName;
  String get displayName => businessName;
  final String legalEntityName;
  final String logoUrl;
  final String? iconUrl;
  final TenantColors colors;
  final String fontFamily;
  final TenantTerminology terminology;
  final String supportEmail;
  final String supportPhone;
  final String supportAddress;
  final String termsOfServiceUrl;
  final String privacyPolicyUrl;
  final String defaultCurrency;
  final String currencySymbol;
  final String defaultLocale;
  final List<String> approvedCategories;
  final Map<String, EntitlementState> featureModules;

  const TenantConfig({
    required this.tenantId,
    required this.environment,
    required this.businessName,
    required this.legalEntityName,
    required this.logoUrl,
    this.iconUrl,
    required this.colors,
    required this.fontFamily,
    required this.terminology,
    required this.supportEmail,
    required this.supportPhone,
    required this.supportAddress,
    required this.termsOfServiceUrl,
    required this.privacyPolicyUrl,
    required this.defaultCurrency,
    required this.currencySymbol,
    required this.defaultLocale,
    required this.approvedCategories,
    required this.featureModules,
  });

  /// Validates configuration integrity. Throws [TenantConfigValidationException] if malformed.
  void validate() {
    if (tenantId.trim().isEmpty) {
      throw const TenantConfigValidationException('tenantId must not be empty');
    }
    if (businessName.trim().isEmpty) {
      throw const TenantConfigValidationException(
        'businessName must not be empty',
      );
    }
    if (defaultCurrency != 'INR' &&
        defaultCurrency != 'USD' &&
        defaultCurrency != 'KES') {
      throw TenantConfigValidationException(
        'Unsupported currency: $defaultCurrency',
      );
    }
    if (approvedCategories.isEmpty) {
      throw const TenantConfigValidationException(
        'At least one approved category must be specified',
      );
    }
    if (!supportEmail.contains('@')) {
      throw const TenantConfigValidationException(
        'Invalid support email specified in tenant configuration',
      );
    }
  }

  bool isFeatureEnabled(String moduleKey) {
    return featureModules[moduleKey] == EntitlementState.enabled;
  }

  TenantBranding toBranding() {
    return TenantBranding(
      tenantId: tenantId,
      displayName: businessName,
      logoUrl: logoUrl,
      iconUrl: iconUrl,
      colors: colors,
      fontFamily: fontFamily,
      terminology: terminology,
      supportEmail: supportEmail,
      supportPhone: supportPhone,
      defaultCurrency: defaultCurrency,
      defaultLocale: defaultLocale,
    );
  }

  TenantEntitlements toEntitlements() {
    return TenantEntitlements(
      tenantId: tenantId,
      version: 1,
      modules: featureModules,
    );
  }
}
