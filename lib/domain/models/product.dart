enum StockStatus { inStock, lowStock, outOfStock }

class Product {
  final String id;
  final String title;
  final String category;
  final String description;
  final double price; // In Indian Rupees (₹)
  final String unit; // 'kg', 'piece', 'tray', 'dozen', '50kg bag', etc.
  final int stockAvailable;
  final int minOrderQuantity;
  final String sellerId;
  final String sellerName;
  final String sellerCity;
  final bool healthCertified;
  final String? vaccinationDetails;
  final List<String> images;
  final bool isAvailable;
  final double averageRating;
  final int reviewCount;

  const Product({
    required this.id,
    required this.title,
    required this.category,
    required this.description,
    required this.price,
    required this.unit,
    required this.stockAvailable,
    this.minOrderQuantity = 1,
    required this.sellerId,
    required this.sellerName,
    required this.sellerCity,
    this.healthCertified = false,
    this.vaccinationDetails,
    required this.images,
    this.isAvailable = true,
    this.averageRating = 4.8,
    this.reviewCount = 12,
  });

  StockStatus get stockStatus {
    if (!isAvailable || stockAvailable <= 0) {
      return StockStatus.outOfStock;
    }
    if (stockAvailable < 15) {
      return StockStatus.lowStock;
    }
    return StockStatus.inStock;
  }

  String get primaryImage => images.isNotEmpty
      ? images.first
      : 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80';
}
