import '../models/cart_item.dart';
import '../models/product.dart';

abstract class ICartRepository {
  List<CartItem> getItems();

  /// Adds a product to the cart. If a seller conflict occurs, throws [SellerConflictException].
  void addItem(Product product, int quantity);

  void updateQuantity(String productId, int quantity);

  void removeItem(String productId);

  void clearCart();

  String? get currentSellerId;

  String? get currentSellerName;

  bool isSellerConflict(String incomingSellerId);

  double calculateSubtotal();

  double calculateDeliveryFee(double subtotal);

  double calculateTax(double subtotal);

  double calculateTotal(double subtotal, double deliveryFee, double tax);
}

class SellerConflictException implements Exception {
  final String currentSellerName;
  final String newSellerName;

  const SellerConflictException({
    required this.currentSellerName,
    required this.newSellerName,
  });

  @override
  String toString() =>
      'SellerConflictException: Cart already contains items from $currentSellerName. Cannot add from $newSellerName.';
}
