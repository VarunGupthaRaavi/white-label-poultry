class ProductReview {
  final String id;
  final String productId;
  final String customerId;
  final String customerName;
  final double rating; // 1.0 to 5.0
  final String comment;
  final DateTime createdAt;
  final bool verifiedPurchase;

  const ProductReview({
    required this.id,
    required this.productId,
    required this.customerId,
    required this.customerName,
    required this.rating,
    required this.comment,
    required this.createdAt,
    this.verifiedPurchase = true,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'productId': productId,
      'customerId': customerId,
      'customerName': customerName,
      'rating': rating,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
      'verifiedPurchase': verifiedPurchase,
    };
  }

  factory ProductReview.fromMap(Map<String, dynamic> map) {
    return ProductReview(
      id: map['id'] as String? ?? '',
      productId: map['productId'] as String? ?? '',
      customerId: map['customerId'] as String? ?? '',
      customerName: map['customerName'] as String? ?? 'Verified Farmer',
      rating: (map['rating'] as num?)?.toDouble() ?? 5.0,
      comment: map['comment'] as String? ?? '',
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      verifiedPurchase: map['verifiedPurchase'] as bool? ?? true,
    );
  }
}
