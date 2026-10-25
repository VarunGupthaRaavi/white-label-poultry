import '../domain/models/product.dart';
import '../domain/models/review.dart';
import '../domain/repositories/i_product_repository.dart';

class MockProductRepository implements IProductRepository {
  static final List<Product> _catalog = [
    const Product(
      id: 'prod_broiler_01',
      title: 'Commercial Broiler Chicken (Live / Whole)',
      category: 'Broiler Chicken',
      description:
          'Healthy, farm-raised Cobb 500 broiler chicken with optimal body weight (1.8kg - 2.2kg). Grown on strictly vegetarian, antibiotic-residue-free grain feed with complete biosecurity compliance.',
      price: 145.0, // ₹ 145 per kg
      unit: 'kg',
      stockAvailable: 450,
      minOrderQuantity: 2,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Poultry Farms & Hatcheries',
      sellerCity: 'Hosur, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails:
          'Vaccinated for Marek\'s, Ranikhet (ND), and Gumboro (IBD)',
      images: [
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.8,
      reviewCount: 38,
    ),
    const Product(
      id: 'prod_country_02',
      title: 'Pure Aseel Desi Country Chicken',
      category: 'Country Chicken',
      description:
          'Authentic free-range Desi Aseel rooster/hen raised on natural pasture and millets. High lean-protein content, firm texture, and rich traditional flavor.',
      price: 380.0, // ₹ 380 per kg
      unit: 'kg',
      stockAvailable: 85,
      minOrderQuantity: 1,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Poultry Farms & Hatcheries',
      sellerCity: 'Hosur, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails: 'Dewormed and Lassota ND vaccinated',
      images: [
        'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.9,
      reviewCount: 24,
    ),
    const Product(
      id: 'prod_kadaknath_03',
      title: 'Kadaknath Original Black Meat Chicken',
      category: 'Country Chicken',
      description:
          'Certified pure Kadaknath breed from Jhabua lineage. Recognized for unique black meat, high iron, low cholesterol, and medicinal properties. Reared in ethical open enclosures.',
      price: 750.0, // ₹ 750 per kg
      unit: 'kg',
      stockAvailable: 12, // Low stock demo!
      minOrderQuantity: 1,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Poultry Farms & Hatcheries',
      sellerCity: 'Hosur, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails:
          'Complete breed lineage certification + Veterinary Health Pass',
      images: [
        'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.7,
      reviewCount: 15,
    ),
    const Product(
      id: 'prod_eggs_tray_04',
      title: 'Farm Fresh White Table Eggs (Tray of 30)',
      category: 'Eggs',
      description:
          'Grade-A table eggs candled for cleanliness and shell integrity. Packed securely in sanitised molded pulp trays. High protein, rich in vitamins A & D.',
      price: 195.0, // ₹ 195 per tray (₹ 6.50 per egg)
      unit: 'tray (30 eggs)',
      stockAvailable: 320,
      minOrderQuantity: 1,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Poultry Farms & Hatcheries',
      sellerCity: 'Hosur, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails: 'Layer flock Salmonella negative audited',
      images: [
        'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.9,
      reviewCount: 62,
    ),
    const Product(
      id: 'prod_desi_eggs_05',
      title: 'Organic Desi Brown Free-Range Eggs (Pack of 12)',
      category: 'Eggs',
      description:
          'Premium brown eggs laid by pasture-raised indigenous hens. Naturally thick golden-yellow yolks with superior omega-3 content.',
      price: 140.0, // ₹ 140 per pack of 12
      unit: 'pack (12 eggs)',
      stockAvailable: 110,
      minOrderQuantity: 1,
      sellerId: 'seller_krishna_01',
      sellerName: 'Krishna Poultry Farms & Hatcheries',
      sellerCity: 'Hosur, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails: 'Certified pasture feed inspection',
      images: [
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.8,
      reviewCount: 19,
    ),
    const Product(
      id: 'prod_cuts_breast_06',
      title: 'Tender Fresh Boneless Chicken Breast Cuts',
      category: 'Chicken Meat and Cuts',
      description:
          'Skinless, boneless chicken breast fillets hygienically chilled and processed in FSSAI-certified dressing plants. 100% halal certified.',
      price: 260.0, // ₹ 260 per kg
      unit: 'kg',
      stockAvailable: 60,
      minOrderQuantity: 1,
      sellerId: 'seller_venkateshwara_02',
      sellerName: 'Venkateshwara Fresh Meats & Cuts',
      sellerCity: 'Bengaluru, Karnataka',
      healthCertified: true,
      vaccinationDetails: 'Zero hormone, zero antimicrobial residue tested',
      images: [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.6,
      reviewCount: 41,
    ),
    const Product(
      id: 'prod_cuts_curry_07',
      title: 'Prime Curry Cut Chicken (Skinless, 500g Pack)',
      category: 'Chicken Meat and Cuts',
      description:
          'Uniform bone-in curry cut pieces comprising breast, thigh, drumstick, and wings. Cleaned, washed, and vacuum packed for instant cooking.',
      price: 130.0, // ₹ 130 per 500g
      unit: '500g pack',
      stockAvailable: 95,
      minOrderQuantity: 2,
      sellerId: 'seller_venkateshwara_02',
      sellerName: 'Venkateshwara Fresh Meats & Cuts',
      sellerCity: 'Bengaluru, Karnataka',
      healthCertified: true,
      vaccinationDetails: 'FSSAI License #11221334000189',
      images: [
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.7,
      reviewCount: 29,
    ),
    const Product(
      id: 'prod_feed_starter_08',
      title: 'High-Energy Broiler Pre-Starter Crumbs (50kg)',
      category: 'Feeds & Nutrition',
      description:
          'Pre-starter formulated feed with 23% crude protein, balanced essential amino acids (Lysine & Methionine), prebiotic enzymes, and phytase to maximize early chick growth.',
      price: 1950.0, // ₹ 1,950 per bag
      unit: '50kg bag',
      stockAvailable: 150,
      minOrderQuantity: 1,
      sellerId: 'seller_godrej_agro_03',
      sellerName: 'Godrej Agrovet Feed Mill',
      sellerCity: 'Dharmapuri, Tamil Nadu',
      healthCertified: true,
      vaccinationDetails: 'Quality Certified BIS IS:1374 standard',
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.9,
      reviewCount: 53,
    ),
    const Product(
      id: 'prod_equip_drinker_09',
      title: 'Automatic Poultry Bell Drinker & Feeder Kit',
      category: 'Hatchery Equipment',
      description:
          'Heavy-duty food-grade polypropylene automatic bell drinker with ball-valve water regulator and anti-scratch feed pan for 50 birds.',
      price: 480.0, // ₹ 480 per kit
      unit: 'kit (Drinker + Feeder)',
      stockAvailable: 75,
      minOrderQuantity: 1,
      sellerId: 'seller_godrej_agro_03',
      sellerName: 'Godrej Agrovet Feed Mill',
      sellerCity: 'Dharmapuri, Tamil Nadu',
      healthCertified: false,
      vaccinationDetails: null,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: true,
      averageRating: 4.5,
      reviewCount: 17,
    ),
    const Product(
      id: 'prod_equip_incubator_10',
      title: 'Automatic Dual-Power Egg Incubator (528 Eggs)',
      category: 'Hatchery Equipment',
      description:
          'Microcomputer-controlled commercial incubator with automatic turning trays, ultrasonic humidifier, and 12V battery emergency backup support for power cuts.',
      price: 14500.0, // ₹ 14,500
      unit: 'unit',
      stockAvailable: 0, // Out of stock demo!
      minOrderQuantity: 1,
      sellerId: 'seller_godrej_agro_03',
      sellerName: 'Godrej Agrovet Feed Mill',
      sellerCity: 'Dharmapuri, Tamil Nadu',
      healthCertified: false,
      vaccinationDetails: null,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      ],
      isAvailable: false,
      averageRating: 4.8,
      reviewCount: 8,
    ),
  ];

  static final Map<String, List<ProductReview>> _reviews = {
    'prod_broiler_01': [
      ProductReview(
        id: 'rev_01',
        productId: 'prod_broiler_01',
        customerId: 'cust_01',
        customerName: 'Ramesh Patel (Poultry Trader)',
        rating: 5.0,
        comment:
            'Uniform bird weight and very clean batch. Mortality was zero during transit. Will order regularly.',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
      ProductReview(
        id: 'rev_02',
        productId: 'prod_broiler_01',
        customerId: 'cust_02',
        customerName: 'Anand Kumar',
        rating: 4.5,
        comment:
            'Good healthy birds. Delivery was prompt at 6:00 AM as promised.',
        createdAt: DateTime.now().subtract(const Duration(days: 7)),
      ),
    ],
    'prod_eggs_tray_04': [
      ProductReview(
        id: 'rev_03',
        productId: 'prod_eggs_tray_04',
        customerId: 'cust_03',
        customerName: 'Sunita Mehra (Bakery Owner)',
        rating: 5.0,
        comment:
            'Zero cracks in 5 trays! Fresh eggs with great yolk consistency. Excellent packaging.',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
    ],
  };

  @override
  Future<List<Product>> getProducts({
    String? category,
    String? searchQuery,
    String? tenantId,
  }) async {
    // Simulate slight async network delay
    await Future.delayed(const Duration(milliseconds: 50));
    return _catalog.where((p) {
      final matchesCategory =
          category == null ||
          category.isEmpty ||
          category == 'All' ||
          p.category.toLowerCase() == category.toLowerCase();

      final matchesQuery =
          searchQuery == null ||
          searchQuery.trim().isEmpty ||
          p.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(searchQuery.toLowerCase()) ||
          p.sellerName.toLowerCase().contains(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    }).toList();
  }

  @override
  Future<Product?> getProductById(String id) async {
    await Future.delayed(const Duration(milliseconds: 30));
    try {
      return _catalog.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<List<String>> getCategories({String? tenantId}) async {
    final categories = <String>{'All'};
    for (final p in _catalog) {
      categories.add(p.category);
    }
    return categories.toList();
  }

  @override
  Future<List<ProductReview>> getProductReviews(String productId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    return _reviews[productId] ?? [];
  }

  @override
  Future<void> addProductReview(ProductReview review) async {
    await Future.delayed(const Duration(milliseconds: 50));
    _reviews.putIfAbsent(review.productId, () => []).insert(0, review);
  }
}
