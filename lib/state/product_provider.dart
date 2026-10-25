import 'package:flutter/material.dart';
import '../domain/models/product.dart';
import '../domain/models/review.dart';
import '../domain/repositories/i_product_repository.dart';

enum ProductSortOption {
  featured,
  priceLowToHigh,
  priceHighToLow,
  highestRated,
}

class ProductProvider extends ChangeNotifier {
  final IProductRepository _productRepository;

  List<Product> _allProducts = [];
  List<String> _categories = ['All'];
  String _selectedCategory = 'All';
  String _searchQuery = '';
  bool _inStockOnly = false;
  ProductSortOption _sortOption = ProductSortOption.featured;
  bool _isLoading = false;
  String? _errorMessage;

  ProductProvider(this._productRepository);

  List<String> get categories => _categories;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  bool get inStockOnly => _inStockOnly;
  ProductSortOption get sortOption => _sortOption;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<Product> get filteredProducts {
    var list = _allProducts.where((p) {
      final matchesCategory =
          _selectedCategory == 'All' ||
          p.category.toLowerCase() == _selectedCategory.toLowerCase();

      final matchesQuery =
          _searchQuery.isEmpty ||
          p.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.sellerName.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesStock =
          !_inStockOnly || p.stockStatus != StockStatus.outOfStock;

      return matchesCategory && matchesQuery && matchesStock;
    }).toList();

    switch (_sortOption) {
      case ProductSortOption.priceLowToHigh:
        list.sort((a, b) => a.price.compareTo(b.price));
        break;
      case ProductSortOption.priceHighToLow:
        list.sort((a, b) => b.price.compareTo(a.price));
        break;
      case ProductSortOption.highestRated:
        list.sort((a, b) => b.averageRating.compareTo(a.averageRating));
        break;
      case ProductSortOption.featured:
        // Default list order
        break;
    }

    return list;
  }

  Future<void> initialize({String? tenantId}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _productRepository.getProducts(tenantId: tenantId),
        _productRepository.getCategories(tenantId: tenantId),
      ]);

      _allProducts = results[0] as List<Product>;
      _categories = results[1] as List<String>;
    } catch (e) {
      _errorMessage = 'Failed to load catalog: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void toggleInStockOnly() {
    _inStockOnly = !_inStockOnly;
    notifyListeners();
  }

  void setSortOption(ProductSortOption option) {
    _sortOption = option;
    notifyListeners();
  }

  Future<Product?> getProductById(String id) async {
    return _productRepository.getProductById(id);
  }

  Future<List<ProductReview>> getReviews(String productId) async {
    return _productRepository.getProductReviews(productId);
  }

  Future<void> addReview(ProductReview review) async {
    await _productRepository.addProductReview(review);
    notifyListeners();
  }
}
