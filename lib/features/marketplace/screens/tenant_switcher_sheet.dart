import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/branding/theme_provider.dart';
import '../../../core/auth/auth_provider.dart';

class TenantSwitcherSheet extends StatelessWidget {
  const TenantSwitcherSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AppAuthProvider>(context);
    final currentTenant = themeProvider.branding;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0F172A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'White-Label Tenant & Role Switcher',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white70),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Select an active tenant to dynamically re-theme colors, typography, currency, and feature entitlements at runtime.',
              style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 16),
            const Text(
              'ACTIVE TENANT MARKETPLACE',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFF64748B),
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 8),
            ...themeProvider.availableTenants.map((t) {
              final isSelected = t.tenantId == currentTenant.tenantId;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? t.colors.primary.withValues(alpha: 0.15)
                      : const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected
                        ? t.colors.primary
                        : const Color(0xFF334155),
                    width: isSelected ? 1.5 : 1.0,
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: ListTile(
                    title: Text(
                      t.displayName,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: isSelected ? t.colors.primary : Colors.white,
                      ),
                    ),
                    subtitle: Text(
                      'Unit: ${t.terminology.itemUnit} • Currency: ${t.defaultCurrency} • Seller: ${t.terminology.sellerLabel}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                    trailing: isSelected
                        ? Icon(Icons.check_circle, color: t.colors.primary)
                        : const Icon(
                            Icons.chevron_right,
                            color: Color(0xFF64748B),
                          ),
                    onTap: () {
                      themeProvider.switchTenant(t.tenantId);
                      authProvider.updateTenant(t.tenantId);
                      Navigator.pop(context);
                    },
                  ),
                ),
              );
            }),
            const SizedBox(height: 16),
            const Text(
              'SIMULATE USER IDENTITY & ROLE',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFF64748B),
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildRoleChip(
                  context,
                  UserRole.customer,
                  'Customer (Buyer)',
                  authProvider.role == UserRole.customer,
                ),
                _buildRoleChip(
                  context,
                  UserRole.seller,
                  'Seller (Poultry Farmer)',
                  authProvider.role == UserRole.seller,
                ),
                _buildRoleChip(
                  context,
                  UserRole.clientAdmin,
                  'Client Admin',
                  authProvider.role == UserRole.clientAdmin,
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleChip(
    BuildContext context,
    UserRole role,
    String label,
    bool isSelected,
  ) {
    final authProvider = Provider.of<AppAuthProvider>(context, listen: false);
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) {
        authProvider.switchRole(role);
        Navigator.pop(context);
      },
      selectedColor: const Color(0xFF10B981).withValues(alpha: 0.25),
      backgroundColor: const Color(0xFF1E293B),
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        color: isSelected ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
      ),
      side: BorderSide(
        color: isSelected ? const Color(0xFF10B981) : const Color(0xFF334155),
      ),
    );
  }
}
