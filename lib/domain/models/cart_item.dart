import 'product.dart';

class CartItem {
  final Product product;
  final int quantity;
  final double unitPrice; // Snapshot of unit price in INR (₹)

  const CartItem({
    required this.product,
    required this.quantity,
    required this.unitPrice,
  });

  double get totalPrice => unitPrice * quantity;

  CartItem copyWith({Product? product, int? quantity, double? unitPrice}) {
    return CartItem(
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
      unitPrice: unitPrice ?? this.unitPrice,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'productId': product.id,
      'productTitle': product.title,
      'unitPrice': unitPrice,
      'quantity': quantity,
      'totalPrice': totalPrice,
      'unit': product.unit,
      'sellerId': product.sellerId,
      'sellerName': product.sellerName,
    };
  }
}
