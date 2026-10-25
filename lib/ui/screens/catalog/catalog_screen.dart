import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../state/product_provider.dart';
import '../../widgets/product_card.dart';
import '../../widgets/empty_state.dart';

class CatalogScreen extends StatelessWidget {
  const CatalogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final productProvider = Provider.of<ProductProvider>(context);
    final products = productProvider.filteredProducts;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Poultry Marketplace',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              onChanged: productProvider.setSearchQuery,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search chicken, eggs, feeds, equipment...',
                hintStyle: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 13,
                ),
                prefixIcon: const Icon(
                  Icons.search,
                  color: Color(0xFF94A3B8),
                  size: 20,
                ),
                suffixIcon: productProvider.searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () => productProvider.setSearchQuery(''),
                      )
                    : null,
                filled: true,
                fillColor: const Color(0xFF1E293B),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 0,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF334155)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF334155)),
                ),
              ),
            ),
          ),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          // Category Selector Pills
          SliverToBoxAdapter(
            child: SizedBox(
              height: 48,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 6,
                ),
                itemCount: productProvider.categories.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = productProvider.categories[index];
                  final isSelected = productProvider.selectedCategory == cat;
                  return ChoiceChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (_) => productProvider.selectCategory(cat),
                    selectedColor: Theme.of(context).colorScheme.primary,
                    backgroundColor: const Color(0xFF1E293B),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                      color: isSelected
                          ? Colors.white
                          : const Color(0xFFCBD5E1),
                    ),
                    side: BorderSide(
                      color: isSelected
                          ? Theme.of(context).colorScheme.primary
                          : const Color(0xFF334155),
                    ),
                  );
                },
              ),
            ),
          ),

          // Filters and Sorting Strip
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // In Stock Filter Chip
                  FilterChip(
                    label: const Text(
                      'In Stock Only',
                      style: TextStyle(fontSize: 11),
                    ),
                    selected: productProvider.inStockOnly,
                    onSelected: (_) => productProvider.toggleInStockOnly(),
                    selectedColor: const Color(
                      0xFF10B981,
                    ).withValues(alpha: 0.25),
                    checkmarkColor: const Color(0xFF10B981),
                    backgroundColor: const Color(0xFF1E293B),
                    labelStyle: TextStyle(
                      color: productProvider.inStockOnly
                          ? const Color(0xFF10B981)
                          : const Color(0xFF94A3B8),
                    ),
                    side: BorderSide(
                      color: productProvider.inStockOnly
                          ? const Color(0xFF10B981)
                          : const Color(0xFF334155),
                    ),
                  ),

                  // Sort Menu
                  DropdownButton<ProductSortOption>(
                    value: productProvider.sortOption,
                    dropdownColor: const Color(0xFF1E293B),
                    underline: const SizedBox(),
                    icon: const Icon(
                      Icons.sort,
                      size: 18,
                      color: Color(0xFF94A3B8),
                    ),
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFFE2E8F0),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: ProductSortOption.featured,
                        child: Text('Featured'),
                      ),
                      DropdownMenuItem(
                        value: ProductSortOption.priceLowToHigh,
                        child: Text('Price: Low to High'),
                      ),
                      DropdownMenuItem(
                        value: ProductSortOption.priceHighToLow,
                        child: Text('Price: High to Low'),
                      ),
                      DropdownMenuItem(
                        value: ProductSortOption.highestRated,
                        child: Text('Highest Rated'),
                      ),
                    ],
                    onChanged: (opt) {
                      if (opt != null) productProvider.setSortOption(opt);
                    },
                  ),
                ],
              ),
            ),
          ),

          // Products Count
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(
                'Showing ${products.length} products',
                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ),
          ),

          // Products Grid or Empty State
          if (productProvider.isLoading)
            const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            )
          else if (products.isEmpty)
            SliverFillRemaining(
              child: EmptyStateWidget(
                icon: Icons.search_off,
                title: 'No Products Found',
                description:
                    'Try adjusting your search query, category filter, or stock settings.',
                actionLabel: 'Reset Filters',
                onAction: () {
                  productProvider.selectCategory('All');
                  productProvider.setSearchQuery('');
                  if (productProvider.inStockOnly) {
                    productProvider.toggleInStockOnly();
                  }
                },
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.64,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) => ProductCard(product: products[index]),
                  childCount: products.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
