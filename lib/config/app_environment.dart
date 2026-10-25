import 'tenant_config.dart';
import 'presets/apex_poultry_config.dart';
import 'presets/golden_yolk_config.dart';

class AppEnvironment {
  // Compile-time environment flag passed via --dart-define=TENANT=golden_yolk
  static const String compileTimeTenant = String.fromEnvironment(
    'TENANT',
    defaultValue: 'apex_poultry',
  );

  static final Map<String, TenantConfig> _registeredConfigs = {
    'apex_poultry': apexPoultryConfig,
    'golden_yolk': goldenYolkConfig,
  };

  static TenantConfig _activeConfig = _resolveInitialConfig();

  static TenantConfig get current => _activeConfig;

  static TenantConfig _resolveInitialConfig() {
    final resolved = _registeredConfigs[compileTimeTenant] ?? apexPoultryConfig;
    resolved.validate();
    return resolved;
  }

  /// Safe environment switcher for local QA / dev demonstration.
  /// Validates configuration and triggers notification.
  static void switchTenant(String tenantKey) {
    if (_registeredConfigs.containsKey(tenantKey)) {
      final target = _registeredConfigs[tenantKey]!;
      target.validate();
      _activeConfig = target;
    }
  }

  static List<TenantConfig> get availableConfigs =>
      _registeredConfigs.values.toList();
}
