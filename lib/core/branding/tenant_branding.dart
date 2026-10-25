import 'package:flutter/material.dart';

class TenantTerminology {
  final String itemUnit;
  final String sellerLabel;
  final String categoryLabel;

  const TenantTerminology({
    required this.itemUnit,
    required this.sellerLabel,
    required this.categoryLabel,
  });

  factory TenantTerminology.fromMap(Map<String, dynamic> map) {
    return TenantTerminology(
      itemUnit: map['itemUnit'] ?? 'Bird',
      sellerLabel: map['sellerLabel'] ?? 'Farmer / Breeder',
      categoryLabel: map['categoryLabel'] ?? 'Flock Category',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'itemUnit': itemUnit,
      'sellerLabel': sellerLabel,
      'categoryLabel': categoryLabel,
    };
  }
}

class TenantColors {
  final Color primary;
  final Color secondary;
  final Color surface;
  final Color textOnPrimary;

  const TenantColors({
    required this.primary,
    required this.secondary,
    required this.surface,
    required this.textOnPrimary,
  });

  static Color _parseHex(String? hexString, Color fallback) {
    if (hexString == null || hexString.isEmpty) return fallback;
    final clean = hexString.replaceAll('#', '');
    if (clean.length == 6) {
      return Color(int.parse('FF$clean', radix: 16));
    } else if (clean.length == 8) {
      return Color(int.parse(clean, radix: 16));
    }
    return fallback;
  }

  factory TenantColors.fromMap(Map<String, dynamic> map) {
    return TenantColors(
      primary: _parseHex(map['primary'], const Color(0xFF10B981)),
      secondary: _parseHex(map['secondary'], const Color(0xFFF59E0B)),
      surface: _parseHex(map['surface'], const Color(0xFF0F172A)),
      textOnPrimary: _parseHex(map['textOnPrimary'], Colors.white),
    );
  }
}

class TenantBranding {
  final String tenantId;
  final String displayName;
  final String logoUrl;
  final String? iconUrl;
  final TenantColors colors;
  final String fontFamily;
  final TenantTerminology terminology;
  final String supportEmail;
  final String supportPhone;
  final String defaultCurrency;
  final String defaultLocale;

  const TenantBranding({
    required this.tenantId,
    required this.displayName,
    required this.logoUrl,
    this.iconUrl,
    required this.colors,
    required this.fontFamily,
    required this.terminology,
    required this.supportEmail,
    required this.supportPhone,
    required this.defaultCurrency,
    required this.defaultLocale,
  });

  factory TenantBranding.fromMap(Map<String, dynamic> map) {
    return TenantBranding(
      tenantId: map['tenantId'] ?? 'default-poultry',
      displayName: map['displayName'] ?? 'Poultry Hub',
      logoUrl: map['logoUrl'] ?? '',
      iconUrl: map['iconUrl'],
      colors: TenantColors.fromMap(
        Map<String, dynamic>.from(map['colors'] ?? {}),
      ),
      fontFamily: map['typography']?['fontFamily'] ?? 'Inter',
      terminology: TenantTerminology.fromMap(
        Map<String, dynamic>.from(map['terminology'] ?? {}),
      ),
      supportEmail: map['supportEmail'] ?? 'support@poultryhub.com',
      supportPhone: map['supportPhone'] ?? '+1-800-555-0100',
      defaultCurrency: map['defaultCurrency'] ?? 'USD',
      defaultLocale: map['defaultLocale'] ?? 'en_US',
    );
  }

  ThemeData toThemeData() {
    final colorScheme = ColorScheme(
      brightness: Brightness.dark,
      primary: colors.primary,
      onPrimary: colors.textOnPrimary,
      secondary: colors.secondary,
      onSecondary: Colors.black,
      error: const Color(0xFFEF4444),
      onError: Colors.white,
      surface: colors.surface,
      onSurface: const Color(0xFFF8FAFC),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFF090D16),
      cardTheme: CardThemeData(
        color: const Color(0xFF151E2E),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF1E293B)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: colors.surface,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.primary,
          foregroundColor: colors.textOnPrimary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          textStyle: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
