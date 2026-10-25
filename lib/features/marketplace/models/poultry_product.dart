class PoultryProduct {
  final String id;
  final String title;
  final String category;
  final String description;
  final double pricePerUnit;
  final String unit;
  final int stockAvailable;
  final int minOrderQuantity;
  final String sellerName;
  final String farmLocation;
  final bool healthCertified;
  final String? vaccinationDetails;
  final String imageUrl;

  const PoultryProduct({
    required this.id,
    required this.title,
    required this.category,
    required this.description,
    required this.pricePerUnit,
    required this.unit,
    required this.stockAvailable,
    required this.minOrderQuantity,
    required this.sellerName,
    required this.farmLocation,
    required this.healthCertified,
    this.vaccinationDetails,
    required this.imageUrl,
  });

  static const List<PoultryProduct> sampleCatalog = [
    PoultryProduct(
      id: 'prod_chicks_01',
      title: 'Cobb 500 Day-Old Broiler Chicks',
      category: 'Day-Old Chicks',
      description: 'Fast-growing commercial broiler chicks with excellent feed conversion ratio (FCR 1.45). Vaccinated against Marek\'s disease at hatchery.',
      pricePerUnit: 1.15,
      unit: 'Chick',
      stockAvailable: 2500,
      minOrderQuantity: 50,
      sellerName: 'Highland Hatcheries',
      farmLocation: 'Sector 4, Agri-Hub East',
      healthCertified: true,
      vaccinationDetails: 'Marek\'s HVT + ND-IB Spray',
      imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80',
    ),
    PoultryProduct(
      id: 'prod_layers_02',
      title: 'Isa Brown Point-of-Lay Pullets (16 Weeks)',
      category: 'Live Birds',
      description: 'Fully feathered point-of-lay pullets ready to begin high-efficiency egg laying within 2-3 weeks. Peak lay rate reaches 95%.',
      pricePerUnit: 7.80,
      unit: 'Bird',
      stockAvailable: 800,
      minOrderQuantity: 20,
      sellerName: 'Sunrise Heritage Breeders',
      farmLocation: 'Green Valley Farm #12',
      healthCertified: true,
      vaccinationDetails: 'Complete 16-Week Schedule (Newcastle, Gumboro, Fowl Pox, EDS)',
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop&q=80',
    ),
    PoultryProduct(
      id: 'prod_eggs_03',
      title: 'Grade-A Farm Table Eggs (Crate of 360)',
      category: 'Fresh Eggs',
      description: 'Fresh farm eggs with deep amber yolks from grain-fed layer flocks. Graded large, candled, and packed in reinforced export crates.',
      pricePerUnit: 48.00,
      unit: 'Crate (360 Eggs)',
      stockAvailable: 150,
      minOrderQuantity: 2,
      sellerName: 'Golden Yolk Cooperative',
      farmLocation: 'Central Poultry Depot',
      healthCertified: true,
      vaccinationDetails: 'Salmonella-free certified flock',
      imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
    ),
    PoultryProduct(
      id: 'prod_feed_04',
      title: 'High-Protein Broiler Starter Crumbs (50kg)',
      category: 'Feed & Nutrition',
      description: 'Nutritionally balanced starter feed with 22% crude protein, amino acids, and coccidiostat for chicks from day 1 to day 18.',
      pricePerUnit: 34.50,
      unit: '50kg Bag',
      stockAvailable: 420,
      minOrderQuantity: 5,
      sellerName: 'Apex Feeds & Nutrition Mill',
      farmLocation: 'Industrial Zone Mill #3',
      healthCertified: true,
      vaccinationDetails: 'Quality Certified ISO 22000',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
    ),
    PoultryProduct(
      id: 'prod_equip_05',
      title: 'Digital Automatic Egg Incubator (1056 Capacity)',
      category: 'Equipment',
      description: 'Multi-function automatic egg incubator and setter with dual temperature and humidity microcomputer controllers. Automatic egg turning every 90 mins.',
      pricePerUnit: 420.00,
      unit: 'Unit',
      stockAvailable: 18,
      minOrderQuantity: 1,
      sellerName: 'Apex Hatchery Solutions',
      farmLocation: 'Tech Hub Logistics Park',
      healthCertified: false,
      vaccinationDetails: null,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    ),
    PoultryProduct(
      id: 'prod_kienyeji_06',
      title: 'Kuroiler Dual-Purpose Free-Range Chicks',
      category: 'Day-Old Chicks',
      description: 'Hardy indigenous hybrid chicks suited for free-range scaving with low mortality. Excellent for both meat and colored egg production.',
      pricePerUnit: 1.35,
      unit: 'Chick',
      stockAvailable: 1200,
      minOrderQuantity: 30,
      sellerName: 'Safari Pastures Breeders',
      farmLocation: 'Rift Valley Breeding Outpost',
      healthCertified: true,
      vaccinationDetails: 'Hatchery vaccinated Newcastle + Marek\'s',
      imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80',
    ),
  ];
}
