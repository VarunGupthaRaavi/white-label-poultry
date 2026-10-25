import 'package:flutter/material.dart';

class SingleSellerConflictDialog extends StatelessWidget {
  final String currentSellerName;
  final String newSellerName;
  final VoidCallback onConfirmReplace;

  const SingleSellerConflictDialog({
    super.key,
    required this.currentSellerName,
    required this.newSellerName,
    required this.onConfirmReplace,
  });

  static Future<bool?> show(
    BuildContext context, {
    required String currentSellerName,
    required String newSellerName,
    required VoidCallback onConfirmReplace,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (_) => SingleSellerConflictDialog(
        currentSellerName: currentSellerName,
        newSellerName: newSellerName,
        onConfirmReplace: onConfirmReplace,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Row(
        children: [
          Icon(Icons.storefront_outlined, color: Color(0xFFF59E0B), size: 24),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Replace Cart Items?',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Your cart already contains items from "$currentSellerName".',
            style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 14),
          ),
          const SizedBox(height: 10),
          Text(
            'Under the single-seller checkout rule, an order can only be placed from one seller at a time. Do you want to clear your current cart and add this item from "$newSellerName"?',
            style: const TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text(
            'Keep Existing Cart',
            style: TextStyle(color: Color(0xFF94A3B8)),
          ),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFDC2626),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          onPressed: () {
            Navigator.of(context).pop(true);
            onConfirmReplace();
          },
          child: const Text('Clear & Add New'),
        ),
      ],
    );
  }
}
