import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/branding/theme_provider.dart';

class SupportPolicyScreen extends StatelessWidget {
  const SupportPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final config = themeProvider.config;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Help, Support & Policies',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Contact Support Header Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.headset_mic,
                        color: Theme.of(context).colorScheme.primary,
                        size: 24,
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Farmer Helpdesk & Support',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Our dedicated agricultural logistics team is available from 6:00 AM to 8:00 PM (Monday to Saturday) to assist with order tracking, bird health inquiries, or feed dispatch.',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFFCBD5E1),
                      height: 1.4,
                    ),
                  ),
                  const Divider(color: Color(0xFF334155), height: 24),
                  _buildContactItem(
                    Icons.phone,
                    'Toll-Free Helpline',
                    config.supportPhone,
                  ),
                  const SizedBox(height: 10),
                  _buildContactItem(
                    Icons.email,
                    'Support Email',
                    config.supportEmail,
                  ),
                  const SizedBox(height: 10),
                  _buildContactItem(
                    Icons.business,
                    'Registered Office',
                    config.supportAddress,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Policy Section 1: Livestock Transit & Biosecurity
            _buildSectionHeader('Live Poultry Transit & Mortality Policy'),
            Container(
              margin: const EdgeInsets.only(top: 8, bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: const Text(
                '1. Live commercial birds (Broilers, Country birds, Pullets) are transported in sanitized, cross-ventilated crates.\n\n'
                '2. All transit losses exceeding 1.5% mortality will be compensated or credited upon providing video verification recorded during unboxing within 2 hours of arrival.\n\n'
                '3. Each bird batch includes an official vaccination certificate signed by a registered veterinary doctor.',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFFCBD5E1),
                  height: 1.5,
                ),
              ),
            ),

            // Policy Section 2: Table Eggs & Egg Breakage Policy
            _buildSectionHeader('Table Eggs Freshness & Breakage Policy'),
            Container(
              margin: const EdgeInsets.only(top: 8, bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: const Text(
                '1. Farm eggs are collected daily, sanitized, and candled to detect hairline cracks.\n\n'
                '2. In case of tray transit damage, report broken egg count with photo evidence to our support line for instant credit.\n\n'
                '3. Layer flocks are certified free of Salmonella Enteritidis.',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFFCBD5E1),
                  height: 1.5,
                ),
              ),
            ),

            // Policy Section 3: Legal Terms & Privacy
            _buildSectionHeader('Legal & Compliance'),
            Container(
              margin: const EdgeInsets.only(top: 8, bottom: 24),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Operating Entity: ${config.legalEntityName}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Terms of Service URL: ${config.termsOfServiceUrl}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF38BDF8),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Privacy Policy URL: ${config.privacyPolicyUrl}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF38BDF8),
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

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    );
  }

  Widget _buildContactItem(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
              ),
              const SizedBox(height: 1),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
