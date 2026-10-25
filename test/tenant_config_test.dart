import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:poulty_farm/config/tenant_config.dart';
import 'package:poulty_farm/config/presets/apex_poultry_config.dart';
import 'package:poulty_farm/config/presets/golden_yolk_config.dart';
import 'package:poulty_farm/config/app_environment.dart';
import 'package:poulty_farm/core/branding/tenant_branding.dart';

void main() {
  group('Tenant Configuration Tests', () {
    test('Validates Kisan Poultry Hub configuration successfully', () {
      expect(apexPoultryConfig.tenantId, 'apex_poultry');
      expect(apexPoultryConfig.businessName, 'Kisan Poultry Hub & Market');
      expect(apexPoultryConfig.defaultCurrency, 'INR');
      expect(apexPoultryConfig.currencySymbol, '₹');
      expect(apexPoultryConfig.defaultLocale, 'en_IN');
      expect(apexPoultryConfig.approvedCategories, contains('Broiler Chicken'));
      expect(apexPoultryConfig.approvedCategories, contains('Eggs'));
      expect(() => apexPoultryConfig.validate(), returnsNormally);
    });

    test(
      'Validates Golden Yolk Egg Depot configuration with feature gating',
      () {
        expect(goldenYolkConfig.tenantId, 'golden_yolk');
        expect(goldenYolkConfig.defaultCurrency, 'INR');
        expect(
          goldenYolkConfig.isFeatureEnabled('reviews_and_ratings'),
          isFalse,
        );
        expect(
          goldenYolkConfig.isFeatureEnabled('coupons_and_promotions'),
          isFalse,
        );
        expect(goldenYolkConfig.isFeatureEnabled('customer_catalogue'), isTrue);
        expect(() => goldenYolkConfig.validate(), returnsNormally);
      },
    );

    test(
      'Throws TenantConfigValidationException on missing mandatory fields',
      () {
        final invalidConfig = TenantConfig(
          tenantId: '',
          environment: 'development',
          businessName: '',
          legalEntityName: 'Test Corp',
          logoUrl: 'https://example.com/logo.png',
          colors: const TenantColors(
            primary: Colors.blue,
            secondary: Colors.amber,
            surface: Colors.black,
            textOnPrimary: Colors.white,
          ),
          fontFamily: 'Inter',
          terminology: const TenantTerminology(
            itemUnit: 'unit',
            sellerLabel: 'seller',
            categoryLabel: 'category',
          ),
          supportEmail: 'invalid-email',
          supportPhone: '1234567890',
          supportAddress: '123 Street',
          termsOfServiceUrl: 'https://example.com/terms',
          privacyPolicyUrl: 'https://example.com/privacy',
          defaultCurrency: 'INR',
          currencySymbol: '₹',
          defaultLocale: 'en_IN',
          approvedCategories: const ['Category 1'],
          featureModules: const {},
        );

        expect(
          () => invalidConfig.validate(),
          throwsA(isA<TenantConfigValidationException>()),
        );
      },
    );

    test('AppEnvironment resolves active config and supports switching', () {
      expect(AppEnvironment.current.tenantId, 'apex_poultry');
      AppEnvironment.switchTenant('golden_yolk');
      expect(AppEnvironment.current.tenantId, 'golden_yolk');
      // Reset back
      AppEnvironment.switchTenant('apex_poultry');
      expect(AppEnvironment.current.tenantId, 'apex_poultry');
    });
  });
}
