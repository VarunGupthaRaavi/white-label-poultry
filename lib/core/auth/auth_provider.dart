import 'package:flutter/material.dart';

enum UserRole {
  customer,
  seller,
  clientAdmin,
  developer,
}

class UserProfile {
  final String uid;
  final String email;
  final String displayName;
  final UserRole role;
  final String tenantId;

  const UserProfile({
    required this.uid,
    required this.email,
    required this.displayName,
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
}

class AppAuthProvider extends ChangeNotifier {
  UserProfile _currentUser = const UserProfile(
    uid: 'user_cust_01',
    email: 'farmer.buyer@poultryhub.com',
    displayName: 'David Mwangi (Buyer)',
    role: UserRole.customer,
    tenantId: 'apex-poultry-hub',
  );

  UserProfile get currentUser => _currentUser;
  UserRole get role => _currentUser.role;
  bool get isSeller => _currentUser.role == UserRole.seller;
  bool get isAdmin => _currentUser.role == UserRole.clientAdmin;
  bool get isDeveloper => _currentUser.role == UserRole.developer;

  void switchRole(UserRole newRole) {
    String name = 'David Mwangi';
    if (newRole == UserRole.seller) {
      name = 'Sunrise Hatchery (Seller)';
    } else if (newRole == UserRole.clientAdmin) {
      name = 'Regional Admin';
    } else if (newRole == UserRole.developer) {
      name = 'Platform SuperAdmin';
    }

    _currentUser = UserProfile(
      uid: 'user_${newRole.name}_01',
      email: '${newRole.name}@poultryhub.com',
      displayName: name,
      role: newRole,
      tenantId: _currentUser.tenantId,
    );
    notifyListeners();
  }

  void updateTenant(String tenantId) {
    _currentUser = UserProfile(
      uid: _currentUser.uid,
      email: _currentUser.email,
      displayName: _currentUser.displayName,
      role: _currentUser.role,
      tenantId: tenantId,
    );
    notifyListeners();
  }
}
