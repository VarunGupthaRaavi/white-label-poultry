import '../domain/models/cart_item.dart';
import '../domain/models/product.dart';
import '../domain/repositories/i_cart_repository.dart';

class InMemoryCartRepository implements ICartRepository {
  final List<CartItem> _items = [];

  @override
  List<CartItem> getItems() => List.unmodifiable(_items);

  @override
  String? get currentSellerId {
    if (_items.isEmpty) return null;
    return _items.first.product.sellerId;
  }

  @override
  String? get currentSellerName {
    if (_items.isEmpty) return null;
    return _items.first.product.sellerName;
  }

  @override
  bool isSellerConflict(String incomingSellerId) {
    if (_items.isEmpty) return false;
    return currentSellerId != incomingSellerId;
  }

  @override
  void addItem(Product product, int quantity) {
    if (quantity <= 0) return;

    if (isSellerConflict(product.sellerId)) {
      throw SellerConflictException(
        currentSellerName: currentSellerName ?? 'another seller',
        newSellerName: product.sellerName,
      );
    }

    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );
    if (existingIndex >= 0) {
      final existing = _items[existingIndex];
      _items[existingIndex] = existing.copyWith(
        quantity: existing.quantity + quantity,
        unitPrice: product.price, // Refresh snapshot price
      );
    } else {
      _items.add(
        CartItem(
          product: product,
          quantity: quantity,
          unitPrice: product.price,
        ),
      );
    }
  }

  @override
  void updateQuantity(String productId, int quantity) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      if (quantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index] = _items[index].copyWith(quantity: quantity);
      }
    }
  }

  @override
  void removeItem(String productId) {
    _items.removeWhere((item) => item.product.id == productId);
  }

  @override
  void clearCart() {
    _items.clear();
  }

  @override
  double calculateSubtotal() {
    double total = 0.0;
    for (final item in _items) {
      total += item.totalPrice;
    }
    return total;
  }

  @override
  double calculateDeliveryFee(double subtotal) {
    if (subtotal <= 0) return 0.0;
    // Free delivery on orders ₹500 and above; otherwise ₹50 delivery charge
    if (subtotal >= 500.0) {
      return 0.0;
    }
    return 50.0;
  }

  @override
  double calculateTax(double subtotal) {
    // 5% agricultural standard GST
    return (subtotal * 0.05 * 100).roundToDouble() / 100;
  }

  @override
  double calculateTotal(double subtotal, double deliveryFee, double tax) {
    return subtotal + deliveryFee + tax;
  }
}
