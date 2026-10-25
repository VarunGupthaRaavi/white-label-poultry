import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/branding/theme_provider.dart';
import 'core/auth/auth_provider.dart';
import 'core/entitlements/feature_entitlements.dart';
import 'features/marketplace/screens/marketplace_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const PoultryWhiteLabelApp());
}

class PoultryWhiteLabelApp extends StatelessWidget {
  const PoultryWhiteLabelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AppAuthProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return EntitlementsScope(
            entitlements: themeProvider.entitlements,
            child: MaterialApp(
              title: themeProvider.branding.displayName,
              theme: themeProvider.themeData,
              debugShowCheckedModeBanner: false,
              home: const MarketplaceHomeScreen(),
            ),
          );
        },
      ),
    );
  }
}
