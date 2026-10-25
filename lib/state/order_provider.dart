import 'package:flutter/material.dart';
import '../domain/models/order.dart';
import '../domain/models/cart_item.dart';
import '../domain/models/address.dart';
import '../domain/repositories/i_order_repository.dart';

class OrderProvider extends ChangeNotifier {
  final IOrderRepository _orderRepository;

  List<CustomerOrder> _orders = [];
  bool _isLoading = false;
  bool _isPlacingOrder = false;
  String? _errorMessage;

  OrderProvider(this._orderRepository);

  List<CustomerOrder> get orders => List.unmodifiable(_orders);
  bool get isLoading => _isLoading;
  bool get isPlacingOrder => _isPlacingOrder;
  String? get errorMessage => _errorMessage;

  Future<void> loadOrders({
    required String tenantId,
    required String customerId,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _orders = await _orderRepository.getCustomerOrders(
        tenantId: tenantId,
        customerId: customerId,
      );
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Places a customer order with double-submission prevention and server validation.
  /// Returns the placed [CustomerOrder] on success, or null on failure.
  Future<CustomerOrder?> placeOrder({
    required String tenantId,
    required String customerId,
    required String customerName,
    required List<CartItem> cartItems,
    required DeliveryAddress deliveryAddress,
    String? customerNotes,
  }) async {
    if (_isPlacingOrder) {
      // Prevent duplicate clicks/submissions
      return null;
    }

    _isPlacingOrder = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final order = await _orderRepository.createOrder(
        tenantId: tenantId,
        customerId: customerId,
        customerName: customerName,
        cartItems: cartItems,
        deliveryAddress: deliveryAddress,
        customerNotes: customerNotes,
      );

      _orders.insert(0, order);
      return order;
    } on OrderValidationException catch (e) {
      _errorMessage = e.message;
      return null;
    } catch (e) {
      _errorMessage =
          'An unexpected error occurred while placing your order: $e';
      return null;
    } finally {
      _isPlacingOrder = false;
      notifyListeners();
    }
  }

  CustomerOrder? getOrderById(String orderId) {
    try {
      return _orders.firstWhere((o) => o.id == orderId);
    } catch (_) {
      return null;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
