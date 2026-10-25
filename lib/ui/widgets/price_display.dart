import 'package:flutter/material.dart';
import '../../core/utils/currency_formatter.dart';

class PriceDisplay extends StatelessWidget {
  final double amount;
  final String? unit;
  final double fontSize;
  final FontWeight fontWeight;
  final Color? color;
  final bool isCompact;

  const PriceDisplay({
    super.key,
    required this.amount,
    this.unit,
    this.fontSize = 16,
    this.fontWeight = FontWeight.bold,
    this.color,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = color ?? Theme.of(context).colorScheme.primary;
    final formatted = isCompact
        ? CurrencyFormatter.formatCompact(amount)
        : CurrencyFormatter.format(amount);

    if (unit != null && unit!.isNotEmpty) {
      return RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: formatted,
              style: TextStyle(
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: textColor,
              ),
            ),
            TextSpan(
              text: ' / $unit',
              style: TextStyle(
                fontSize: fontSize * 0.75,
                fontWeight: FontWeight.normal,
                color: Colors.white70,
              ),
            ),
          ],
        ),
      );
    }

    return Text(
      formatted,
      style: TextStyle(
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: textColor,
      ),
    );
  }
}
