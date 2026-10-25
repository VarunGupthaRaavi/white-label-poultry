import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../domain/models/order.dart';
import '../../widgets/price_display.dart';
import '../profile/support_policy_screen.dart';

class OrderDetailScreen extends StatelessWidget {
  final CustomerOrder order;

  const OrderDetailScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final formattedDate = DateFormat(
      'dd MMMM yyyy, hh:mm a',
    ).format(order.placedAt);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          order.id,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Tracking Stepper
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Order Tracking Status',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        order.orderStatus.displayName,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF10B981),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildTrackingTimeline(order.orderStatus),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Prominent Payment-Pending Banner (Unpaid Workflow)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.payment, color: Color(0xFFFBBF24), size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Payment Status: Pending',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFFBBF24),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'This order is registered under the Cash / Pay on Delivery workflow. Please keep ${CurrencyFormatter.format(order.totalAmount)} ready at the time of delivery.',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFFCBD5E1),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Item Snapshots Breakdown (Historical Preserved Prices)
            Container(
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
                    'Purchased Items (Price Snapshot)',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...order.items.map(
                    (item) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              item.imageUrl,
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                    width: 50,
                                    height: 50,
                                    color: const Color(0xFF334155),
                                    child: const Icon(
                                      Icons.egg,
                                      color: Color(0xFF64748B),
                                      size: 20,
                                    ),
                                  ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.title,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${item.quantity} ${item.unit} × ${CurrencyFormatter.format(item.unitPrice)}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          PriceDisplay(
                            amount: item.totalPrice,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Delivery Details Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        color: Color(0xFF10B981),
                        size: 18,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Delivery Information',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    order.deliveryAddress.recipientName,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Phone: ${order.deliveryAddress.phone}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    order.deliveryAddress.formattedAddress,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFFCBD5E1),
                      height: 1.4,
                    ),
                  ),
                  if (order.customerNotes != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Customer Note: "${order.customerNotes}"',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFFFBBF24),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Order Invoice Summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Invoice Summary',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        formattedDate,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildSummaryLine(
                    'Subtotal',
                    CurrencyFormatter.format(order.subtotal),
                  ),
                  const SizedBox(height: 6),
                  _buildSummaryLine(
                    'Delivery Charge',
                    order.deliveryFee == 0.0
                        ? 'FREE'
                        : CurrencyFormatter.format(order.deliveryFee),
                  ),
                  const SizedBox(height: 6),
                  _buildSummaryLine(
                    'Agricultural GST (5%)',
                    CurrencyFormatter.format(order.tax),
                  ),
                  const Divider(color: Color(0xFF334155), height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Payable (INR)',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      PriceDisplay(
                        amount: order.totalAmount,
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Support Action Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const SupportPolicyScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.help_outline, size: 18),
                label: const Text('Need Help with this Order?'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFF334155)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackingTimeline(OrderStatus currentStatus) {
    final stages = [
      'Placed',
      'Confirmed',
      'Packing',
      'Out for Delivery',
      'Delivered',
    ];

    final currentIndex = currentStatus.stepIndex;

    return Row(
      children: List.generate(stages.length, (index) {
        final isPassed = index <= currentIndex;
        final isCurrent = index == currentIndex;

        return Expanded(
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 3,
                      color: index == 0
                          ? Colors.transparent
                          : (isPassed
                                ? const Color(0xFF10B981)
                                : const Color(0xFF334155)),
                    ),
                  ),
                  Container(
                    width: isCurrent ? 24 : 16,
                    height: isCurrent ? 24 : 16,
                    decoration: BoxDecoration(
                      color: isPassed
                          ? const Color(0xFF10B981)
                          : const Color(0xFF334155),
                      shape: BoxShape.circle,
                      border: isCurrent
                          ? Border.all(color: Colors.white, width: 2)
                          : null,
                    ),
                    child: isPassed
                        ? const Icon(Icons.check, size: 10, color: Colors.white)
                        : null,
                  ),
                  Expanded(
                    child: Container(
                      height: 3,
                      color: index == stages.length - 1
                          ? Colors.transparent
                          : (index < currentIndex
                                ? const Color(0xFF10B981)
                                : const Color(0xFF334155)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                stages[index],
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: isPassed ? FontWeight.bold : FontWeight.normal,
                  color: isPassed ? Colors.white : const Color(0xFF64748B),
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildSummaryLine(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ],
    );
  }
}
