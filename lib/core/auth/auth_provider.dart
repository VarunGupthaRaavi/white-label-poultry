import 'package:flutter/material.dart';
import '../../domain/models/address.dart';

enum UserRole { customer, seller, clientAdmin, developer }

class UserProfile {
  final String uid;
  final String email;
  final String displayName;
  final String phone;
  final UserRole role;
  final String tenantId;

  const UserProfile({
    required this.uid,
    required this.email,
    required this.displayName,
    this.phone = '+91-98765-43210',
    required this.role,
    required this.tenantId,
  });

  String get roleLabel {
    switch (role) {
      case UserRole.customer:
        return 'Customer';
      case UserRole.seller:
        return 'Poultry Farmer / Seller';
      case UserRole.clientAdmin:
        return 'Client Administrator';
      case UserRole.developer:
        return 'Platform Developer';
    }
  }

  UserProfile copyWith({
    String? uid,
    String? email,
    String? displayName,
    String? phone,
    UserRole? role,
    String? tenantId,
  }) {
    return UserProfile(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      tenantId: tenantId ?? this.tenantId,
    );
  }
}

class AppAuthProvider extends ChangeNotifier {
  UserProfile _currentUser = const UserProfile(
    uid: 'user_cust_01',
    email: 'suresh.kumar@kisanpoultry.in',
    displayName: 'Suresh Kumar',
    phone: '+91-98765-43210',
    role: UserRole.customer,
    tenantId: 'apex_poultry',
  );

  bool _isAuthenticated = true;

  final List<DeliveryAddress> _addresses = [
    const DeliveryAddress(
      id: 'addr_01',
      recipientName: 'Suresh Kumar',
      phone: '+91-98765-43210',
      streetAddress: 'Plot 42, Green Valley Farm Road',
      locality: 'Near Agro Checkpost, Yelahanka',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560064',
      isDefault: true,
    ),
    const DeliveryAddress(
      id: 'addr_02',
      recipientName: 'Suresh Kumar (Wholesale Depot)',
      phone: '+91-98765-43210',
      streetAddress: 'Shed 12, APMC Market Yard',
      locality: 'Yeshwanthpur Industrial Area',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560022',
      isDefault: false,
    ),
  ];

  UserProfile get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  UserRole get role => _currentUser.role;
  bool get isSeller => _currentUser.role == UserRole.seller;
  bool get isAdmin => _currentUser.role == UserRole.clientAdmin;
  bool get isDeveloper => _currentUser.role == UserRole.developer;

  List<DeliveryAddress> get addresses => List.unmodifiable(_addresses);

  DeliveryAddress get defaultAddress {
    if (_addresses.isEmpty) {
      return const DeliveryAddress(
        id: 'addr_temp',
        recipientName: 'Suresh Kumar',
        phone: '+91-98765-43210',
        streetAddress: 'Plot 42, Krishi Bhavan Road',
        locality: 'Central Agri Zone',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true,
      );
    }
    return _addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _addresses.first,
    );
  }

  void switchRole(UserRole newRole) {
    String name = 'Suresh Kumar';
    if (newRole == UserRole.seller) {
      name = 'Krishna Poultry Farms (Seller)';
    } else if (newRole == UserRole.clientAdmin) {
      name = 'Regional Agri Admin';
    } else if (newRole == UserRole.developer) {
      name = 'Platform SuperAdmin';
    }

    _currentUser = UserProfile(
      uid: 'user_${newRole.name}_01',
      email: '${newRole.name}@kisanpoultry.in',
      displayName: name,
      phone: _currentUser.phone,
      role: newRole,
      tenantId: _currentUser.tenantId,
    );
    notifyListeners();
  }

  void updateTenant(String tenantId) {
    _currentUser = _currentUser.copyWith(tenantId: tenantId);
    notifyListeners();
  }

  void updateProfile({
    required String displayName,
    required String email,
    required String phone,
  }) {
    _currentUser = _currentUser.copyWith(
      displayName: displayName,
      email: email,
      phone: phone,
    );
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _isAuthenticated = true;
    _currentUser = _currentUser.copyWith(email: email);
    notifyListeners();
    return true;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 350));
    _isAuthenticated = true;
    _currentUser = UserProfile(
      uid: 'user_cust_${DateTime.now().millisecondsSinceEpoch}',
      email: email,
      displayName: name,
      phone: phone,
      role: UserRole.customer,
      tenantId: _currentUser.tenantId,
    );
    notifyListeners();
    return true;
  }

  void logout() {
    _isAuthenticated = false;
    notifyListeners();
  }

  void addAddress(DeliveryAddress address) {
    if (address.isDefault) {
      for (int i = 0; i < _addresses.length; i++) {
        _addresses[i] = _addresses[i].copyWith(isDefault: false);
      }
    }
    _addresses.add(address);
    notifyListeners();
  }

  void removeAddress(String addressId) {
    _addresses.removeWhere((a) => a.id == addressId);
    if (_addresses.isNotEmpty && !_addresses.any((a) => a.isDefault)) {
      _addresses[0] = _addresses[0].copyWith(isDefault: true);
    }
    notifyListeners();
  }

  void setDefaultAddress(String addressId) {
    for (int i = 0; i < _addresses.length; i++) {
      _addresses[i] = _addresses[i].copyWith(
        isDefault: _addresses[i].id == addressId,
      );
    }
    notifyListeners();
  }
}
