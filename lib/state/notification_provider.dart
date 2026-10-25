import 'package:flutter/material.dart';
import '../domain/models/notification_item.dart';

class NotificationProvider extends ChangeNotifier {
  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: 'notif_01',
      title: 'Order Out for Delivery 🚚',
      body:
          'Your order #ORD-2026-8842 from Krishna Poultry Farms is on the delivery van.',
      type: NotificationType.orderUpdate,
      timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
      isRead: false,
      relatedOrderId: 'ORD-2026-8842',
    ),
    NotificationItem(
      id: 'notif_02',
      title: 'Desi Eggs Fresh Stock Arrived 🥚',
      body: '110 packs of Organic Desi Brown Eggs just stocked at ₹ 140/pack.',
      type: NotificationType.priceAlert,
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      isRead: false,
    ),
    NotificationItem(
      id: 'notif_03',
      title: 'Welcome to Kisan Poultry Hub! 🌾',
      body:
          'Connect directly with certified breeders and wholesale feed mills across India.',
      type: NotificationType.announcement,
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      isRead: true,
    ),
  ];

  List<NotificationItem> get notifications => List.unmodifiable(_notifications);

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index >= 0) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (int i = 0; i < _notifications.length; i++) {
      _notifications[i] = _notifications[i].copyWith(isRead: true);
    }
    notifyListeners();
  }

  void addNotification(NotificationItem item) {
    _notifications.insert(0, item);
    notifyListeners();
  }
}
