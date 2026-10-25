import '../domain/models/address.dart';
import '../domain/repositories/i_user_repository.dart';

class MockUserRepository implements IUserRepository {
  final Map<String, List<DeliveryAddress>> _addresses = {
    'user_cust_01': [
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
    ],
  };

  @override
  Future<List<DeliveryAddress>> getAddresses(String userId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    return _addresses[userId] ?? [];
  }

  @override
  Future<void> saveAddress(String userId, DeliveryAddress address) async {
    await Future.delayed(const Duration(milliseconds: 40));
    final list = _addresses.putIfAbsent(userId, () => []);
    final existingIndex = list.indexWhere((a) => a.id == address.id);
    if (existingIndex >= 0) {
      list[existingIndex] = address;
    } else {
      list.add(address);
    }
  }

  @override
  Future<void> deleteAddress(String userId, String addressId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    _addresses[userId]?.removeWhere((a) => a.id == addressId);
  }

  @override
  Future<void> setDefaultAddress(String userId, String addressId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    final list = _addresses[userId];
    if (list != null) {
      for (int i = 0; i < list.length; i++) {
        list[i] = list[i].copyWith(isDefault: list[i].id == addressId);
      }
    }
  }
}
