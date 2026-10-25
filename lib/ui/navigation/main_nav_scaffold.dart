import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/branding/theme_provider.dart';
import '../../core/auth/auth_provider.dart';
import '../../state/cart_provider.dart';
import '../../state/notification_provider.dart';
import '../../features/marketplace/screens/tenant_switcher_sheet.dart';
import '../screens/home/home_screen.dart';
import '../screens/catalog/catalog_screen.dart';
import '../screens/cart/cart_screen.dart';
import '../screens/orders/order_history_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/notifications/notifications_screen.dart';

class MainNavScaffold extends StatefulWidget {
  const MainNavScaffold({super.key});

  @override
  State<MainNavScaffold> createState() => _MainNavScaffoldState();
}

class _MainNavScaffoldState extends State<MainNavScaffold> {
  int _currentIndex = 0;

  void _onSelectTab(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AppAuthProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context);
    final notificationProvider = Provider.of<NotificationProvider>(context);
    final branding = themeProvider.branding;

    final screens = [
      HomeScreen(onNavigateTab: _onSelectTab),
      const CatalogScreen(),
      CartScreen(onNavigateTab: _onSelectTab),
      OrderHistoryScreen(onNavigateTab: _onSelectTab),
      ProfileScreen(onNavigateTab: _onSelectTab),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              branding.displayName,
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 17,
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
          // Notification Bell with unread badge
          IconButton(
            icon: Badge(
              isLabelVisible: notificationProvider.unreadCount > 0,
              label: Text('${notificationProvider.unreadCount}'),
              child: const Icon(Icons.notifications_outlined),
            ),
            tooltip: 'Notifications',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
          ),

          // Tenant and Role Switcher Chip for dev/QA preview
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
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
      body: IndexedStack(index: _currentIndex, children: screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onSelectTab,
        backgroundColor: const Color(0xFF0F172A),
        indicatorColor: branding.colors.primary.withValues(alpha: 0.2),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Home',
          ),
          const NavigationDestination(
            icon: Icon(Icons.category_outlined),
            selectedIcon: Icon(Icons.category),
            label: 'Catalog',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: cartProvider.totalItemCount > 0,
              label: Text('${cartProvider.totalItemCount}'),
              child: const Icon(Icons.shopping_bag_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: cartProvider.totalItemCount > 0,
              label: Text('${cartProvider.totalItemCount}'),
              child: const Icon(Icons.shopping_bag),
            ),
            label: 'Cart',
          ),
          const NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long),
            label: 'Orders',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Account',
          ),
        ],
      ),
    );
  }
}
