import 'package:intl/intl.dart';

class CurrencyFormatter {
  static final NumberFormat _inrFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  static final NumberFormat _compactInrFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  /// Formats amount in Indian Rupees (e.g. ₹ 1,450.00)
  static String format(double amount, {String symbol = '₹'}) {
    if (symbol == '₹' || symbol == 'INR') {
      return _inrFormatter.format(amount);
    }
    final customFormat = NumberFormat.currency(
      symbol: symbol.endsWith(' ') ? symbol : '$symbol ',
      decimalDigits: 2,
    );
    return customFormat.format(amount);
  }

  /// Compact format without decimals for integer prices (e.g. ₹ 450)
  static String formatCompact(double amount, {String symbol = '₹'}) {
    if (amount % 1 == 0) {
      if (symbol == '₹' || symbol == 'INR') {
        return _compactInrFormatter.format(amount);
      }
      return '$symbol ${amount.toInt()}';
    }
    return format(amount, symbol: symbol);
  }
}
