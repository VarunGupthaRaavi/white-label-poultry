'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

export function Gatekeeper({ children }: { children: React.ReactNode }) {
  const { isPlatformDeveloper, role, switchRole, user } = useAuth();

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
            Client administrators, sellers, and customer users must access their dedicated data planes and tenant mobile applications.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => switchRole('developer')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            <span>Restore Platform Developer Clearance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
