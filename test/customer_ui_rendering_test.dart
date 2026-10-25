import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:poulty_farm/domain/models/product.dart';
import 'package:poulty_farm/core/utils/currency_formatter.dart';
import 'package:poulty_farm/ui/widgets/stock_badge.dart';
import 'package:poulty_farm/ui/widgets/price_display.dart';
import 'package:poulty_farm/ui/widgets/single_seller_dialog.dart';

void main() {
  group('Customer UI Components & INR Formatting', () {
    testWidgets('StockBadge renders color-coded indicators correctly', (
      tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                StockBadge(status: StockStatus.inStock, stockCount: 100),
                StockBadge(status: StockStatus.lowStock, stockCount: 8),
                StockBadge(status: StockStatus.outOfStock, stockCount: 0),
              ],
            ),
          ),
        ),
      );

      expect(find.text('In Stock'), findsOneWidget);
      expect(find.text('Low Stock (8 left)'), findsOneWidget);
      expect(find.text('Out of Stock'), findsOneWidget);
    });

    testWidgets('PriceDisplay formats Indian Rupee symbol and unit correctly', (
      tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                PriceDisplay(amount: 145.0, unit: 'kg'),
                PriceDisplay(amount: 1950.0, isCompact: true),
              ],
            ),
          ),
        ),
      );

      // Verify PriceDisplay widgets are mounted and contain RichText with ₹ and unit
      expect(find.byType(PriceDisplay), findsNWidgets(2));
      final richTextFinder = find.byWidgetPredicate(
        (widget) =>
            widget is RichText &&
            widget.text.toPlainText().contains('₹') &&
            widget.text.toPlainText().contains('/ kg'),
      );
      expect(richTextFinder, findsOneWidget);
      expect(
        find.textContaining('₹'),
        findsOneWidget,
      ); // The compact one is a Text widget
    });

    test('CurrencyFormatter formats INR correctly', () {
      expect(CurrencyFormatter.format(145.0), contains('145'));
      expect(CurrencyFormatter.format(1450.50), contains('1,450.50'));
      expect(CurrencyFormatter.formatCompact(450.0), contains('450'));
    });

    testWidgets(
      'SingleSellerConflictDialog displays both seller names and triggers callbacks',
      (tester) async {
        bool replaced = false;

        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) => ElevatedButton(
                  onPressed: () {
                    SingleSellerConflictDialog.show(
                      context,
                      currentSellerName: 'Krishna Poultry Farms',
                      newSellerName: 'Venkateshwara Fresh Meats',
                      onConfirmReplace: () {
                        replaced = true;
                      },
                    );
                  },
                  child: const Text('Trigger Conflict'),
                ),
              ),
            ),
          ),
        );

        // Tap trigger
        await tester.tap(find.text('Trigger Conflict'));
        await tester.pumpAndSettle();

        expect(find.text('Replace Cart Items?'), findsOneWidget);
        expect(find.textContaining('Krishna Poultry Farms'), findsOneWidget);
        expect(
          find.textContaining('Venkateshwara Fresh Meats'),
          findsOneWidget,
        );

        // Confirm replace
        await tester.tap(find.text('Clear & Add New'));
        await tester.pumpAndSettle();

        expect(replaced, isTrue);
      },
    );
  });
}
