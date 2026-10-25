import 'package:flutter/material.dart';

enum EntitlementState {
  enabled,
  disabled,
  requested,
  approved,
  suspended,
}

class TenantEntitlements {
  final String tenantId;
  final int version;
  final Map<String, EntitlementState> modules;

  const TenantEntitlements({
    required this.tenantId,
    required this.version,
    required this.modules,
  });

  bool isEnabled(String moduleKey) {
    return modules[moduleKey] == EntitlementState.enabled;
  }

  factory TenantEntitlements.fromMap(String tenantId, Map<String, dynamic> map) {
    final rawModules = Map<String, dynamic>.from(map['modules'] ?? {});
    final parsed = <String, EntitlementState>{};

    for (final entry in rawModules.entries) {
      final stateStr = entry.value is Map ? entry.value['state'] : entry.value;
      parsed[entry.key] = _parseState(stateStr);
    }

    return TenantEntitlements(
      tenantId: tenantId,
      version: map['version'] ?? 1,
      modules: parsed,
    );
  }

  static EntitlementState _parseState(dynamic state) {
    switch (state) {
      case 'enabled':
        return EntitlementState.enabled;
      case 'requested':
        return EntitlementState.requested;
      case 'approved':
        return EntitlementState.approved;
      case 'suspended':
        return EntitlementState.suspended;
      default:
        return EntitlementState.disabled;
    }
  }
}

/// A declarative Widget gate that conditionally displays features based on tenant entitlements.
class EntitlementGuard extends StatelessWidget {
  final String moduleKey;
  final Widget child;
  final Widget? fallback;
  final bool showNoticeWhenDisabled;

  const EntitlementGuard({
    super.key,
    required this.moduleKey,
    required this.child,
    this.fallback,
    this.showNoticeWhenDisabled = false,
  });

  @override
  Widget build(BuildContext context) {
    // In our provider tree, we access EntitlementsProvider
    final entitlements = EntitlementsScope.of(context);
    final isAllowed = entitlements.isEnabled(moduleKey);

    if (isAllowed) {
      return child;
    }

    if (fallback != null) {
      return fallback!;
    }

    if (showNoticeWhenDisabled) {
      return Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Row(
          children: [
            const Icon(Icons.lock_outline, size: 18, color: Color(0xFF94A3B8)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Module [$moduleKey] is not enabled for this tenant tier.',
                style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
              ),
            ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }
}

class EntitlementsScope extends InheritedWidget {
  final TenantEntitlements entitlements;

  const EntitlementsScope({
    super.key,
    required this.entitlements,
    required super.child,
  });

  static TenantEntitlements of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<EntitlementsScope>();
    return scope?.entitlements ??
        const TenantEntitlements(
          tenantId: 'fallback',
          version: 1,
          modules: {},
        );
  }

  @override
  bool updateShouldNotify(EntitlementsScope oldWidget) {
    return entitlements != oldWidget.entitlements;
  }
}
