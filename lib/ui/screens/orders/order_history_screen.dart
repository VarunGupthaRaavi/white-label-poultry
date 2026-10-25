import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../core/branding/theme_provider.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../domain/models/order.dart';
import '../../../state/order_provider.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/price_display.dart';
import 'order_detail_screen.dart';

class OrderHistoryScreen extends StatefulWidget {
  final Function(int)? onNavigateTab;

  const OrderHistoryScreen({super.key, this.onNavigateTab});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
      final authProvider = Provider.of<AppAuthProvider>(context, listen: false);
      final orderProvider = Provider.of<OrderProvider>(context, listen: false);
      orderProvider.loadOrders(
        tenantId: themeProvider.config.tenantId,
        customerId: authProvider.currentUser.uid,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = Provider.of<OrderProvider>(context);

    if (orderProvider.isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text(
            'My Orders',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (orderProvider.orders.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text(
            'My Orders',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        body: EmptyStateWidget(
          icon: Icons.receipt_long_outlined,
          title: 'No Orders Yet',
          description:
              'You haven\'t placed any poultry orders yet. Explore our marketplace to buy healthy birds, eggs, and feeds.',
          actionLabel: 'Start Shopping',
          onAction: () {
            if (widget.onNavigateTab != null) widget.onNavigateTab!(1);
          },
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'My Orders',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: orderProvider.orders.length,
        itemBuilder: (context, index) {
          final order = orderProvider.orders[index];
          return _buildOrderCard(context, order);
        },
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, CustomerOrder order) {
    final formattedDate = DateFormat(
      'dd MMM yyyy, hh:mm a',
    ).format(order.placedAt);

    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => OrderDetailScreen(order: order)),
        );
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Order ID & Status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  order.id,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Colors.white,
                  ),
                ),
                _buildStatusChip(order.orderStatus),
              ],
            ),
            const SizedBox(height: 6),

            // Date & Seller
            Text(
              formattedDate,
              style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(
                  Icons.storefront,
                  size: 14,
                  color: Color(0xFF94A3B8),
                ),
                const SizedBox(width: 4),
                Text(
                  order.sellerName,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFFCBD5E1),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const Divider(color: Color(0xFF334155), height: 20),

            // Item Snapshot Summary
            ...order.items
                .take(2)
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 4.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '${item.quantity}× ${item.title}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFFCBD5E1),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Text(
                          CurrencyFormatter.format(item.totalPrice),
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            if (order.items.length > 2)
              Text(
                '+ ${order.items.length - 2} more item(s)',
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFF64748B),
                  fontStyle: FontStyle.italic,
                ),
              ),
            const SizedBox(height: 12),

            // Bottom Row: Payment Status & Total
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                    ),
                  ),
                  child: Text(
                    order.paymentStatus.displayName,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFBBF24),
                    ),
                  ),
                ),
                Row(
                  children: [
                    const Text(
                      'Total: ',
                      style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                    ),
                    PriceDisplay(
                      amount: order.totalAmount,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(OrderStatus status) {
    Color bg;
    Color fg;

    switch (status) {
      case OrderStatus.placed:
        bg = const Color(0xFF0284C7).withValues(alpha: 0.2);
        fg = const Color(0xFF38BDF8);
        break;
      case OrderStatus.confirmed:
        bg = const Color(0xFF8B5CF6).withValues(alpha: 0.2);
        fg = const Color(0xFFA78BFA);
        break;
      case OrderStatus.packing:
        bg = const Color(0xFFF59E0B).withValues(alpha: 0.2);
        fg = const Color(0xFFFBBF24);
        break;
      case OrderStatus.outForDelivery:
        bg = const Color(0xFF10B981).withValues(alpha: 0.2);
        fg = const Color(0xFF34D399);
        break;
      case OrderStatus.delivered:
        bg = const Color(0xFF10B981).withValues(alpha: 0.2);
        fg = const Color(0xFF34D399);
        break;
      case OrderStatus.cancelled:
        bg = const Color(0xFFDC2626).withValues(alpha: 0.2);
        fg = const Color(0xFFF87171);
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        status.displayName,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: fg),
      ),
    );
  }
}
