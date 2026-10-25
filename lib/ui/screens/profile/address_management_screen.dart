import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../domain/models/address.dart';
import '../../widgets/empty_state.dart';

class AddressManagementScreen extends StatelessWidget {
  const AddressManagementScreen({super.key});

  void _showAddAddressSheet(BuildContext context) {
    final authProvider = Provider.of<AppAuthProvider>(context, listen: false);

    final nameController = TextEditingController(
      text: authProvider.currentUser.displayName,
    );
    final phoneController = TextEditingController(
      text: authProvider.currentUser.phone,
    );
    final streetController = TextEditingController();
    final localityController = TextEditingController();
    final cityController = TextEditingController(text: 'Bengaluru');
    final stateController = TextEditingController(text: 'Karnataka');
    final pincodeController = TextEditingController();
    bool isDefault = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 24,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Add Delivery Address',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white70),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildField('Full Name', nameController),
                const SizedBox(height: 12),
                _buildField(
                  'Phone Number',
                  phoneController,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 12),
                _buildField('Street Address / Farm Plot', streetController),
                const SizedBox(height: 12),
                _buildField('Locality / Landmark', localityController),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildField('City', cityController)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildField('State', stateController)),
                  ],
                ),
                const SizedBox(height: 12),
                _buildField(
                  'PIN Code (6 digits)',
                  pincodeController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Checkbox(
                      value: isDefault,
                      activeColor: Theme.of(context).colorScheme.primary,
                      onChanged: (val) =>
                          setModalState(() => isDefault = val ?? false),
                    ),
                    const Text(
                      'Set as default delivery address',
                      style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (nameController.text.trim().isEmpty ||
                          streetController.text.trim().isEmpty ||
                          pincodeController.text.trim().isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Please fill all required address fields.',
                            ),
                          ),
                        );
                        return;
                      }

                      final newAddress = DeliveryAddress(
                        id: 'addr_${DateTime.now().millisecondsSinceEpoch}',
                        recipientName: nameController.text.trim(),
                        phone: phoneController.text.trim(),
                        streetAddress: streetController.text.trim(),
                        locality: localityController.text.trim(),
                        city: cityController.text.trim(),
                        state: stateController.text.trim(),
                        pincode: pincodeController.text.trim(),
                        isDefault: isDefault || authProvider.addresses.isEmpty,
                      );

                      authProvider.addAddress(newAddress);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Delivery address added successfully.'),
                          backgroundColor: Color(0xFF10B981),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Save Address',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField(
    String label,
    TextEditingController controller, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
        ),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: const Color(0xFF0F172A),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 10,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AppAuthProvider>(context);
    final addresses = authProvider.addresses;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Saved Delivery Addresses',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: addresses.isEmpty
          ? EmptyStateWidget(
              icon: Icons.location_off,
              title: 'No Addresses Found',
              description:
                  'Add a delivery address so that live poultry, table eggs, and feeds can be shipped to your location.',
              actionLabel: 'Add New Address',
              onAction: () => _showAddAddressSheet(context),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: addresses.length,
              itemBuilder: (context, index) {
                final addr = addresses[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: addr.isDefault
                          ? const Color(0xFF10B981)
                          : const Color(0xFF334155),
                      width: addr.isDefault ? 1.5 : 1.0,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            addr.recipientName,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: Colors.white,
                            ),
                          ),
                          if (addr.isDefault)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(
                                  0xFF10B981,
                                ).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'DEFAULT',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF34D399),
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Phone: ${addr.phone}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        addr.formattedAddress,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFFCBD5E1),
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (!addr.isDefault)
                            TextButton(
                              onPressed: () =>
                                  authProvider.setDefaultAddress(addr.id),
                              child: const Text('Set as Default'),
                            ),
                          TextButton(
                            onPressed: () =>
                                authProvider.removeAddress(addr.id),
                            child: const Text(
                              'Delete',
                              style: TextStyle(color: Color(0xFFF87171)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: Color(0xFF0F172A),
          border: Border(top: BorderSide(color: Color(0xFF334155))),
        ),
        child: SafeArea(
          child: ElevatedButton.icon(
            onPressed: () => _showAddAddressSheet(context),
            icon: const Icon(Icons.add_location_alt),
            label: const Text(
              'Add New Address',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
