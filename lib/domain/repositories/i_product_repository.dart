import '../models/product.dart';
import '../models/review.dart';

abstract class IProductRepository {
  Future<List<Product>> getProducts({
    String? category,
    String? searchQuery,
    String? tenantId,
  });

  Future<Product?> getProductById(String id);

  Future<List<String>> getCategories({String? tenantId});

  Future<List<ProductReview>> getProductReviews(String productId);

  Future<void> addProductReview(ProductReview review);
}
