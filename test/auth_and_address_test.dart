import 'package:flutter_test/flutter_test.dart';
import 'package:poulty_farm/core/auth/auth_provider.dart';
import 'package:poulty_farm/domain/models/address.dart';

void main() {
  group('Authentication & Address Management Tests', () {
    late AppAuthProvider authProvider;

    setUp(() {
      authProvider = AppAuthProvider();
    });

    test('Initializes with default customer profile in India', () {
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser.displayName, 'Suresh Kumar');
      expect(authProvider.currentUser.role, UserRole.customer);
      expect(authProvider.currentUser.phone, '+91-98765-43210');
      expect(authProvider.addresses.length, 2);
      expect(authProvider.defaultAddress.city, 'Bengaluru');
    });

    test('User login and logout updates state', () async {
      authProvider.logout();
      expect(authProvider.isAuthenticated, isFalse);

      final loggedIn = await authProvider.login(
        'farmer@example.com',
        'secret123',
      );
      expect(loggedIn, isTrue);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser.email, 'farmer@example.com');
    });

    test('User registration updates profile details', () async {
      final registered = await authProvider.register(
        name: 'Ramesh Agro Farms',
        email: 'ramesh@agrofarms.in',
        phone: '+91-98111-22233',
        password: 'securePassword123',
      );

      expect(registered, isTrue);
      expect(authProvider.currentUser.displayName, 'Ramesh Agro Farms');
      expect(authProvider.currentUser.email, 'ramesh@agrofarms.in');
      expect(authProvider.currentUser.phone, '+91-98111-22233');
    });

    test('Manages Indian delivery addresses and default flag', () {
      const newAddress = DeliveryAddress(
        id: 'addr_new_01',
        recipientName: 'Ramesh Agro (Main Gate)',
        phone: '+91-98111-22233',
        streetAddress: 'Survey 108, Poultry Corridor',
        locality: 'Near Bypass Highway',
        city: 'Hosur',
        state: 'Tamil Nadu',
        pincode: '635109',
        isDefault: true,
      );

      authProvider.addAddress(newAddress);
      expect(authProvider.addresses.length, 3);
      expect(authProvider.defaultAddress.id, 'addr_new_01');

      // Set original address as default
      authProvider.setDefaultAddress('addr_01');
      expect(authProvider.defaultAddress.id, 'addr_01');

      // Remove new address
      authProvider.removeAddress('addr_new_01');
      expect(authProvider.addresses.length, 2);
    });
  });
}
