import 'package:flutter/material.dart';
import '../../domain/models/product.dart';

class StockBadge extends StatelessWidget {
  final StockStatus status;
  final int stockCount;

  const StockBadge({super.key, required this.status, required this.stockCount});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    String label;
    IconData icon;

    switch (status) {
      case StockStatus.inStock:
        bgColor = const Color(0xFF10B981).withValues(alpha: 0.15);
        textColor = const Color(0xFF34D399);
        label = 'In Stock';
        icon = Icons.check_circle_outline;
        break;
      case StockStatus.lowStock:
        bgColor = const Color(0xFFF59E0B).withValues(alpha: 0.18);
        textColor = const Color(0xFFFBBF24);
        label = 'Low Stock ($stockCount left)';
        icon = Icons.warning_amber_rounded;
        break;
      case StockStatus.outOfStock:
        bgColor = const Color(0xFFEF4444).withValues(alpha: 0.18);
        textColor = const Color(0xFFF87171);
        label = 'Out of Stock';
        icon = Icons.block;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: textColor.withValues(alpha: 0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: textColor),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: textColor,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
