import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../domain/models/notification_item.dart';
import '../../../state/notification_provider.dart';
import '../../widgets/empty_state.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notificationProvider = Provider.of<NotificationProvider>(context);
    final notifications = notificationProvider.notifications;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Notifications',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          if (notifications.isNotEmpty)
            TextButton(
              onPressed: notificationProvider.markAllAsRead,
              child: const Text('Mark All Read'),
            ),
        ],
      ),
      body: notifications.isEmpty
          ? const EmptyStateWidget(
              icon: Icons.notifications_none,
              title: 'No Notifications',
              description:
                  'You\'re all caught up! Order status updates, price changes, and announcements will appear here.',
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notif = notifications[index];
                return _buildNotificationCard(
                  context,
                  notif,
                  notificationProvider,
                );
              },
            ),
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    NotificationItem notif,
    NotificationProvider provider,
  ) {
    final formattedTime = DateFormat('dd MMM, hh:mm a').format(notif.timestamp);

    IconData icon;
    Color iconColor;

    switch (notif.type) {
      case NotificationType.orderUpdate:
        icon = Icons.local_shipping;
        iconColor = const Color(0xFF10B981);
        break;
      case NotificationType.priceAlert:
        icon = Icons.trending_down;
        iconColor = const Color(0xFF0284C7);
        break;
      case NotificationType.announcement:
        icon = Icons.campaign;
        iconColor = const Color(0xFFF59E0B);
        break;
      case NotificationType.promotional:
        icon = Icons.local_offer;
        iconColor = const Color(0xFF8B5CF6);
        break;
    }

    return InkWell(
      onTap: () => provider.markAsRead(notif.id),
      borderRadius: BorderRadius.circular(14),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: notif.isRead
              ? const Color(0xFF1E293B)
              : const Color(0xFF0F2B48),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: notif.isRead
                ? const Color(0xFF334155)
                : const Color(0xFF0284C7).withValues(alpha: 0.5),
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          notif.title,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: notif.isRead
                                ? FontWeight.w600
                                : FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      if (!notif.isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Color(0xFF38BDF8),
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notif.body,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFFCBD5E1),
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    formattedTime,
                    style: const TextStyle(
                      fontSize: 10,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
