import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:poulty_farm/core/entitlements/feature_entitlements.dart';

void main() {
  group('Feature Entitlements Tests', () {
    test('Correctly identifies enabled vs disabled modules', () {
      final entitlements = TenantEntitlements(
        tenantId: 'tier1-tenant',
        version: 1,
        modules: {
          'customer_catalogue': EntitlementState.enabled,
          'seller_management': EntitlementState.enabled,
          'recurring_subscriptions': EntitlementState.disabled,
          'advanced_reporting': EntitlementState.suspended,
        },
      );

      expect(entitlements.isEnabled('customer_catalogue'), isTrue);
      expect(entitlements.isEnabled('seller_management'), isTrue);
      expect(entitlements.isEnabled('recurring_subscriptions'), isFalse);
      expect(entitlements.isEnabled('advanced_reporting'), isFalse);
      expect(entitlements.isEnabled('non_existent_key'), isFalse);
    });

    testWidgets('EntitlementGuard renders child when module is enabled', (
      tester,
    ) async {
      const entitlements = TenantEntitlements(
        tenantId: 'test',
        version: 1,
        modules: {'delivery_logistics': EntitlementState.enabled},
      );

      await tester.pumpWidget(
        const EntitlementsScope(
          entitlements: entitlements,
          child: MaterialApp(
            home: Scaffold(
              body: EntitlementGuard(
                moduleKey: 'delivery_logistics',
                child: Text('Delivery Features Active'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Delivery Features Active'), findsOneWidget);
    });

    testWidgets('EntitlementGuard hides child when module is disabled', (
      tester,
    ) async {
      const entitlements = TenantEntitlements(
        tenantId: 'test',
        version: 1,
        modules: {'delivery_logistics': EntitlementState.disabled},
      );

      await tester.pumpWidget(
        const EntitlementsScope(
          entitlements: entitlements,
          child: MaterialApp(
            home: Scaffold(
              body: EntitlementGuard(
                moduleKey: 'delivery_logistics',
                child: Text('Delivery Features Active'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Delivery Features Active'), findsNothing);
    });
  });
}
