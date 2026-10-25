'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { tenantService } from '../../../lib/tenantService';
import { operationsService } from '../../../lib/operationsService';
import { TenantEntitlements } from '../../../types';
import { Sparkles, CheckCircle2, Clock, Lock, Send, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminFeaturesPage() {
  const { tenantId } = useAuth();
  const [entitlements, setEntitlements] = useState<TenantEntitlements | null>(null);
  const [requestedModules, setRequestedModules] = useState<string[]>([]);
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({});

  const refreshEntitlements = async () => {
    const ent = await tenantService.getEntitlements(tenantId);
    setEntitlements(ent);
    const reqs = operationsService.getModuleRequests(tenantId);
    setRequestedModules(reqs.map((r) => r.moduleKey));
  };

  useEffect(() => {
    refreshEntitlements();
  }, [tenantId]);

  const handleRequestModule = (moduleKey: string) => {
    operationsService.requestModuleEntitlement(
      tenantId,
      moduleKey,
      requestNotes[moduleKey] || 'Requested by Client Administrator via self-service portal'
    );
    refreshEntitlements();
    alert(`Entitlement request for [${moduleKey}] sent to Developer Control Plane.`);
  };

  const ALL_MODULES = [
    {
      key: 'seller_portal',
      title: 'Multi-Seller Farmer Portal',
      description: 'Permits poultry farmers to register, submit biosecurity KYC, and fulfill live bird batches.',
    },
    {
      key: 'coupons_and_promotions',
      title: 'Coupons & Promotional Vouchers',
      description: 'Discount codes, seasonal festive vouchers, and threshold promotional incentives in ₹ INR.',
    },
    {
      key: 'reviews_and_ratings',
      title: 'Customer Reviews & Moderation',
      description: 'Enables verified product reviews, 5-star ratings, and admin moderation workflows.',
    },
    {
      key: 'custom_domain',
      title: 'White-Label Custom Domain CNAME',
      description: 'Binds tenant storefront and admin dashboards to dedicated corporate hostnames.',
    },
    {
      key: 'advanced_analytics',
      title: 'Advanced Predictive BI & Demand Forecasting',
      description: 'Historical egg yield forecasting and seasonal festival meat demand trend models.',
    },
    {
      key: 'payment_gateway',
      title: 'Online Payment Gateway (UPI / Razorpay)',
      description: 'Integrated digital payment processing and merchant split settlement (Phase 4 module).',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Feature Availability & Entitlement Center</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View enabled platform capabilities, review licensing limits, and request optional module activations.
        </p>
      </div>

      {/* Security Boundary Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Security Rule: Self-Approval Prohibited</span>
            <p className="text-slate-400 text-[11px]">
              Entitlement grants require verification and approval by the Developer Control Plane.
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          Policy: tenant_admin.cannot_approve_entitlements()
        </span>
      </div>

      {/* Modules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_MODULES.map((mod) => {
          const entMod = entitlements?.modules?.[mod.key];
          const isEnabled = entMod?.state === 'enabled';
          const isPending = requestedModules.includes(mod.key) && !isEnabled;

          return (
            <div
              key={mod.key}
              className={`p-5 bg-slate-900 border rounded-2xl space-y-4 shadow-lg transition-all ${
                isEnabled ? 'border-emerald-500/30' : isPending ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{mod.title}</h3>
                  <span className="font-mono text-[10px] text-slate-500">{mod.key}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isPending
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isEnabled ? 'Active / Enabled' : isPending ? 'Pending Developer Review' : 'Disabled'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                {isEnabled ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Granted & Licensed</span>
                  </span>
                ) : isPending ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Developer Control Plane Approval</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleRequestModule(mod.key)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Activation</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
