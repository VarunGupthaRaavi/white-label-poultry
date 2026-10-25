import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/branding/tenant_branding.dart';
import '../../../core/branding/theme_provider.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/entitlements/feature_entitlements.dart';
import '../models/poultry_product.dart';
import 'tenant_switcher_sheet.dart';
import 'seller_dashboard_screen.dart';

class MarketplaceHomeScreen extends StatefulWidget {
  const MarketplaceHomeScreen({super.key});

  @override
  State<MarketplaceHomeScreen> createState() => _MarketplaceHomeScreenState();
}

class _MarketplaceHomeScreenState extends State<MarketplaceHomeScreen> {
  String _selectedCategory = 'All';
  String _searchQuery = '';

  final List<String> _categories = [
    'All',
    'Day-Old Chicks',
    'Live Birds',
    'Fresh Eggs',
    'Feed & Nutrition',
    'Equipment',
  ];

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AppAuthProvider>(context);
    final branding = themeProvider.branding;

    final filteredProducts = PoultryProduct.sampleCatalog.where((p) {
      final matchesCategory =
          _selectedCategory == 'All' || p.category == _selectedCategory;
      final matchesSearch =
          p.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.sellerName.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              branding.displayName,
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 18,
                color: branding.colors.textOnPrimary,
                letterSpacing: -0.5,
              ),
            ),
            Text(
              'Verified ${branding.terminology.sellerLabel} Network',
              style: TextStyle(
                fontSize: 11,
                color: branding.colors.textOnPrimary.withValues(alpha: 0.85),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          // Tenant and Role Switcher Trigger
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: ActionChip(
              avatar: Icon(
                Icons.tune,
                size: 14,
                color: branding.colors.primary,
              ),
              label: Text(
                authProvider.currentUser.roleLabel,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
              backgroundColor: const Color(0xFF1E293B),
              side: BorderSide(
                color: branding.colors.primary.withValues(alpha: 0.5),
              ),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (_) => const TenantSwitcherSheet(),
                );
              },
            ),
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Search & Filters Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Search field
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    decoration: InputDecoration(
                      hintText:
                          'Search breed, flock batch, feed, or hatchery...',
                      hintStyle: const TextStyle(
                        color: Color(0xFF64748B),
                        fontSize: 13,
                      ),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: Color(0xFF64748B),
                      ),
                      filled: true,
                      fillColor: const Color(0xFF151E2E),
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF1E293B)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF1E293B)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: branding.colors.primary),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Categories Horizontal Bar
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _categories.map((cat) {
                        final isSelected = _selectedCategory == cat;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: FilterChip(
                            label: Text(cat),
                            selected: isSelected,
                            onSelected: (_) =>
                                setState(() => _selectedCategory = cat),
                            selectedColor: branding.colors.primary,
                            backgroundColor: const Color(0xFF151E2E),
                            labelStyle: TextStyle(
                              color: isSelected
                                  ? branding.colors.textOnPrimary
                                  : const Color(0xFF94A3B8),
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              fontSize: 12,
                            ),
                            side: BorderSide(
                              color: isSelected
                                  ? branding.colors.primary
                                  : const Color(0xFF1E293B),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Entitlement-Guarded Promo Banner: Coupons & Volume Discounts
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: EntitlementGuard(
                moduleKey: 'coupons_and_promotions',
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        branding.colors.primary.withValues(alpha: 0.2),
                        branding.colors.secondary.withValues(alpha: 0.2),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: branding.colors.primary.withValues(alpha: 0.4),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: branding.colors.primary,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(
                          Icons.local_offer,
                          color: branding.colors.textOnPrimary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Hatchery Volume Incentive Active',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Order 500+ ${branding.terminology.itemUnit}s & receive 10% off Starter Feed.',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFFCBD5E1),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Entitlement-Guarded Recurring Subscriptions Banner
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 4.0,
              ),
              child: EntitlementGuard(
                moduleKey: 'recurring_subscriptions',
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF151E2E),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.repeat,
                        color: Color(0xFF38BDF8),
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Scheduled Farm Replenishment',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Automate weekly egg trays or bi-weekly feed shipments.',
                              style: TextStyle(
                                fontSize: 11,
                                color: Color(0xFF94A3B8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: const Text(
                          'Subscribe',
                          style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFF38BDF8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Seller portal shortcut if role is seller or admin
          if (authProvider.isSeller || authProvider.isAdmin)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 8.0,
                ),
                child: EntitlementGuard(
                  moduleKey: 'seller_management',
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const SellerDashboardScreen(),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: branding.colors.secondary.withValues(
                          alpha: 0.15,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: branding.colors.secondary.withValues(
                            alpha: 0.4,
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.storefront,
                            color: branding.colors.secondary,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Switch to ${branding.terminology.sellerLabel} Portal',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: branding.colors.secondary,
                                  ),
                                ),
                                const Text(
                                  'Manage live bird batches, vaccination logs, and orders.',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFFCBD5E1),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios,
                            size: 14,
                            color: branding.colors.secondary,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

          // Products Section Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Available Poultry Batches (${filteredProducts.length})',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'Unit: ${branding.terminology.itemUnit}',
                    style: TextStyle(
                      fontSize: 11,
                      color: branding.colors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Products Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.65,
              ),
              delegate: SliverChildBuilderDelegate((context, index) {
                final product = filteredProducts[index];
                return _buildProductCard(context, product, branding);
              }, childCount: filteredProducts.length),
            ),
          ),

          // Footer info
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Center(
                child: Text(
                  'White-Label Commerce Platform • Support: ${branding.supportEmail}',
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(
    BuildContext context,
    PoultryProduct product,
    TenantBranding branding,
  ) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _showProductDetails(context, product, branding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with vaccination badge
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 1.3,
                  child: Image.network(
                    product.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      color: const Color(0xFF1E293B),
                      child: const Center(
                        child: Icon(
                          Icons.egg,
                          color: Color(0xFF64748B),
                          size: 36,
                        ),
                      ),
                    ),
                  ),
                ),
                if (product.healthCertified)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: branding.colors.primary,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Vaccinated',
                        style: TextStyle(
                          color: branding.colors.textOnPrimary,
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
              ],
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          product.category,
                          style: const TextStyle(
                            fontSize: 10,
                            color: Color(0xFF94A3B8),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          product.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: Colors.white,
                            height: 1.2,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${branding.terminology.sellerLabel}: ${product.sellerName}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),

                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              '${branding.defaultCurrency} ${product.pricePerUnit.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 13,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              ' / ${product.unit}',
                              style: const TextStyle(
                                fontSize: 10,
                                color: Color(0xFF94A3B8),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () =>
                                _showProductDetails(context, product, branding),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: branding.colors.primary,
                              foregroundColor: branding.colors.textOnPrimary,
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text(
                              'Reserve',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showProductDetails(
    BuildContext context,
    PoultryProduct product,
    TenantBranding branding,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Color(0xFF0F172A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      product.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                product.description,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFFCBD5E1),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    _detailRow('Origin Location', product.farmLocation),
                    _detailRow(
                      branding.terminology.sellerLabel,
                      product.sellerName,
                    ),
                    _detailRow(
                      'Available Stock',
                      '${product.stockAvailable} ${product.unit}s',
                    ),
                    _detailRow(
                      'Minimum Order',
                      '${product.minOrderQuantity} ${product.unit}s',
                    ),
                    if (product.vaccinationDetails != null)
                      _detailRow(
                        'Vaccination Certification',
                        product.vaccinationDetails!,
                        isHighlight: true,
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Batch reserved in ${branding.displayName} checkout!',
                        ),
                        backgroundColor: branding.colors.primary,
                      ),
                    );
                  },
                  child: Text(
                    'Add to Batch Order (${branding.defaultCurrency} ${product.pricePerUnit.toStringAsFixed(2)})',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isHighlight ? const Color(0xFF34D399) : Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
