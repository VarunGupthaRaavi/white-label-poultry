'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Lock, ArrowRight, Store, Tractor } from 'lucide-react';
import Link from 'next/link';

export function Gatekeeper({ children }: { children: React.ReactNode }) {
  const { isPlatformDeveloper, isClientAdmin, isSeller, role, switchPersona, user } = useAuth();
  const pathname = usePathname();

  // 1. Allow login page unconditionally
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 2. Seller Portal Check
  if (pathname.startsWith('/seller')) {
    if (!isSeller) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto shadow-2xl">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl mb-4">
            <Tractor className="w-12 h-12" />
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            403 Forbidden: Verified Seller Clearance Required
          </h2>

          <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
            The Seller Farm Portal is restricted to verified poultry farmers, partner hatcheries, and tenant operations managers.
            Your current identity ({user?.email || 'Guest'}) holds the role{' '}
            <span className="font-mono font-semibold text-amber-400 uppercase">[{role}]</span>.
          </p>

          <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl text-left w-full space-y-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Policy: tenant_data_plane.enforce_seller_ownership()</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Customers cannot view farm fulfillment queues, seller KYC documents, or pricing controls.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchPersona('seller')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              <span>Switch to Verified Farmer Persona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/login"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Portal Login
            </Link>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // 3. Client Admin Panel Check
  if (pathname.startsWith('/admin')) {
    if (!isClientAdmin) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto shadow-2xl">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl mb-4">
            <Store className="w-12 h-12" />
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            403 Forbidden: Client Administrator Clearance Required
          </h2>

          <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
            The Client Admin Panel is restricted to authorized tenant administrators and staff operators.
            Your current identity ({user?.email || 'Guest'}) holds the role{' '}
            <span className="font-mono font-semibold text-blue-400 uppercase">[{role}]</span>.
          </p>

          <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl text-left w-full space-y-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Policy: tenant_admin_boundary.enforce_client_admin()</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Sellers and end-customers cannot manage platform catalog moderation, approve KYC documents, or reassign staff roles.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchPersona('client_admin')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <span>Switch to Client Admin Persona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/login"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Portal Login
            </Link>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // 4. Developer Control Plane Check (Root /clients /audit-logs /health)
  if (!isPlatformDeveloper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto shadow-2xl">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <h2 className="text-xl font-bold text-slate-100">
          403 Forbidden: Platform Developer Clearance Required
        </h2>

        <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          The Developer Control Plane is strictly restricted to platform super-administrators and platform developers.
          Your current authenticated identity ({user?.email || 'Guest'}) holds the role{' '}
          <span className="font-mono font-semibold text-rose-400 uppercase">[{role}]</span>, which is prohibited from accessing platform control plane collections and operations.
        </p>

        <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl text-left w-full space-y-2 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Policy: platform_control_plane.enforce_developer_role()</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Client administrators, sellers, and customer users must access their dedicated tenant panels and mobile apps.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => switchPersona('developer')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            <span>Restore Platform Developer Clearance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/admin"
            className="px-4 py-2.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-xl transition-all"
          >
            Go to Client Admin Panel
          </Link>
          <Link
            href="/seller"
            className="px-4 py-2.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl transition-all"
          >
            Go to Seller Farm Portal
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
