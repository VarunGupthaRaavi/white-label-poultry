import 'package:flutter/material.dart';
import '../../config/app_environment.dart';
import '../../config/tenant_config.dart';
import 'tenant_branding.dart';
import '../entitlements/feature_entitlements.dart';

class ThemeProvider extends ChangeNotifier {
  TenantConfig get config => AppEnvironment.current;

  TenantBranding get branding => config.toBranding();

  TenantEntitlements get entitlements => config.toEntitlements();

  List<TenantConfig> get availableTenants => AppEnvironment.availableConfigs;

  ThemeData get themeData => branding.toThemeData();

  bool isFeatureEnabled(String moduleKey) {
    return config.isFeatureEnabled(moduleKey);
  }

  void switchTenant(String tenantId) {
    AppEnvironment.switchTenant(tenantId);
    notifyListeners();
  }
}
