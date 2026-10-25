'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  ScrollText,
  HeartPulse,
  ShoppingBag,
  Truck,
  Tag,
  PackageOpen,
  Users,
  UserCheck,
  TicketPercent,
  MessageSquare,
  BarChart3,
  Bell,
  Palette,
  Sparkles,
  Settings,
  Tractor,
  FileText,
  WalletCards,
  ShieldAlert,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { tenantId, role, isPlatformDeveloper, isClientAdmin, isSeller } = useAuth();

  // If on Login page, hide sidebar
  if (pathname === '/login') {
    return null;
  }

  // Determine current active section
  const isSellerArea = pathname.startsWith('/seller');
  const isAdminArea = pathname.startsWith('/admin');
  const isDevArea = !isSellerArea && !isAdminArea;

  const devLinks = [
    { href: '/', label: 'Overview & Analytics', icon: LayoutDashboard },
    { href: '/clients', label: 'Tenants & Clients', icon: Building2 },
    { href: '/clients/new', label: 'Onboard New Tenant', icon: UserPlus },
    { href: '/audit-logs', label: 'Control Plane Audit', icon: ScrollText },
    { href: '/health', label: 'Platform Operations', icon: HeartPulse },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Order Management', icon: ShoppingBag },
    { href: '/admin/logistics', label: 'Logistics & Dispatch', icon: Truck },
    { href: '/admin/products', label: 'Products & Categories', icon: Tag },
    { href: '/admin/inventory', label: 'Inventory & Stock', icon: PackageOpen },
    { href: '/admin/sellers', label: 'Sellers & KYC Verification', icon: Users },
    { href: '/admin/customers', label: 'Customer Registry', icon: Users },
    { href: '/admin/staff', label: 'Staff Accounts & Roles', icon: UserCheck },
    { href: '/admin/coupons', label: 'Coupons & Promos', icon: TicketPercent },
    { href: '/admin/reviews', label: 'Review Moderation', icon: MessageSquare },
    { href: '/admin/reports', label: 'Sales & Order Reports', icon: BarChart3 },
    { href: '/admin/notifications', label: 'Broadcasts & Alerts', icon: Bell },
    { href: '/admin/branding', label: 'Branding & Business', icon: Palette },
    { href: '/admin/features', label: 'Feature Entitlements', icon: Sparkles },
    { href: '/admin/audit', label: 'Tenant Audit History', icon: ScrollText },
    { href: '/admin/settings', label: 'Operational Settings', icon: Settings },
  ];

  const sellerLinks = [
    { href: '/seller', label: 'Farm Dashboard', icon: LayoutDashboard },
    { href: '/seller/orders', label: 'Incoming Orders', icon: ShoppingBag },
    { href: '/seller/products', label: 'My Products & Live Birds', icon: Tag },
    { href: '/seller/application', label: 'Farm Profile & KYC', icon: FileText },
    { href: '/seller/settlements', label: 'Earnings & Settlements', icon: WalletCards },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-3 space-y-4">
        {/* Navigation Mode Selector Tabs */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-[11px] font-bold">
          <Link
            href="/"
            className={`flex-1 text-center py-1.5 rounded-lg transition-all ${
              isDevArea
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dev
          </Link>
          <Link
            href="/admin"
            className={`flex-1 text-center py-1.5 rounded-lg transition-all ${
              isAdminArea
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin
          </Link>
          <Link
            href="/seller"
            className={`flex-1 text-center py-1.5 rounded-lg transition-all ${
              isSellerArea
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Seller
          </Link>
        </div>

        {/* Section Heading */}
        <div className="px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isDevArea && 'Developer Control Plane'}
            {isAdminArea && 'Client Admin Panel'}
            {isSellerArea && 'Seller Farm Portal'}
          </span>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="space-y-0.5 max-h-[calc(100vh-17rem)] overflow-y-auto pr-1">
          {isDevArea &&
            devLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}

          {isAdminArea &&
            adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}

          {isSellerArea &&
            sellerLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer Tenant Scope Information */}
      <div className="p-3 border-t border-slate-800">
        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>Tenant:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[120px]" title={tenantId}>
              {tenantId}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>Role:</span>
            <span
              className={`font-semibold uppercase text-[10px] ${
                role === 'developer'
                  ? 'text-brand-400'
                  : role === 'client_admin'
                  ? 'text-blue-400'
                  : role === 'seller'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
