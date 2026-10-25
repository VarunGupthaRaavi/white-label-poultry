'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  ScrollText,
  HeartPulse,
  Palette,
  Sliders,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview & Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Tenants & Clients', icon: Building2 },
    { href: '/clients/new', label: 'Onboard Client', icon: UserPlus },
    { href: '/audit-logs', label: 'Audit Trail Logs', icon: ScrollText },
    { href: '/health', label: 'Platform Operations', icon: HeartPulse },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Control Plane
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Client Modules
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Flutter Customer App</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consumes dynamic branding tokens & feature entitlements at runtime.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Environment Card */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 font-mono mb-1">
            <span>Project:</span>
            <span className="text-slate-200 font-semibold">poultry-platform</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>Mode:</span>
            <span className="text-emerald-400 font-semibold">Control Plane</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
