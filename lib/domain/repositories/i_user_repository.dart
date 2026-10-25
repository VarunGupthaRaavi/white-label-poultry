import '../models/address.dart';

abstract class IUserRepository {
  Future<List<DeliveryAddress>> getAddresses(String userId);
  Future<void> saveAddress(String userId, DeliveryAddress address);
  Future<void> deleteAddress(String userId, String addressId);
  Future<void> setDefaultAddress(String userId, String addressId);
}
