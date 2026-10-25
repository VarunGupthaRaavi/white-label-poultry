import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/branding/theme_provider.dart';
import '../../../state/product_provider.dart';
import '../../widgets/product_card.dart';

class HomeScreen extends StatelessWidget {
  final Function(int)? onNavigateTab;

  const HomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final productProvider = Provider.of<ProductProvider>(context);
    final branding = themeProvider.branding;
    final products = productProvider.filteredProducts;

    final featuredProducts = products.take(4).toList();
    final eggsProducts = products
        .where((p) => p.category.toLowerCase().contains('egg'))
        .toList();
    final couponsEnabled = themeProvider.isFeatureEnabled(
      'coupons_and_promotions',
    );

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Dynamic Branded Header Banner
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    branding.colors.primary,
                    branding.colors.primary.withValues(alpha: 0.75),
                    const Color(0xFF0F172A),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: branding.colors.primary.withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.egg,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          branding.displayName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Direct from Biosecure Poultry Farms to Your Gate',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Commercial Broilers, Free-Range Country Birds, Eggs, and Feeds priced in Indian Rupees (₹).',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      if (onNavigateTab != null) {
                        onNavigateTab!(1); // Go to Catalog tab
                      }
                    },
                    icon: const Icon(Icons.storefront, size: 16),
                    label: const Text('Explore Live Marketplace'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF0F172A),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      textStyle: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Feature-Gated Promotional Banner
          if (couponsEnabled)
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                  ),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.local_offer, color: Color(0xFFF59E0B), size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Special Farmer Offer! Use code KISAN10',
                            style: TextStyle(
                              color: Color(0xFFFBBF24),
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Get flat ₹ 100 off on first feed order above ₹ 1,500.',
                            style: TextStyle(
                              color: Color(0xFFCBD5E1),
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // Quick Category Selector
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Poultry Categories',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                    child: const Text('View All'),
                  ),
                ],
              ),
            ),
          ),

          // Horizontal Category Quick Access
          SliverToBoxAdapter(
            child: SizedBox(
              height: 90,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildCategoryTile(
                    context,
                    'Broiler Chicken',
                    Icons.pest_control_rodent,
                    () {
                      productProvider.selectCategory('Broiler Chicken');
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                  ),
                  _buildCategoryTile(
                    context,
                    'Country Chicken',
                    Icons.agriculture,
                    () {
                      productProvider.selectCategory('Country Chicken');
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                  ),
                  _buildCategoryTile(context, 'Eggs', Icons.egg_outlined, () {
                    productProvider.selectCategory('Eggs');
                    if (onNavigateTab != null) onNavigateTab!(1);
                  }),
                  _buildCategoryTile(
                    context,
                    'Meat & Cuts',
                    Icons.restaurant,
                    () {
                      productProvider.selectCategory('Chicken Meat and Cuts');
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                  ),
                  _buildCategoryTile(
                    context,
                    'Feeds & Feeders',
                    Icons.grain,
                    () {
                      productProvider.selectCategory('Feeds & Nutrition');
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                  ),
                ],
              ),
            ),
          ),

          // Featured Products Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Featured Livestock & Feeds',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      if (onNavigateTab != null) onNavigateTab!(1);
                    },
                    child: const Text('See All'),
                  ),
                ],
              ),
            ),
          ),

          // Featured Products Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.64,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) =>
                    ProductCard(product: featuredProducts[index]),
                childCount: featuredProducts.length,
              ),
            ),
          ),

          // Farm Trust & Biosecurity Badges
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Platform Quality & Biosecurity Guarantee',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildTrustRow(
                    Icons.security,
                    '100% Biosecure Audited Farms',
                    'All breeder partners undergo routine avian health monitoring and strict farm disinfection.',
                  ),
                  const SizedBox(height: 10),
                  _buildTrustRow(
                    Icons.medication,
                    'Zero Antibiotic Residue Guaranteed',
                    'Fowls and birds are reared with veterinary prescription adherence and no growth promoters.',
                  ),
                  const SizedBox(height: 10),
                  _buildTrustRow(
                    Icons.local_shipping,
                    'Sanitized Cold-Chain & Live Transit',
                    'Specially ventilated vehicles for live birds and chilled vans for table eggs and meats.',
                  ),
                ],
              ),
            ),
          ),

          // Fresh Eggs Spotlight if available
          if (eggsProducts.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Fresh Farm Table Eggs',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        productProvider.selectCategory('Eggs');
                        if (onNavigateTab != null) onNavigateTab!(1);
                      },
                      child: const Text('View All Eggs'),
                    ),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.64,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) => ProductCard(product: eggsProducts[index]),
                  childCount: eggsProducts.length,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCategoryTile(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Theme.of(context).colorScheme.primary, size: 24),
            const SizedBox(height: 6),
            Text(
              title,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustRow(IconData icon, String title, String subtitle) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: const Color(0xFF10B981)),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFE2E8F0),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFF94A3B8),
                  height: 1.3,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
