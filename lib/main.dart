import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/branding/theme_provider.dart';
import 'core/auth/auth_provider.dart';
import 'core/entitlements/feature_entitlements.dart';
import 'data/mock_product_repository.dart';
import 'data/in_memory_cart_repository.dart';
import 'data/in_memory_order_repository.dart';
import 'state/product_provider.dart';
import 'state/cart_provider.dart';
import 'state/order_provider.dart';
import 'state/notification_provider.dart';
import 'ui/navigation/main_nav_scaffold.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const PoultryWhiteLabelApp());
}

class PoultryWhiteLabelApp extends StatelessWidget {
  const PoultryWhiteLabelApp({super.key});

  @override
  Widget build(BuildContext context) {
    final productRepo = MockProductRepository();
    final cartRepo = InMemoryCartRepository();
    final orderRepo = InMemoryOrderRepository();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AppAuthProvider()),
        ChangeNotifierProvider(
          create: (_) => ProductProvider(productRepo)..initialize(),
        ),
        ChangeNotifierProvider(create: (_) => CartProvider(cartRepo)),
        ChangeNotifierProvider(create: (_) => OrderProvider(orderRepo)),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return EntitlementsScope(
            entitlements: themeProvider.entitlements,
            child: MaterialApp(
              title: themeProvider.branding.displayName,
              theme: themeProvider.themeData,
              debugShowCheckedModeBanner: false,
              home: const MainNavScaffold(),
            ),
          );
        },
      ),
    );
  }
}
