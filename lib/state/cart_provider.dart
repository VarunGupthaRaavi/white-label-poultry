import 'package:flutter/material.dart';
import '../domain/models/cart_item.dart';
import '../domain/models/product.dart';
import '../domain/repositories/i_cart_repository.dart';

class CartProvider extends ChangeNotifier {
  final ICartRepository _repository;

  CartProvider(this._repository);

  List<CartItem> get items => _repository.getItems();

  int get totalItemCount {
    int count = 0;
    for (final item in items) {
      count += item.quantity;
    }
    return count;
  }

  bool get isEmpty => items.isEmpty;

  String? get currentSellerId => _repository.currentSellerId;
  String? get currentSellerName => _repository.currentSellerName;

  double get subtotal => _repository.calculateSubtotal();
  double get deliveryFee => _repository.calculateDeliveryFee(subtotal);
  double get tax => _repository.calculateTax(subtotal);
  double get totalAmount =>
      _repository.calculateTotal(subtotal, deliveryFee, tax);

  /// Checks if adding a product would cause a seller conflict
  bool causesSellerConflict(Product product) {
    return _repository.isSellerConflict(product.sellerId);
  }

  /// Adds a product to the cart. If a seller conflict occurs, throws [SellerConflictException].
  void addToCart(Product product, {int? quantity}) {
    final qty = quantity ?? product.minOrderQuantity;
    _repository.addItem(product, qty);
    notifyListeners();
  }

  /// Replaces existing cart with a single item from a new seller (user-confirmed override)
  void replaceCartWith(Product product, {int? quantity}) {
    _repository.clearCart();
    final qty = quantity ?? product.minOrderQuantity;
    _repository.addItem(product, qty);
    notifyListeners();
  }

  void updateQuantity(String productId, int newQuantity) {
    _repository.updateQuantity(productId, newQuantity);
    notifyListeners();
  }

  void incrementQuantity(String productId) {
    final item = items.firstWhere((i) => i.product.id == productId);
    if (item.quantity < item.product.stockAvailable) {
      updateQuantity(productId, item.quantity + 1);
    }
  }

  void decrementQuantity(String productId) {
    final item = items.firstWhere((i) => i.product.id == productId);
    if (item.quantity > item.product.minOrderQuantity) {
      updateQuantity(productId, item.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  }

  void removeFromCart(String productId) {
    _repository.removeItem(productId);
    notifyListeners();
  }

  void clear() {
    _repository.clearCart();
    notifyListeners();
  }
}
