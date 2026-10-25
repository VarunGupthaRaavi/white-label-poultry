class DeliveryAddress {
  final String id;
  final String recipientName;
  final String phone;
  final String streetAddress;
  final String locality;
  final String city;
  final String state;
  final String pincode;
  final bool isDefault;

  const DeliveryAddress({
    required this.id,
    required this.recipientName,
    required this.phone,
    required this.streetAddress,
    required this.locality,
    required this.city,
    required this.state,
    required this.pincode,
    this.isDefault = false,
  });

  String get formattedAddress =>
      '$streetAddress, $locality, $city, $state - $pincode';

  DeliveryAddress copyWith({
    String? id,
    String? recipientName,
    String? phone,
    String? streetAddress,
    String? locality,
    String? city,
    String? state,
    String? pincode,
    bool? isDefault,
  }) {
    return DeliveryAddress(
      id: id ?? this.id,
      recipientName: recipientName ?? this.recipientName,
      phone: phone ?? this.phone,
      streetAddress: streetAddress ?? this.streetAddress,
      locality: locality ?? this.locality,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      isDefault: isDefault ?? this.isDefault,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'recipientName': recipientName,
      'phone': phone,
      'streetAddress': streetAddress,
      'locality': locality,
      'city': city,
      'state': state,
      'pincode': pincode,
      'isDefault': isDefault,
    };
  }

  factory DeliveryAddress.fromMap(Map<String, dynamic> map) {
    return DeliveryAddress(
      id: map['id'] as String? ?? '',
      recipientName: map['recipientName'] as String? ?? '',
      phone: map['phone'] as String? ?? '',
      streetAddress: map['streetAddress'] as String? ?? '',
      locality: map['locality'] as String? ?? '',
      city: map['city'] as String? ?? '',
      state: map['state'] as String? ?? '',
      pincode: map['pincode'] as String? ?? '',
      isDefault: map['isDefault'] as bool? ?? false,
    );
  }
}
