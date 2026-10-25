'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '../context/AuthContext';
import {
  ShieldCheck,
  Building,
  UserCircle,
  ExternalLink,
  ChevronDown,
  LogIn,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { user, role, tenantId, switchRole, switchTenant, switchPersona } = useAuth();
  const pathname = usePathname();

  // On Login page, render minimal header
  if (pathname === '/login') {
    return (
      <header className="flex items-center justify-between h-16 px-6 bg-slate-900 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 font-black text-slate-950 text-base">
            W
          </div>
          <span className="font-bold text-slate-100 text-sm">White-Label Commerce Control Plane</span>
        </Link>
      </header>
    );
  }

  const isSellerArea = pathname.startsWith('/seller');
  const isAdminArea = pathname.startsWith('/admin');

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
                White-Label Commerce
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                  isAdminArea
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : isSellerArea
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                }`}
              >
                {isAdminArea ? 'Client Admin' : isSellerArea ? 'Seller Portal' : 'Dev Control Plane'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Poultry Enterprise Multi-Tenant Marketplace
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Tenant Environment Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 hover:border-slate-700 transition-colors">
            <Building className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-medium">
              {tenantId === 'apex-poultry-hub'
                ? 'Apex Poultry Hub'
                : 'Golden Yolk Hatcheries'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="absolute right-0 hidden group-hover:block w-56 mt-1 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 text-xs">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Tenant Environment
            </div>
            <button
              onClick={() => switchTenant('apex-poultry-hub')}
              className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex flex-col ${
                tenantId === 'apex-poultry-hub' ? 'bg-slate-800/60 text-brand-400' : 'text-slate-300'
              }`}
            >
              <span className="font-semibold">Apex Poultry Hub</span>
              <span className="text-[10px] text-slate-400 font-mono">apex-poultry-hub</span>
            </button>
            <button
              onClick={() => switchTenant('golden-yolk-hatcheries')}
              className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex flex-col ${
                tenantId === 'golden-yolk-hatcheries' ? 'bg-slate-800/60 text-brand-400' : 'text-slate-300'
              }`}
            >
              <span className="font-semibold">Golden Yolk Hatcheries</span>
              <span className="text-[10px] text-slate-400 font-mono">golden-yolk-hatcheries</span>
            </button>
          </div>
        </div>

        {/* Quick Link to Multi-Persona Login */}
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
        >
          <LogIn className="w-3.5 h-3.5 text-brand-400" />
          <span>Switch Persona</span>
        </Link>

        {/* Role Switcher Dropdown */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
              {user?.displayName || 'Developer'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Role: {role}</span>
          </div>

          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700">
              <UserCircle className="w-5 h-5" />
            </button>
            <div className="absolute right-0 hidden group-hover:block w-56 mt-1 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 text-xs">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Simulate Role Clearance
              </div>
              <button
                onClick={() => switchPersona('developer')}
                className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'developer' ? 'text-brand-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <div>
                  <p>Platform Developer</p>
                  <p className="text-[10px] text-slate-500 font-normal">Sarah Chen (Architect)</p>
                </div>
                {role === 'developer' && <ShieldCheck className="w-4 h-4 text-brand-400" />}
              </button>
              <button
                onClick={() => switchPersona('client_admin')}
                className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'client_admin' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <div>
                  <p>Client Admin</p>
                  <p className="text-[10px] text-slate-500 font-normal">Vikramaditya Rao (Hub Admin)</p>
                </div>
                {role === 'client_admin' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
              </button>
              <button
                onClick={() => switchPersona('seller')}
                className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'seller' ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <div>
                  <p>Poultry Farmer / Seller</p>
                  <p className="text-[10px] text-slate-500 font-normal">Ramesh Krishna (Farm Owner)</p>
                </div>
                {role === 'seller' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
              </button>
              <button
                onClick={() => switchPersona('customer')}
                className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${
                  role === 'customer' ? 'text-rose-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <div>
                  <p>Customer (Blocked)</p>
                  <p className="text-[10px] text-slate-500 font-normal">Anand Verma (Customer)</p>
                </div>
                {role === 'customer' && <ShieldCheck className="w-4 h-4 text-rose-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
