import '../domain/models/order.dart';
import '../domain/models/cart_item.dart';
import '../domain/models/address.dart';
import '../domain/repositories/i_order_repository.dart';

class InMemoryOrderRepository implements IOrderRepository {
  final List<CustomerOrder> _orders = [];

  InMemoryOrderRepository() {
    _seedInitialOrders();
  }

  void _seedInitialOrders() {
    // Initial completed order for realistic order history demonstration
    _orders.add(
      CustomerOrder(
        id: 'ORD-2026-8842',
        tenantId: 'apex_poultry',
        customerId: 'user_cust_01',
        customerName: 'Suresh Kumar',
        sellerId: 'seller_krishna_01',
        sellerName: 'Krishna Poultry Farms & Hatcheries',
        items: const [
          OrderItemSnapshot(
            productId: 'prod_broiler_01',
            title: 'Commercial Broiler Chicken (Live / Whole)',
            unitPrice: 145.0,
            unit: 'kg',
            quantity: 5,
            imageUrl:
                'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80',
            sellerId: 'seller_krishna_01',
            sellerName: 'Krishna Poultry Farms & Hatcheries',
          ),
          OrderItemSnapshot(
            productId: 'prod_eggs_tray_04',
            title: 'Farm Fresh White Table Eggs (Tray of 30)',
            unitPrice: 195.0,
            unit: 'tray (30 eggs)',
            quantity: 2,
            imageUrl:
                'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
            sellerId: 'seller_krishna_01',
            sellerName: 'Krishna Poultry Farms & Hatcheries',
          ),
        ],
        subtotal: 1115.0,
        deliveryFee: 0.0, // Free delivery for >= ₹500
        tax: 55.75, // 5% GST
        totalAmount: 1170.75,
        orderStatus: OrderStatus.outForDelivery,
        paymentStatus: PaymentStatus.pending, // Pending Cash/Pay on Delivery
        deliveryAddress: const DeliveryAddress(
          id: 'addr_01',
          recipientName: 'Suresh Kumar',
          phone: '+91-98765-43210',
          streetAddress: 'Plot 42, Green Valley Farm Road',
          locality: 'Near Agro Checkpost',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560064',
          isDefault: true,
        ),
        placedAt: DateTime.now().subtract(const Duration(hours: 4)),
        customerNotes: 'Please call before gate delivery.',
      ),
    );
  }

  @override
  Future<CustomerOrder> createOrder({
    required String tenantId,
    required String customerId,
    required String customerName,
    required List<CartItem> cartItems,
    required DeliveryAddress deliveryAddress,
    String? customerNotes,
  }) async {
    // 1. Validate non-empty cart
    if (cartItems.isEmpty) {
      throw const OrderValidationException(
        'Cannot place an order with an empty cart.',
      );
    }

    // 2. Validate tenant ID
    if (tenantId.trim().isEmpty) {
      throw const OrderValidationException(
        'Tenant identification is missing or invalid.',
      );
    }

    // 3. Validate single-seller consistency
    final firstSellerId = cartItems.first.product.sellerId;
    final firstSellerName = cartItems.first.product.sellerName;
    for (final item in cartItems) {
      if (item.product.sellerId != firstSellerId) {
        throw const OrderValidationException(
          'Single-seller checkout policy violation: Multi-seller carts cannot be placed in a single order.',
        );
      }
    }

    // 4. Validate stock and minimum order quantities on server-side
    for (final item in cartItems) {
      final product = item.product;
      if (!product.isAvailable) {
        throw OrderValidationException(
          'Product "${product.title}" is currently unavailable for purchase.',
        );
      }
      if (product.stockAvailable < item.quantity) {
        throw OrderValidationException(
          'Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stockAvailable}.',
        );
      }
      if (item.quantity < product.minOrderQuantity) {
        throw OrderValidationException(
          'Minimum order quantity for "${product.title}" is ${product.minOrderQuantity} ${product.unit}.',
        );
      }
    }

    // 5. Recompute trusted totals from live product prices
    double calculatedSubtotal = 0.0;
    final List<OrderItemSnapshot> itemSnapshots = [];

    for (final item in cartItems) {
      final currentPrice = item.product.price;
      final lineTotal = currentPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      itemSnapshots.add(
        OrderItemSnapshot(
          productId: item.product.id,
          title: item.product.title,
          unitPrice: currentPrice,
          unit: item.product.unit,
          quantity: item.quantity,
          imageUrl: item.product.primaryImage,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
        ),
      );
    }

    final double calculatedDeliveryFee = calculatedSubtotal >= 500.0
        ? 0.0
        : 50.0;
    final double calculatedTax =
        (calculatedSubtotal * 0.05 * 100).roundToDouble() / 100;
    final double grandTotal =
        calculatedSubtotal + calculatedDeliveryFee + calculatedTax;

    // 6. Generate order ID and timestamp
    final String orderId =
        'ORD-${DateTime.now().year}-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

    final order = CustomerOrder(
      id: orderId,
      tenantId: tenantId,
      customerId: customerId,
      customerName: customerName,
      sellerId: firstSellerId,
      sellerName: firstSellerName,
      items: itemSnapshots,
      subtotal: calculatedSubtotal,
      deliveryFee: calculatedDeliveryFee,
      tax: calculatedTax,
      totalAmount: grandTotal,
      orderStatus: OrderStatus.placed,
      paymentStatus: PaymentStatus.pending, // Explicit unpaid / pending payment
      deliveryAddress: deliveryAddress,
      placedAt: DateTime.now(),
      customerNotes: customerNotes,
    );

    _orders.insert(0, order);
    return order;
  }

  @override
  Future<List<CustomerOrder>> getCustomerOrders({
    required String tenantId,
    required String customerId,
  }) async {
    await Future.delayed(const Duration(milliseconds: 40));
    return _orders
        .where((o) => o.tenantId == tenantId && o.customerId == customerId)
        .toList();
  }

  @override
  Future<CustomerOrder?> getOrderById(String orderId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    try {
      return _orders.firstWhere((o) => o.id == orderId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<CustomerOrder> updateOrderStatus(
    String orderId,
    OrderStatus status,
  ) async {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index < 0) {
      throw OrderValidationException('Order $orderId not found');
    }
    final updated = _orders[index].copyWith(
      orderStatus: status,
      updatedAt: DateTime.now(),
    );
    _orders[index] = updated;
    return updated;
  }
}
