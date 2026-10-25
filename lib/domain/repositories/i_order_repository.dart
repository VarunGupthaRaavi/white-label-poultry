import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/address.dart';

class OrderValidationException implements Exception {
  final String message;
  const OrderValidationException(this.message);

  @override
  String toString() => 'OrderValidationException: $message';
}

abstract class IOrderRepository {
  /// Places an order after validating stock, minimum order quantities,
  /// single-seller constraints, recomputing official totals, and taking price snapshots.
  /// Throws [OrderValidationException] if validation fails.
  Future<CustomerOrder> createOrder({
    required String tenantId,
    required String customerId,
    required String customerName,
    required List<CartItem> cartItems,
    required DeliveryAddress deliveryAddress,
    String? customerNotes,
  });

  Future<List<CustomerOrder>> getCustomerOrders({
    required String tenantId,
    required String customerId,
  });

  Future<CustomerOrder?> getOrderById(String orderId);

  Future<CustomerOrder> updateOrderStatus(String orderId, OrderStatus status);
}
