'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Store,
  Tractor,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
} from 'lucide-react';

export default function LoginPage() {
  const { switchPersona, switchTenant, tenantId, role } = useAuth();
  const router = useRouter();

  const handleSelectPersona = (personaKey: 'developer' | 'client_admin' | 'seller' | 'customer', targetPath: string) => {
    switchPersona(personaKey);
    router.push(targetPath);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Multi-Tenant Identity & Access Orchestration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Select Access Persona & Tenant Scope
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Explore the white-label poultry commerce platform across all 4 operational layers. Switch roles seamlessly with cryptographic boundary simulation.
        </p>
      </div>

      {/* Tenant Scope Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-brand-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Target Tenant Environment</p>
            <p className="text-sm font-bold text-slate-100">
              {tenantId === 'apex-poultry-hub' ? 'Apex Poultry Hub & Market' : 'Golden Yolk Hatcheries'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTenant('apex-poultry-hub')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tenantId === 'apex-poultry-hub'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
            }`}
          >
            apex-poultry-hub
          </button>
          <button
            onClick={() => switchTenant('golden-yolk-hatcheries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tenantId === 'golden-yolk-hatcheries'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
            }`}
          >
            golden-yolk-hatcheries
          </button>
        </div>
      </div>

      {/* 4 Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Persona 1: Platform Developer */}
        <div className="p-6 bg-slate-900 border border-slate-800 hover:border-brand-500/40 rounded-2xl flex flex-col justify-between transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Root Clearance
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
                Platform Developer
              </h3>
              <p className="text-xs text-slate-400 mt-1">Sarah Chen (Principal Architect)</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Manages tenant onboarding, allocates cryptographic keys, approves module entitlements, and inspects global audit trails.
              </p>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Developer Control Plane (`/`, `/clients`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Feature Entitlement Approval Engine</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPersona('developer', '/')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            <span>Enter Developer Control Plane</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Persona 2: Client Administrator */}
        <div className="p-6 bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Tenant Admin
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                Client Administrator
              </h3>
              <p className="text-xs text-slate-400 mt-1">Vikramaditya Rao (Hub Admin)</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Manages tenant orders, logistics fleet, seller onboarding & KYC approvals, product catalog moderation, staff roles, and branding.
              </p>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Client Administration Panel (`/admin`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Seller KYC Verification & Commission Config</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPersona('client_admin', '/admin')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <span>Enter Client Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Persona 3: Poultry Farmer / Seller */}
        <div className="p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Tractor className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Seller Portal
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                Poultry Farmer / Seller
              </h3>
              <p className="text-xs text-slate-400 mt-1">Ramesh Krishna (Krishna Broiler Farms)</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Updates live bird batches, adjusts kg prices in ₹ INR, submits vet passes, and advances order packaging states.
              </p>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Seller Farm Portal (`/seller`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Restricted to permitted state transitions</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPersona('seller', '/seller')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
          >
            <span>Enter Seller Farm Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Persona 4: Customer */}
        <div className="p-6 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Mobile Consumer
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-slate-300 transition-colors">
                End Customer (Flutter App)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Anand Verma</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Accesses marketplace exclusively via the Flutter mobile client. Prohibited from touching web admin and seller management endpoints.
              </p>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2 text-rose-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Administrative web panels strictly blocked (403)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runs on Android/iOS/Web Flutter engine</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPersona('customer', '/admin')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <span>Simulate Customer Clearance (Verify 403)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
