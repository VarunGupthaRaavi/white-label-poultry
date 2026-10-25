import 'address.dart';

enum OrderStatus {
  placed,
  confirmed,
  packing,
  outForDelivery,
  delivered,
  cancelled,
}

extension OrderStatusExtension on OrderStatus {
  String get displayName {
    switch (this) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.confirmed:
        return 'Confirmed';
      case OrderStatus.packing:
        return 'Packing & Preparation';
      case OrderStatus.outForDelivery:
        return 'Out for Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  int get stepIndex {
    switch (this) {
      case OrderStatus.placed:
        return 0;
      case OrderStatus.confirmed:
        return 1;
      case OrderStatus.packing:
        return 2;
      case OrderStatus.outForDelivery:
        return 3;
      case OrderStatus.delivered:
        return 4;
      case OrderStatus.cancelled:
        return -1;
    }
  }
}

enum PaymentStatus { pending, unpaid, paid, refunded, failed }

extension PaymentStatusExtension on PaymentStatus {
  String get displayName {
    switch (this) {
      case PaymentStatus.pending:
        return 'Payment Pending (COD / POD)';
      case PaymentStatus.unpaid:
        return 'Unpaid';
      case PaymentStatus.paid:
        return 'Paid';
      case PaymentStatus.refunded:
        return 'Refunded';
      case PaymentStatus.failed:
        return 'Payment Failed';
    }
  }
}

class OrderItemSnapshot {
  final String productId;
  final String title;
  final double unitPrice; // In INR (₹)
  final String unit;
  final int quantity;
  final String imageUrl;
  final String sellerId;
  final String sellerName;

  const OrderItemSnapshot({
    required this.productId,
    required this.title,
    required this.unitPrice,
    required this.unit,
    required this.quantity,
    required this.imageUrl,
    required this.sellerId,
    required this.sellerName,
  });

  double get totalPrice => unitPrice * quantity;

  Map<String, dynamic> toMap() {
    return {
      'productId': productId,
      'title': title,
      'unitPrice': unitPrice,
      'unit': unit,
      'quantity': quantity,
      'imageUrl': imageUrl,
      'sellerId': sellerId,
      'sellerName': sellerName,
      'totalPrice': totalPrice,
    };
  }

  factory OrderItemSnapshot.fromMap(Map<String, dynamic> map) {
    return OrderItemSnapshot(
      productId: map['productId'] as String? ?? '',
      title: map['title'] as String? ?? '',
      unitPrice: (map['unitPrice'] as num?)?.toDouble() ?? 0.0,
      unit: map['unit'] as String? ?? '',
      quantity: (map['quantity'] as num?)?.toInt() ?? 1,
      imageUrl: map['imageUrl'] as String? ?? '',
      sellerId: map['sellerId'] as String? ?? '',
      sellerName: map['sellerName'] as String? ?? '',
    );
  }
}

class CustomerOrder {
  final String id;
  final String tenantId;
  final String customerId;
  final String customerName;
  final String sellerId;
  final String sellerName;
  final List<OrderItemSnapshot> items;
  final double subtotal; // In INR (₹)
  final double deliveryFee; // In INR (₹)
  final double tax; // In INR (₹)
  final double totalAmount; // In INR (₹)
  final OrderStatus orderStatus;
  final PaymentStatus paymentStatus;
  final DeliveryAddress deliveryAddress;
  final DateTime placedAt;
  final DateTime? updatedAt;
  final String? customerNotes;

  const CustomerOrder({
    required this.id,
    required this.tenantId,
    required this.customerId,
    required this.customerName,
    required this.sellerId,
    required this.sellerName,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.tax,
    required this.totalAmount,
    this.orderStatus = OrderStatus.placed,
    this.paymentStatus = PaymentStatus.pending,
    required this.deliveryAddress,
    required this.placedAt,
    this.updatedAt,
    this.customerNotes,
  });

  CustomerOrder copyWith({
    String? id,
    String? tenantId,
    String? customerId,
    String? customerName,
    String? sellerId,
    String? sellerName,
    List<OrderItemSnapshot>? items,
    double? subtotal,
    double? deliveryFee,
    double? tax,
    double? totalAmount,
    OrderStatus? orderStatus,
    PaymentStatus? paymentStatus,
    DeliveryAddress? deliveryAddress,
    DateTime? placedAt,
    DateTime? updatedAt,
    String? customerNotes,
  }) {
    return CustomerOrder(
      id: id ?? this.id,
      tenantId: tenantId ?? this.tenantId,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      tax: tax ?? this.tax,
      totalAmount: totalAmount ?? this.totalAmount,
      orderStatus: orderStatus ?? this.orderStatus,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      placedAt: placedAt ?? this.placedAt,
      updatedAt: updatedAt ?? this.updatedAt,
      customerNotes: customerNotes ?? this.customerNotes,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'tenantId': tenantId,
      'customerId': customerId,
      'customerName': customerName,
      'sellerId': sellerId,
      'sellerName': sellerName,
      'items': items.map((e) => e.toMap()).toList(),
      'subtotal': subtotal,
      'deliveryFee': deliveryFee,
      'tax': tax,
      'totalAmount': totalAmount,
      'orderStatus': orderStatus.name,
      'paymentStatus': paymentStatus.name,
      'deliveryAddress': deliveryAddress.toMap(),
      'placedAt': placedAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'customerNotes': customerNotes,
    };
  }
}
