'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '../context/AuthContext';
import { Activity, ShieldCheck, Plus, UserCircle, AlertCircle } from 'lucide-react';

export function Navbar() {
  const { user, role, switchRole, isPlatformDeveloper } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 shadow-md shadow-brand-500/20 text-slate-950 font-black text-lg">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm tracking-tight group-hover:text-brand-400 transition-colors">
                White-Label Commerce Control Plane
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Poultry Enterprise Multi-Tenant Orchestrator
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Pulse */}
        <Link
          href="/health"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors"
        >
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">Control Plane Operational</span>
        </Link>

        {/* Quick Action */}
        <Link
          href="/clients/new"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Onboard Client</span>
        </Link>

        {/* Role Switcher (Simulates RBAC Gateways) */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-xs font-medium text-slate-200">{user?.displayName || 'Developer'}</span>
            <span className="text-[10px] text-slate-400 font-mono">Role: {role}</span>
          </div>

          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700">
              <UserCircle className="w-5 h-5" />
            </button>
            <div className="absolute right-0 hidden group-hover:block w-48 mt-1 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 text-xs">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Simulate Role
              </div>
              <button
                onClick={() => switchRole('developer')}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'developer' ? 'text-brand-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Platform Developer</span>
                {role === 'developer' && <ShieldCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => switchRole('client_admin')}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'client_admin' ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Client Admin (Restricted)</span>
                {role === 'client_admin' && <ShieldCheck className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => switchRole('customer')}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'customer' ? 'text-rose-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Customer (Blocked)</span>
                {role === 'customer' && <ShieldCheck className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
