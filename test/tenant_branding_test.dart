import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:poulty_farm/core/branding/tenant_branding.dart';

void main() {
  group('TenantBranding Tests', () {
    test('Parses hex colors and terminology correctly', () {
      final branding = TenantBranding.fromMap({
        'tenantId': 'test-farm',
        'displayName': 'Test Poultry Co.',
        'logoUrl': 'https://example.com/logo.png',
        'colors': {
          'primary': '#059669',
          'secondary': '#F59E0B',
          'surface': '#0F172A',
          'textOnPrimary': '#FFFFFF',
        },
        'typography': {'fontFamily': 'Outfit'},
        'terminology': {
          'itemUnit': 'Flock',
          'sellerLabel': 'Breeder Partner',
          'categoryLabel': 'Livestock',
        },
        'supportEmail': 'help@testfarm.com',
        'supportPhone': '+1-800-000',
        'defaultCurrency': 'KES',
        'defaultLocale': 'sw_KE',
      });

      expect(branding.tenantId, 'test-farm');
      expect(branding.displayName, 'Test Poultry Co.');
      expect(branding.colors.primary, const Color(0xFF059669));
      expect(branding.colors.secondary, const Color(0xFFF59E0B));
      expect(branding.colors.surface, const Color(0xFF0F172A));
      expect(branding.terminology.itemUnit, 'Flock');
      expect(branding.terminology.sellerLabel, 'Breeder Partner');
      expect(branding.defaultCurrency, 'KES');
    });

    test('Converts branding into valid Material 3 ThemeData', () {
      final branding = TenantBranding.fromMap({
        'tenantId': 'emerald-coop',
        'displayName': 'Emerald Poultry',
        'colors': {
          'primary': '#10B981',
          'secondary': '#F59E0B',
          'surface': '#0F172A',
          'textOnPrimary': '#FFFFFF',
        },
      });

      final theme = branding.toThemeData();
      expect(theme.colorScheme.primary, const Color(0xFF10B981));
      expect(theme.colorScheme.secondary, const Color(0xFFF59E0B));
      expect(theme.colorScheme.surface, const Color(0xFF0F172A));
      expect(theme.colorScheme.onPrimary, Colors.white);
      expect(theme.useMaterial3, isTrue);
    });
  });
}
